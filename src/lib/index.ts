import { action, query, redirect } from "@solidjs/router";
import { promises as fs } from "fs";
import path from "path";
import crypto from "crypto";
import { db } from "./db";
export * from "./utils";
import {
  getSession,
  login,
  logout as logoutSession,
  register,
  validatePassword,
  validateUsername,
  requireUser,
  requireAdmin,
  hashPassword,
  logActivity,
} from "./server";

// ========== AUTH ==========

export const getUser = query(async () => {
  "use server";
  try {
    const session = await getSession();
    const userId = session.data.userId;
    if (userId === undefined) throw new Error("No user id");
    const user = await db.user.findUnique({
      where: { id: userId },
      include: { divisi: true },
    });
    if (!user || (user as any).status === "NONAKTIF")
      throw new Error("User invalid");
    return {
      id: user.id,
      username: user.username,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      role: user.role,
      divisi: user.divisi?.name ?? null,
      divisiId: user.divisiId,
      avatar: user.avatar,
      status: (user as any).status,
    };
  } catch {
    await logoutSession();
    throw redirect("/login");
  }
}, "user");

export const loginOrRegister = action(async (formData: FormData) => {
  "use server";
  const username = String(formData.get("username"));
  const password = String(formData.get("password"));
  const loginType = String(formData.get("loginType"));
  let error = validateUsername(username) || validatePassword(password);
  if (error) return new Error(error);

  try {
    const user = await (loginType !== "login"
      ? register(username, password)
      : login(username, password));
    const session = await getSession();
    await session.update((d) => {
      d.userId = user.id;
    });
    await logActivity(
      loginType !== "login" ? "REGISTER" : "LOGIN",
      loginType !== "login" ? "register success" : "login success",
      user.id,
    );
    return redirect(user.role === "ADMIN" ? "/admin/dashboard" : "/dashboard");
  } catch (err) {
    return err as Error;
  }
});

export const logout = action(async () => {
  "use server";
  await logActivity("LOGOUT", "logout success");
  await logoutSession();
  return redirect("/login");
});

// ========== ABSENSI (ATTENDANCE) ==========

const getLocalDateAsUTC = () => {
  const d = new Date();
  return new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
};

export const getTodayAttendance = query(async () => {
  "use server";
  const user = await requireUser();
  const today = getLocalDateAsUTC();
  const record = await db.absensi.findUnique({
    where: { userId_date: { userId: user.id, date: today } },
  });
  return record;
}, "todayAttendance");

const getSettings = async () => {
  const filePath = path.join(process.cwd(), "settings.json");
  try {
    const data = await fs.readFile(filePath, "utf-8");
    return JSON.parse(data);
  } catch {
    return {
      jamMasuk: "08:00",
      toleransiMenit: 0,
      lokasiKantor: "Kantor PT. SBI Cilacap",
    };
  }
};

export const getSystemSettings = query(async () => {
  "use server";
  await requireAdmin();
  return getSettings();
}, "systemSettings");

export const updateSystemSettings = action(async (formData: FormData) => {
  "use server";
  await requireAdmin();
  const jamMasuk = String(formData.get("jamMasuk") || "08:00");
  const toleransiMenit = Number(formData.get("toleransiMenit") || 0);
  const lokasiKantor = String(
    formData.get("lokasiKantor") || "Kantor PT. SBI Cilacap",
  );

  const settings = { jamMasuk, toleransiMenit, lokasiKantor };
  const filePath = path.join(process.cwd(), "settings.json");
  await fs.writeFile(filePath, JSON.stringify(settings, null, 2), "utf-8");
  await logActivity("UPDATE_PENGATURAN", "update settings success");
  return redirect("/admin/dashboard");
});

export const checkIn = action(async () => {
  "use server";
  const user = await requireUser();
  if ((user as any).status === "DITANGGUHKAN") {
    return new Error(
      "Akun Anda sedang ditangguhkan. Anda tidak dapat melakukan absensi.",
    );
  }
  const now = new Date();
  const today = getLocalDateAsUTC();

  const existing = await db.absensi.findUnique({
    where: { userId_date: { userId: user.id, date: today } },
  });
  if (existing?.checkIn) {
    return new Error("Anda sudah Check-In hari ini.");
  }

  const settings = await getSettings();
  const [tHour, tMin] = settings.jamMasuk.split(":").map(Number);
  const limitMinutes = tHour * 60 + tMin + Number(settings.toleransiMenit || 0);
  const nowMinutes = now.getHours() * 60 + now.getMinutes();

  const status = nowMinutes > limitMinutes ? "TELAT" : "HADIR";
  const location = settings.lokasiKantor || "Kantor PT. SBI Cilacap";

  await db.absensi.upsert({
    where: { userId_date: { userId: user.id, date: today } },
    update: { checkIn: now, status },
    create: {
      userId: user.id,
      date: today,
      checkIn: now,
      status,
      location,
    },
  });
  await logActivity("CHECK_IN", `checkin success (${status.toLowerCase()})`);
  return redirect("/dashboard");
});

export const checkOut = action(async () => {
  "use server";
  const user = await requireUser();
  if ((user as any).status === "DITANGGUHKAN") {
    return new Error(
      "Akun Anda sedang ditangguhkan. Anda tidak dapat melakukan absensi.",
    );
  }
  const now = new Date();
  const today = getLocalDateAsUTC();

  const existing = await db.absensi.findUnique({
    where: { userId_date: { userId: user.id, date: today } },
  });
  if (!existing?.checkIn) {
    return new Error("Anda belum Check-In hari ini.");
  }
  if (existing.checkOut) {
    return new Error("Anda sudah Check-Out hari ini.");
  }

  await db.absensi.update({
    where: { id: existing.id },
    data: { checkOut: now },
  });
  await logActivity("CHECK_OUT", "checkout success");
  return redirect("/dashboard");
});

export const getAttendanceHistory = query(async () => {
  "use server";
  const user = await requireUser();
  return db.absensi.findMany({
    where: { userId: user.id },
    orderBy: { date: "desc" },
    take: 30,
  });
}, "attendanceHistory");

// ========== IZIN (LEAVE REQUEST) ==========

const parseLocalDateAsUTC = (dateStr: string) => {
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day));
};

export const submitIzin = action(async (formData: FormData) => {
  "use server";
  const user = await requireUser();
  if ((user as any).status === "DITANGGUHKAN") {
    return new Error(
      "Akun Anda sedang ditangguhkan. Anda tidak dapat mengajukan izin.",
    );
  }
  const startDate = parseLocalDateAsUTC(String(formData.get("startDate")));
  const endDate = parseLocalDateAsUTC(String(formData.get("endDate")));
  const type = String(formData.get("type")) as "SAKIT" | "IZIN" | "CUTI";
  const reason = String(formData.get("reason"));
  const file = formData.get("attachment") as File | null;

  if (!reason || reason.length < 5)
    return new Error("Alasan minimal 5 karakter.");
  if (startDate > endDate)
    return new Error("Tanggal mulai tidak boleh setelah tanggal selesai.");

  let attachmentPath: string | null = null;
  if (file && file.size > 0 && file.name) {
    const MAX_FILE_SIZE = 500 * 1024; // 500KB
    if (file.size > MAX_FILE_SIZE) {
      return new Error(
        "Ukuran berkas lampiran maksimal 500KB.",
      );
    }

    const extension = path.extname(file.name).toLowerCase();
    const allowedExtensions = [".png", ".jpg", ".jpeg", ".pdf"];
    const allowedMimeTypes = [
      "image/png",
      "image/jpeg",
      "image/jpg",
      "application/pdf",
    ];

    if (
      !allowedExtensions.includes(extension) ||
      !allowedMimeTypes.includes(file.type)
    ) {
      return new Error(
        "Format berkas lampiran harus berupa gambar (JPG, PNG) atau PDF.",
      );
    }
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filename = `${crypto.randomBytes(16).toString("hex")}${extension}`;
    let uploadsDir = path.join(process.cwd(), "public", "uploads");

    // Jika berjalan di production (.output/public ada), simpan ke folder build statis
    const prodPublicDir = path.join(process.cwd(), ".output", "public");
    try {
      await fs.access(prodPublicDir);
      uploadsDir = path.join(prodPublicDir, "uploads");
    } catch {}

    await fs.mkdir(uploadsDir, { recursive: true });
    await fs.writeFile(path.join(uploadsDir, filename), buffer);
    attachmentPath = `/api/uploads?file=${filename}`;
  }

  await db.izin.create({
    data: {
      userId: user.id,
      startDate,
      endDate,
      type,
      reason,
      attachment: attachmentPath,
      status: "PENDING",
    },
  });
  await logActivity(
    "PENGAJUAN_IZIN",
    `submit leave success (${type.toLowerCase()})`,
  );
  return redirect("/izin");
});

export const getUserIzinList = query(async () => {
  "use server";
  const user = await requireUser();
  return db.izin.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 20,
  });
}, "userIzinList");

// ========== PROFIL ==========

export const updateProfile = action(async (formData: FormData) => {
  "use server";
  const user = await requireUser();
  const fullName = String(formData.get("fullName"));
  const email = String(formData.get("email"));
  const phone = String(formData.get("phone") || "");

  if (!fullName || fullName.length < 2)
    return new Error("Nama lengkap minimal 2 karakter.");
  if (!email || !email.includes("@")) return new Error("Email tidak valid.");

  await db.user.update({
    where: { id: user.id },
    data: { fullName, email, phone: phone || null },
  });
  return redirect("/profil");
});

export const changePassword = action(async (formData: FormData) => {
  "use server";
  const user = await requireUser();
  const oldPassword = String(formData.get("oldPassword"));
  const newPassword = String(formData.get("newPassword"));
  const confirmPassword = String(formData.get("confirmPassword"));

  if (newPassword !== confirmPassword) {
    return new Error("Password baru dan konfirmasi password tidak cocok.");
  }

  const pwdError = validatePassword(newPassword);
  if (pwdError) return new Error(pwdError);

  const dbUser = await db.user.findUnique({ where: { id: user.id } });
  const verifyPasswordImport = (await import("./server")).verifyPassword;
  const hashPasswordImport = (await import("./server")).hashPassword;

  if (!dbUser || !verifyPasswordImport(oldPassword, dbUser.password)) {
    return new Error("Password saat ini salah.");
  }

  await db.user.update({
    where: { id: user.id },
    data: { password: hashPasswordImport(newPassword) },
  });

  return { success: true };
});

// ========== ADMIN: DASHBOARD ==========

export const getAdminStats = query(async () => {
  "use server";
  await requireAdmin();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [totalUsers, totalDivisi, todayHadir, todayTelat, pendingIzin] =
    await Promise.all([
      db.user.count({ where: { role: "USER", status: { not: "NONAKTIF" } } }),
      db.divisi.count(),
      db.absensi.count({ where: { date: today, status: { in: ["HADIR", "TELAT"] } } }),
      db.absensi.count({ where: { date: today, status: "TELAT" } }),
      db.izin.count({ where: { status: "PENDING" } }),
    ]);

  return { totalUsers, totalDivisi, todayHadir, todayTelat, pendingIzin };
}, "adminStats");

export const getTodayAttendanceStatus = query(async () => {
  "use server";
  await requireAdmin();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const totalInterns = await db.user.count({
    where: { role: "USER", status: { not: "NONAKTIF" } },
  });

  const attendanceToday = await db.absensi.groupBy({
    by: ["status"],
    where: { date: today },
    _count: { id: true },
  });

  const counts = { HADIR: 0, TELAT: 0, IZIN: 0, ALPHA: 0 };
  let totalCheckedIn = 0;
  for (const group of attendanceToday) {
    const status = group.status as keyof typeof counts;
    counts[status] = group._count.id;
    totalCheckedIn += group._count.id;
  }

  const belumAbsen = Math.max(0, totalInterns - totalCheckedIn);

  return {
    ...counts,
    belumAbsen,
    totalInterns,
  };
}, "todayAttendanceStatus");

export const getInternTrendData = query(async () => {
  "use server";
  await requireAdmin();

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const attendanceHistory = await db.absensi.findMany({
    where: { date: { gte: thirtyDaysAgo } },
    select: { date: true, status: true },
    orderBy: { date: "asc" },
  });

  const dailyData: Record<
    string,
    { hadir: number; telat: number; izin: number; total: number }
  > = {};
  for (const record of attendanceHistory) {
    const dateStr = record.date.toISOString().split("T")[0];
    if (!dailyData[dateStr]) {
      dailyData[dateStr] = { hadir: 0, telat: 0, izin: 0, total: 0 };
    }
    if (record.status === "HADIR") dailyData[dateStr].hadir++;
    else if (record.status === "TELAT") dailyData[dateStr].telat++;
    else if (record.status === "IZIN") dailyData[dateStr].izin++;
    dailyData[dateStr].total++;
  }

  const users = await db.user.findMany({
    where: { role: "USER" },
    select: { createdAt: true },
    orderBy: { createdAt: "asc" },
  });

  const registrationTrend: Record<string, number> = {};
  let runningCount = 0;
  for (const u of users) {
    const dateStr = u.createdAt.toISOString().split("T")[0];
    runningCount++;
    registrationTrend[dateStr] = runningCount;
  }

  return {
    dailyAttendanceTrend: Object.entries(dailyData).map(([date, stats]) => ({
      date,
      ...stats,
    })),
    registrationTrend: Object.entries(registrationTrend).map(
      ([date, count]) => ({ date, count }),
    ),
  };
}, "internTrendData");

// ========== ADMIN: USERS CRUD ==========

export const getAdminUsers = query(async () => {
  "use server";
  await requireAdmin();
  return db.user.findMany({
    include: { divisi: true },
    orderBy: { createdAt: "desc" },
  });
}, "adminUsers");

export const createUser = action(async (formData: FormData) => {
  "use server";
  await requireAdmin();
  const username = String(formData.get("username"));
  const password = String(formData.get("password"));
  const fullName = String(formData.get("fullName"));
  const email = String(formData.get("email"));
  const phone = String(formData.get("phone") || "");
  const role = String(formData.get("role")) as "ADMIN" | "USER";
  const divisiId = formData.get("divisiId")
    ? String(formData.get("divisiId"))
    : null;

  let error = validateUsername(username) || validatePassword(password);
  if (error) return new Error(error);

  const existing = await db.user.findUnique({ where: { username } });
  if (existing) return new Error("Username sudah terdaftar.");

  await db.user.create({
    data: {
      username,
      password: hashPassword(password),
      fullName,
      email,
      phone: phone || null,
      role,
      divisiId,
      status: "AKTIF",
    },
  });
  await logActivity("BUAT_PENGGUNA", `create user success (@${username})`);
  return redirect("/admin/users");
});

export const updateUser = action(async (formData: FormData) => {
  "use server";
  await requireAdmin();
  const id = String(formData.get("id"));
  const fullName = String(formData.get("fullName"));
  const email = String(formData.get("email"));
  const phone = String(formData.get("phone") || "");
  const role = String(formData.get("role")) as "ADMIN" | "USER";
  const divisiId = formData.get("divisiId")
    ? String(formData.get("divisiId"))
    : null;
  const status = String(formData.get("status") || "AKTIF");

  const updatedUser = await db.user.update({
    where: { id },
    data: { fullName, email, phone: phone || null, role, divisiId, status },
  });
  await logActivity(
    "UPDATE_PENGGUNA",
    `update user success (@${updatedUser.username})`,
  );
  return redirect("/admin/users");
});

export const deleteUser = action(async (formData: FormData) => {
  "use server";
  await requireAdmin();
  const id = String(formData.get("id"));
  const targetUser = await db.user.findUnique({ where: { id } });
  const targetUsername = targetUser ? `@${targetUser.username}` : "Pengguna";
  await db.user.delete({ where: { id } });
  await logActivity(
    "HAPUS_PENGGUNA",
    `delete user success (${targetUsername})`,
  );
  return redirect("/admin/users");
});

// ========== ADMIN: DIVISI CRUD ==========

export const getAdminDivisi = query(async () => {
  "use server";
  await requireAdmin();
  return db.divisi.findMany({
    include: { _count: { select: { users: true } } },
    orderBy: { createdAt: "desc" },
  });
}, "adminDivisi");

export const getAllDivisi = query(async () => {
  "use server";
  return db.divisi.findMany({ orderBy: { name: "asc" } });
}, "allDivisi");

export const createDivisi = action(async (formData: FormData) => {
  "use server";
  await requireAdmin();
  const name = String(formData.get("name"));
  const description = String(formData.get("description") || "");
  if (!name || name.length < 2)
    return new Error("Nama divisi minimal 2 karakter.");
  await db.divisi.create({ data: { name, description: description || null } });
  await logActivity("BUAT_DIVISI", `create division success (${name})`);
  return redirect("/admin/divisi");
});

export const updateDivisi = action(async (formData: FormData) => {
  "use server";
  await requireAdmin();
  const id = String(formData.get("id"));
  const name = String(formData.get("name"));
  const description = String(formData.get("description") || "");
  await db.divisi.update({
    where: { id },
    data: { name, description: description || null },
  });
  await logActivity("UPDATE_DIVISI", `update division success (${name})`);
  return redirect("/admin/divisi");
});

export const deleteDivisi = action(async (formData: FormData) => {
  "use server";
  await requireAdmin();
  const id = String(formData.get("id"));
  const targetDivisi = await db.divisi.findUnique({ where: { id } });
  const divisiName = targetDivisi ? targetDivisi.name : "Divisi";
  await db.divisi.delete({ where: { id } });
  await logActivity("HAPUS_DIVISI", `delete division success (${divisiName})`);
  return redirect("/admin/divisi");
});

// ========== ADMIN: ABSENSI ==========

export const getAdminAbsensi = query(async () => {
  "use server";
  await requireAdmin();
  return db.absensi.findMany({
    include: { user: { include: { divisi: true } } },
    orderBy: { date: "desc" },
    take: 100,
  });
}, "adminAbsensi");

// ========== ADMIN: IZIN ==========

export const getAdminIzin = query(async () => {
  "use server";
  await requireAdmin();
  return db.izin.findMany({
    include: { user: true },
    orderBy: { createdAt: "desc" },
  });
}, "adminIzin");

export const approveIzin = action(async (formData: FormData) => {
  "use server";
  const admin = await requireAdmin();
  const id = String(formData.get("id"));
  const statusAction = String(formData.get("status")) as
    | "APPROVED"
    | "REJECTED";

  const izin = await db.izin.findUnique({ where: { id } });
  if (!izin) return new Error("Pengajuan izin tidak ditemukan.");

  await db.izin.update({
    where: { id },
    data: {
      status: statusAction,
      approvedBy: admin.id,
      approvedAt: new Date(),
    },
  });

  // If approved, mark attendance records as IZIN for the date range
  if (statusAction === "APPROVED") {
    const start = new Date(izin.startDate);
    const end = new Date(izin.endDate);
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const dateOnly = new Date(d);
      dateOnly.setHours(0, 0, 0, 0);
      await db.absensi.upsert({
        where: { userId_date: { userId: izin.userId, date: dateOnly } },
        update: {
          status: "IZIN",
          notes: `Izin: ${izin.type} - ${izin.reason}`,
        },
        create: {
          userId: izin.userId,
          date: dateOnly,
          status: "IZIN",
          notes: `Izin: ${izin.type} - ${izin.reason}`,
        },
      });
    }
  }

  const targetUser = await db.user.findUnique({ where: { id: izin.userId } });
  const targetUsername = targetUser ? `@${targetUser.username}` : "Pengguna";
  const typeStr = izin.type;
  await logActivity(
    statusAction === "APPROVED" ? "SETUJUI_IZIN" : "TOLAK_IZIN",
    `${statusAction === "APPROVED" ? "approve" : "reject"} leave success (${typeStr.toLowerCase()} - ${targetUsername})`,
  );

  return redirect("/admin/izin");
});

// ========== ADMIN: LAPORAN ==========

export const getLaporan = query(
  async (startDate?: string, endDate?: string) => {
    "use server";
    await requireAdmin();
    const where: any = {};
    if (startDate) where.date = { gte: new Date(startDate) };
    if (endDate) where.date = { ...where.date, lte: new Date(endDate) };

    return db.absensi.findMany({
      where,
      include: { user: { include: { divisi: true } } },
      orderBy: { date: "desc" },
    });
  },
  "laporan",
);

// ========== ADMIN: EXPORT CSV ==========

export const exportCSV = query(async () => {
  "use server";
  await requireAdmin();
  const records = await db.absensi.findMany({
    include: { user: { include: { divisi: true } } },
    orderBy: { date: "desc" },
  });

  const header =
    "Nama,Username,Divisi,Tanggal,Check-In,Check-Out,Status,Catatan\n";
  const rows = records
    .map((r) => {
      const date = new Date(r.date).toLocaleDateString("id-ID");
      const ci = r.checkIn
        ? new Date(r.checkIn).toLocaleTimeString("id-ID")
        : "-";
      const co = r.checkOut
        ? new Date(r.checkOut).toLocaleTimeString("id-ID")
        : "-";
      return `"${r.user.fullName}","${r.user.username}","${r.user.divisi?.name ?? "-"}","${date}","${ci}","${co}","${r.status}","${r.notes ?? ""}"`;
    })
    .join("\n");

  return header + rows;
}, "exportCSV");

// ========== ADMIN: AUDIT LOGS ==========

export const getAdminAuditLogs = query(async () => {
  "use server";
  await requireAdmin();
  return (db as any).auditLog.findMany({
    include: { user: { select: { fullName: true, username: true } } },
    orderBy: { createdAt: "desc" },
  });
}, "adminAuditLogs");

export async function logPageAccess(pathname: string) {
  "use server";
  try {
    const session = await getSession();
    const userId = session.data.userId;
    if (!userId) return;
    const titleMap: Record<string, string> = {
      "/dashboard": "dashboard",
      "/riwayat": "riwayat",
      "/izin": "izin",
      "/profil": "profil",
      "/admin/dashboard": "admin.dashboard",
      "/admin/users": "admin.users",
      "/admin/divisi": "admin.divisi",
      "/admin/absensi": "admin.absensi",
      "/admin/izin": "admin.izin",
      "/admin/laporan": "admin.laporan",
      "/admin/settings": "admin.settings",
      "/admin/audit-log": "admin.audit-log",
    };
    const pageTitle =
      titleMap[pathname] || pathname.replace(/^\//, "").replace(/\//g, ".");
    await logActivity("AKSES_HALAMAN", pageTitle, userId);
  } catch (e) {
    // Ignore
  }
}
