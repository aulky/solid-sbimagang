import { action, query, redirect } from "@solidjs/router";
import { db } from "./db";
import {
  getSession,
  login,
  logout as logoutSession,
  register,
  validatePassword,
  validateUsername,
  requireUser,
  requireAdmin,
  hashPassword
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
      include: { divisi: true }
    });
    if (!user || !user.isActive) throw new Error("User invalid");
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
      isActive: user.isActive
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
    await session.update(d => {
      d.userId = user.id;
    });
  } catch (err) {
    return err as Error;
  }
  return redirect("/dashboard");
});

export const logout = action(async () => {
  "use server";
  await logoutSession();
  return redirect("/login");
});

// ========== ABSENSI (ATTENDANCE) ==========

export const getTodayAttendance = query(async () => {
  "use server";
  const user = await requireUser();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const record = await db.absensi.findUnique({
    where: { userId_date: { userId: user.id, date: today } }
  });
  return record;
}, "todayAttendance");

export const checkIn = action(async () => {
  "use server";
  const user = await requireUser();
  const now = new Date();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const existing = await db.absensi.findUnique({
    where: { userId_date: { userId: user.id, date: today } }
  });
  if (existing?.checkIn) {
    return new Error("Anda sudah Check-In hari ini.");
  }

  // Jam kerja: 08:00. Check-in > 08:00 = TELAT
  const status = now.getHours() >= 8 && now.getMinutes() > 0 ? "TELAT" : "HADIR";

  await db.absensi.upsert({
    where: { userId_date: { userId: user.id, date: today } },
    update: { checkIn: now, status },
    create: {
      userId: user.id,
      date: today,
      checkIn: now,
      status,
      location: "Kantor PT. SBI Cilacap"
    }
  });
  return redirect("/dashboard");
});

export const checkOut = action(async () => {
  "use server";
  const user = await requireUser();
  const now = new Date();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const existing = await db.absensi.findUnique({
    where: { userId_date: { userId: user.id, date: today } }
  });
  if (!existing?.checkIn) {
    return new Error("Anda belum Check-In hari ini.");
  }
  if (existing.checkOut) {
    return new Error("Anda sudah Check-Out hari ini.");
  }

  await db.absensi.update({
    where: { id: existing.id },
    data: { checkOut: now }
  });
  return redirect("/dashboard");
});

export const getAttendanceHistory = query(async () => {
  "use server";
  const user = await requireUser();
  return db.absensi.findMany({
    where: { userId: user.id },
    orderBy: { date: "desc" },
    take: 30
  });
}, "attendanceHistory");

// ========== IZIN (LEAVE REQUEST) ==========

export const submitIzin = action(async (formData: FormData) => {
  "use server";
  const user = await requireUser();
  const startDate = new Date(String(formData.get("startDate")));
  const endDate = new Date(String(formData.get("endDate")));
  const type = String(formData.get("type")) as "SAKIT" | "IZIN" | "CUTI";
  const reason = String(formData.get("reason"));

  if (!reason || reason.length < 5) return new Error("Alasan minimal 5 karakter.");
  if (startDate > endDate) return new Error("Tanggal mulai tidak boleh setelah tanggal selesai.");

  await db.izin.create({
    data: {
      userId: user.id,
      startDate,
      endDate,
      type,
      reason,
      status: "PENDING"
    }
  });
  return redirect("/izin");
});

export const getUserIzinList = query(async () => {
  "use server";
  const user = await requireUser();
  return db.izin.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 20
  });
}, "userIzinList");

// ========== PROFIL ==========

export const updateProfile = action(async (formData: FormData) => {
  "use server";
  const user = await requireUser();
  const fullName = String(formData.get("fullName"));
  const email = String(formData.get("email"));
  const phone = String(formData.get("phone") || "");

  if (!fullName || fullName.length < 2) return new Error("Nama lengkap minimal 2 karakter.");
  if (!email || !email.includes("@")) return new Error("Email tidak valid.");

  await db.user.update({
    where: { id: user.id },
    data: { fullName, email, phone: phone || null }
  });
  return redirect("/profil");
});

// ========== ADMIN: DASHBOARD ==========

export const getAdminStats = query(async () => {
  "use server";
  await requireAdmin();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [totalUsers, totalDivisi, todayHadir, todayTelat, pendingIzin] = await Promise.all([
    db.user.count({ where: { role: "USER", isActive: true } }),
    db.divisi.count(),
    db.absensi.count({ where: { date: today, status: "HADIR" } }),
    db.absensi.count({ where: { date: today, status: "TELAT" } }),
    db.izin.count({ where: { status: "PENDING" } }),
  ]);

  return { totalUsers, totalDivisi, todayHadir, todayTelat, pendingIzin };
}, "adminStats");

// ========== ADMIN: USERS CRUD ==========

export const getAdminUsers = query(async () => {
  "use server";
  await requireAdmin();
  return db.user.findMany({
    include: { divisi: true },
    orderBy: { createdAt: "desc" }
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
  const divisiId = formData.get("divisiId") ? String(formData.get("divisiId")) : null;

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
      isActive: true
    }
  });
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
  const divisiId = formData.get("divisiId") ? String(formData.get("divisiId")) : null;
  const isActive = formData.get("isActive") === "true";

  await db.user.update({
    where: { id },
    data: { fullName, email, phone: phone || null, role, divisiId, isActive }
  });
  return redirect("/admin/users");
});

export const deleteUser = action(async (formData: FormData) => {
  "use server";
  await requireAdmin();
  const id = String(formData.get("id"));
  await db.user.delete({ where: { id } });
  return redirect("/admin/users");
});

// ========== ADMIN: DIVISI CRUD ==========

export const getAdminDivisi = query(async () => {
  "use server";
  await requireAdmin();
  return db.divisi.findMany({
    include: { _count: { select: { users: true } } },
    orderBy: { createdAt: "desc" }
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
  if (!name || name.length < 2) return new Error("Nama divisi minimal 2 karakter.");
  await db.divisi.create({ data: { name, description: description || null } });
  return redirect("/admin/divisi");
});

export const updateDivisi = action(async (formData: FormData) => {
  "use server";
  await requireAdmin();
  const id = String(formData.get("id"));
  const name = String(formData.get("name"));
  const description = String(formData.get("description") || "");
  await db.divisi.update({ where: { id }, data: { name, description: description || null } });
  return redirect("/admin/divisi");
});

export const deleteDivisi = action(async (formData: FormData) => {
  "use server";
  await requireAdmin();
  const id = String(formData.get("id"));
  await db.divisi.delete({ where: { id } });
  return redirect("/admin/divisi");
});

// ========== ADMIN: ABSENSI ==========

export const getAdminAbsensi = query(async () => {
  "use server";
  await requireAdmin();
  return db.absensi.findMany({
    include: { user: { include: { divisi: true } } },
    orderBy: { date: "desc" },
    take: 100
  });
}, "adminAbsensi");

// ========== ADMIN: IZIN ==========

export const getAdminIzin = query(async () => {
  "use server";
  await requireAdmin();
  return db.izin.findMany({
    include: { user: true },
    orderBy: { createdAt: "desc" }
  });
}, "adminIzin");

export const approveIzin = action(async (formData: FormData) => {
  "use server";
  const admin = await requireAdmin();
  const id = String(formData.get("id"));
  const statusAction = String(formData.get("status")) as "APPROVED" | "REJECTED";

  const izin = await db.izin.findUnique({ where: { id } });
  if (!izin) return new Error("Pengajuan izin tidak ditemukan.");

  await db.izin.update({
    where: { id },
    data: { status: statusAction, approvedBy: admin.id, approvedAt: new Date() }
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
        update: { status: "IZIN", notes: `Izin: ${izin.type} - ${izin.reason}` },
        create: {
          userId: izin.userId,
          date: dateOnly,
          status: "IZIN",
          notes: `Izin: ${izin.type} - ${izin.reason}`
        }
      });
    }
  }

  return redirect("/admin/izin");
});

// ========== ADMIN: LAPORAN ==========

export const getLaporan = query(async (startDate?: string, endDate?: string) => {
  "use server";
  await requireAdmin();
  const where: any = {};
  if (startDate) where.date = { gte: new Date(startDate) };
  if (endDate) where.date = { ...where.date, lte: new Date(endDate) };

  return db.absensi.findMany({
    where,
    include: { user: { include: { divisi: true } } },
    orderBy: { date: "desc" }
  });
}, "laporan");

// ========== ADMIN: EXPORT CSV ==========

export const exportCSV = query(async () => {
  "use server";
  await requireAdmin();
  const records = await db.absensi.findMany({
    include: { user: { include: { divisi: true } } },
    orderBy: { date: "desc" }
  });

  const header = "Nama,Username,Divisi,Tanggal,Check-In,Check-Out,Status,Catatan\n";
  const rows = records.map(r => {
    const date = new Date(r.date).toLocaleDateString("id-ID");
    const ci = r.checkIn ? new Date(r.checkIn).toLocaleTimeString("id-ID") : "-";
    const co = r.checkOut ? new Date(r.checkOut).toLocaleTimeString("id-ID") : "-";
    return `"${r.user.fullName}","${r.user.username}","${r.user.divisi?.name ?? '-'}","${date}","${ci}","${co}","${r.status}","${r.notes ?? ''}"`;
  }).join("\n");

  return header + rows;
}, "exportCSV");
