import { action, query, redirect } from "@solidjs/router";
import { promises as fs } from "fs";
import path from "path";
import crypto from "crypto";
import * as XLSX from "xlsx";
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

//  AUTH 

export const getUser = query(async () => {
  "use server";
  try {
    const session = await getSession();
    const userId = session.data.userId;
    if (userId === undefined) throw new Error("No user id");
    const user = await db.user.findUnique({
      where: { id: userId },
      include: { divisi: true, batch: true },
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
      batch: user.batch
        ? { name: user.batch.name, startDate: user.batch.startDate, endDate: user.batch.endDate }
        : null,
      batchId: user.batchId,
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
    if (loginType === "login") {
      await logActivity("LOGIN_GAGAL", `login failed: @${username}`);
    }
    return err as Error;
  }
});

export const logout = action(async () => {
  "use server";
  await logActivity("LOGOUT", "logout success");
  await logoutSession();
  return redirect("/login");
});

//  ABSENSI (ATTENDANCE) 

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
      jamMulaiCheckout: "16:00",
    };
  }
};

export const getSystemSettings = query(async () => {
  "use server";
  await requireAdmin();
  return getSettings();
}, "systemSettings");

export const getPublicSettings = query(async () => {
  "use server";
  await requireUser();
  return getSettings();
}, "publicSettings");

export const updateSystemSettings = action(async (formData: FormData) => {
  "use server";
  await requireAdmin();
  const jamMasuk = String(formData.get("jamMasuk") || "08:00");
  const toleransiMenit = Number(formData.get("toleransiMenit") || 0);
  const lokasiKantor = String(
    formData.get("lokasiKantor") || "Kantor PT. SBI Cilacap",
  );
  const jamMulaiCheckout = String(formData.get("jamMulaiCheckout") || "16:00");

  const settings = { jamMasuk, toleransiMenit, lokasiKantor, jamMulaiCheckout };
  const filePath = path.join(process.cwd(), "settings.json");
  await fs.writeFile(filePath, JSON.stringify(settings, null, 2), "utf-8");
  await logActivity("UPDATE_PENGATURAN", "update settings success");
  return redirect("/admin/dashboard");
});

export const checkIn = action(async () => {
  "use server";
  const user = await requireUser();
  if ((user as any).status === "ALUMNI") {
    return new Error(
      "Akun Anda sudah menjadi Alumni. Anda tidak dapat melakukan absensi.",
    );
  }
  const now = new Date();
  const today = getLocalDateAsUTC();

  const existing = await db.absensi.findUnique({
    where: { userId_date: { userId: user.id, date: today } },
  });
  if (existing?.status === "IZIN") {
    return new Error("Anda tidak perlu melakukan absensi karena sedang izin hari ini.");
  }
  if (existing?.checkIn) {
    return new Error("Anda sudah Check-In hari ini.");
  }

  const settings = await getSettings();
  const [tHour, tMin] = settings.jamMasuk.split(":").map(Number);
  const startCheckInMinutes = tHour * 60 + tMin;
  const nowMinutes = now.getHours() * 60 + now.getMinutes();

  if (nowMinutes < startCheckInMinutes) {
    return new Error(`Check-In baru bisa dilakukan mulai jam ${settings.jamMasuk}.`);
  }

  const limitMinutes = startCheckInMinutes + Number(settings.toleransiMenit || 0);
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
  if ((user as any).status === "ALUMNI") {
    return new Error(
      "Akun Anda sudah menjadi Alumni. Anda tidak dapat melakukan absensi.",
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
  if (existing.status === "IZIN") {
    return new Error("Anda tidak perlu melakukan absensi karena sedang izin hari ini.");
  }
  if (existing.checkOut) {
    return new Error("Anda sudah Check-Out hari ini.");
  }

  // ponytail: checkout time gate — enforce checkout window from settings (1 hour early until 23:59)
  const settings = await getSettings();
  const jamMulaiCheckout = settings.jamMulaiCheckout || "16:00";
  const [coHour, coMin] = jamMulaiCheckout.split(":").map(Number);
  const targetMinutes = coHour * 60 + coMin;
  const earliestCheckout = targetMinutes - 60;
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  if (nowMinutes < earliestCheckout) {
    const ah = Math.floor(earliestCheckout / 60);
    const am = earliestCheckout % 60;
    const allowedTimeStr = `${String(ah).padStart(2, "0")}:${String(am).padStart(2, "0")}`;
    return new Error(`Check-Out hanya bisa dilakukan antara jam ${allowedTimeStr} - 23:59.`);
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

//  IZIN (LEAVE REQUEST) 

const parseLocalDateAsUTC = (dateStr: string) => {
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day));
};

export const submitIzin = action(async (formData: FormData) => {
  "use server";
  const user = await requireUser();
  if ((user as any).status === "ALUMNI") {
    return new Error(
      "Akun Anda sudah menjadi Alumni. Anda tidak dapat mengajukan izin.",
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
    const uploadsDir = path.join(process.cwd(), "uploads");

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

//  PROFIL 

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

//  ADMIN: DASHBOARD 

export const getAdminStats = query(async () => {
  "use server";
  await requireAdmin();
  const today = getLocalDateAsUTC();

  const [totalUsers, totalDivisi, todayHadir, todayTelat, pendingIzin, batchAktif, batchSelesai, batchMendatang] =
    await Promise.all([
      db.user.count({ where: { role: "USER", status: "AKTIF" } }),
      db.divisi.count(),
      db.absensi.count({ where: { date: today, status: { in: ["HADIR", "TELAT"] } } }),
      db.absensi.count({ where: { date: today, status: "TELAT" } }),
      db.izin.count({ where: { status: "PENDING" } }),
      db.batchMagang.count({ where: { startDate: { lte: today }, endDate: { gte: today } } }),
      db.batchMagang.count({ where: { endDate: { lt: today } } }),
      db.batchMagang.count({ where: { startDate: { gt: today } } }),
    ]);

  return { totalUsers, totalDivisi, todayHadir, todayTelat, pendingIzin, batchAktif, batchSelesai, batchMendatang };
}, "adminStats");

export const getTodayAttendanceStatus = query(async () => {
  "use server";
  await requireAdmin();
  const today = getLocalDateAsUTC();

  const totalInterns = await db.user.count({
    where: { role: "USER", status: "AKTIF" },
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

  const MONTHS_ID = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];

  const getMonthLabel = (d: Date) => `${MONTHS_ID[d.getMonth()]} ${d.getFullYear()}`;
  const getWeekLabel = (d: Date) => {
    const t = new Date(d.getTime());
    const day = t.getDay();
    t.setDate(t.getDate() - day + (day === 0 ? -6 : 1));
    return `${t.getDate()} ${MONTHS_ID[t.getMonth()]} ${t.getFullYear()}`;
  };
  const getYearLabel = (d: Date) => `${d.getFullYear()}`;

  const users = await db.user.findMany({
    where: { role: "USER" },
    select: { createdAt: true },
    orderBy: { createdAt: "asc" },
  });

  const now = new Date();
  const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 6, 1);
  const startDate = users.length > 0 ? new Date(Math.min(users[0].createdAt.getTime(), sixMonthsAgo.getTime())) : sixMonthsAgo;

  // Build cumulative counts per period label
  const monthlyCounts: Record<string, number> = {};
  const weeklyCounts: Record<string, number> = {};
  const yearlyCounts: Record<string, number> = {};
  let running = 0;
  for (const u of users) {
    running++;
    monthlyCounts[getMonthLabel(u.createdAt)] = running;
    weeklyCounts[getWeekLabel(u.createdAt)] = running;
    yearlyCounts[getYearLabel(u.createdAt)] = running;
  }

  // Generate continuous label sequences and fill gaps
  const fillSeries = (labels: string[], counts: Record<string, number>) => {
    let last = 0;
    return labels.map((label) => {
      if (counts[label] !== undefined) last = counts[label];
      return { label, count: last };
    });
  };

  // Monthly: from startDate to now
  const monthLabels: string[] = [];
  const mc = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
  while (mc <= now) { monthLabels.push(getMonthLabel(mc)); mc.setMonth(mc.getMonth() + 1); }

  // Weekly: from startDate to now (last 12 weeks max for readability)
  const weekLabels: string[] = [];
  const wc = new Date(startDate.getTime());
  const wDay = wc.getDay();
  wc.setDate(wc.getDate() - wDay + (wDay === 0 ? -6 : 1));
  wc.setHours(0, 0, 0, 0);
  while (wc <= now) { weekLabels.push(getWeekLabel(wc)); wc.setDate(wc.getDate() + 7); }
  const recentWeeks = weekLabels.slice(-12);

  // Yearly: from startDate to now
  const yearLabels: string[] = [];
  for (let y = startDate.getFullYear(); y <= now.getFullYear(); y++) yearLabels.push(`${y}`);

  return {
    weekly: fillSeries(recentWeeks, weeklyCounts),
    monthly: fillSeries(monthLabels, monthlyCounts),
    yearly: fillSeries(yearLabels, yearlyCounts),
  };
}, "internTrendData");

//  ADMIN: USERS CRUD 

export const getAdminUsers = query(async (options?: {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  status?: string;
  divisiId?: string;
}) => {
  "use server";
  await requireAdmin();

  const page = options?.page ?? 1;
  const limit = options?.limit ?? 10;
  const search = options?.search?.trim() ?? "";
  const role = options?.role ?? "";
  const status = options?.status ?? "";
  const divisiId = options?.divisiId ?? "";

  const skip = (page - 1) * limit;

  const where: any = {};
  if (role) where.role = role;
  if (status) where.status = status;
  if (divisiId) where.divisiId = divisiId;

  if (search) {
    where.OR = [
      { fullName: { contains: search } },
      { username: { contains: search } },
    ];
  }

  const [items, total] = await Promise.all([
    db.user.findMany({
      where,
      include: { divisi: true, batch: true },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    db.user.count({ where }),
  ]);

  return { items, total };
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
  const batchId = formData.get("batchId")
    ? String(formData.get("batchId"))
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
      batchId,
      status: "AKTIF",
    },
  });
  await logActivity("BUAT_PENGGUNA", `create user success (@${username})`);
  return redirect("/admin/users");
});

export const bulkCreateUsers = action(async (formData: FormData) => {
  "use server";
  await requireAdmin();

  const file = formData.get("file") as File | null;
  if (!file || file.size === 0)
    return { total: 0, successCount: 0, errors: [{ row: 0, username: "-", error: "File tidak valid atau kosong." }] };
  if (file.size > 2 * 1024 * 1024)
    return { total: 0, successCount: 0, errors: [{ row: 0, username: "-", error: "Ukuran file maksimal 2MB." }] };

  const bytes = await file.arrayBuffer();
  const wb = XLSX.read(Buffer.from(bytes), { type: "buffer" });
  const rows = XLSX.utils.sheet_to_json<Record<string, any>>(wb.Sheets[wb.SheetNames[0]]);

  if (rows.length === 0)
    return { total: 0, successCount: 0, errors: [{ row: 0, username: "-", error: "Template kosong, tidak ada data." }] };

  const [divisiList, batchList, existingUsers] = await Promise.all([
    db.divisi.findMany(),
    db.batchMagang.findMany(),
    db.user.findMany({ select: { username: true, email: true } }),
  ]);
  const divisiMap = new Map(divisiList.map((d) => [d.name.toLowerCase().trim(), d.id]));
  const batchMap = new Map(batchList.map((b) => [b.name.toLowerCase().trim(), b.id]));
  const usedUsernames = new Set(existingUsers.map((u) => u.username.toLowerCase()));
  const usedEmails = new Set(existingUsers.map((u) => u.email.toLowerCase()));

  const errors: Array<{ row: number; username: string; error: string }> = [];
  let successCount = 0;
  const batchUsernames = new Set<string>();
  const batchEmails = new Set<string>();

  for (let i = 0; i < rows.length; i++) {
    const r = rows[i];
    const rowNum = i + 2;
    const username = String(r.username || "").trim();
    const password = String(r.password || "").trim();
    const fullName = String(r.fullName || "").trim();
    const email = String(r.email || "").trim();
    const phone = String(r.phone || "").trim();
    const role = String(r.role || "USER").trim().toUpperCase();
    const divisiName = String(r.divisi || "").trim();
    const batchName = String(r.batch || "").trim();

    if (!username || !password || !fullName || !email) {
      errors.push({ row: rowNum, username: username || "(kosong)", error: "username, password, fullName, dan email wajib diisi." });
      continue;
    }
    const ue = validateUsername(username);
    if (ue) { errors.push({ row: rowNum, username, error: ue }); continue; }
    const pe = validatePassword(password);
    if (pe) { errors.push({ row: rowNum, username, error: pe }); continue; }
    if (!["USER", "ADMIN"].includes(role)) {
      errors.push({ row: rowNum, username, error: `Role "${r.role}" tidak valid. Gunakan USER atau ADMIN.` });
      continue;
    }

    const uLower = username.toLowerCase();
    const eLower = email.toLowerCase();
    if (usedUsernames.has(uLower) || batchUsernames.has(uLower)) {
      errors.push({ row: rowNum, username, error: "Username sudah terdaftar." }); continue;
    }
    if (usedEmails.has(eLower) || batchEmails.has(eLower)) {
      errors.push({ row: rowNum, username, error: "Email sudah terdaftar." }); continue;
    }

    let divisiId: string | null = null;
    if (divisiName) {
      divisiId = divisiMap.get(divisiName.toLowerCase()) ?? null;
      if (!divisiId) { errors.push({ row: rowNum, username, error: `Divisi "${divisiName}" tidak ditemukan.` }); continue; }
    }
    let batchId: string | null = null;
    if (batchName) {
      batchId = batchMap.get(batchName.toLowerCase()) ?? null;
      if (!batchId) { errors.push({ row: rowNum, username, error: `Batch "${batchName}" tidak ditemukan.` }); continue; }
    }

    try {
      await db.user.create({
        data: {
          username, password: hashPassword(password), fullName, email,
          phone: phone || null, role: role as "USER" | "ADMIN",
          divisiId, batchId, status: "AKTIF",
        },
      });
      batchUsernames.add(uLower);
      batchEmails.add(eLower);
      successCount++;
    } catch (e: any) {
      errors.push({ row: rowNum, username, error: e.message || "Gagal menyimpan." });
    }
  }

  if (successCount > 0) {
    await logActivity("BUAT_PENGGUNA", `bulk create ${successCount}/${rows.length} users`);
  }
  return { total: rows.length, successCount, errors };
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
  const batchId = formData.get("batchId")
    ? String(formData.get("batchId"))
    : null;
  const status = String(formData.get("status") || "AKTIF");

  const updatedUser = await db.user.update({
    where: { id },
    data: { fullName, email, phone: phone || null, role, divisiId, batchId, status },
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

//  ADMIN: DIVISI CRUD 

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

//  ADMIN: ABSENSI 

export const getAdminAbsensi = query(async (options?: {
  page?: number;
  limit?: number;
  search?: string;
  date?: string;
  status?: string;
  divisiId?: string;
}) => {
  "use server";
  await requireAdmin();

  const page = options?.page ?? 1;
  const limit = options?.limit ?? 10;
  const search = options?.search?.trim() ?? "";
  const dateStr = options?.date ?? "";
  const status = options?.status ?? "";
  const divisiId = options?.divisiId ?? "";

  const skip = (page - 1) * limit;

  const where: any = {};
  if (status) where.status = status;

  if (dateStr) {
    const [year, month, day] = dateStr.split("-").map(Number);
    const filterUtc = new Date(Date.UTC(year, month - 1, day));
    where.date = filterUtc;
  }

  if (divisiId) {
    where.user = { divisiId };
  }

  if (search) {
    const searchCond = {
      OR: [
        { fullName: { contains: search } },
        { username: { contains: search } },
      ],
    };
    if (where.user) {
      where.user = { ...where.user, ...searchCond };
    } else {
      where.user = searchCond;
    }
  }

  const [items, total] = await Promise.all([
    db.absensi.findMany({
      where,
      include: { user: { include: { divisi: true } } },
      orderBy: { date: "desc" },
      skip,
      take: limit,
    }),
    db.absensi.count({ where }),
  ]);

  return { items, total };
}, "adminAbsensi");

//  ADMIN: IZIN 

export const getAdminIzin = query(async (options?: {
  page?: number;
  limit?: number;
  search?: string;
  type?: string;
  status?: string;
}) => {
  "use server";
  await requireAdmin();

  const page = options?.page ?? 1;
  const limit = options?.limit ?? 10;
  const search = options?.search?.trim() ?? "";
  const type = options?.type ?? "";
  const status = options?.status ?? "";

  const skip = (page - 1) * limit;

  const where: any = {};
  if (type) where.type = type;
  if (status) where.status = status;

  if (search) {
    where.user = {
      OR: [
        { fullName: { contains: search } },
        { username: { contains: search } },
      ],
    };
  }

  const [items, total] = await Promise.all([
    db.izin.findMany({
      where,
      include: { user: true },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    db.izin.count({ where }),
  ]);

  return { items, total };
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

//  ADMIN: LAPORAN 

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

//  ADMIN: EXPORT CSV 

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

//  ADMIN: AUDIT LOGS 

export const getAdminAuditLogs = query(async (options?: {
  page?: number;
  limit?: number;
  search?: string;
  action?: string;
}) => {
  "use server";
  await requireAdmin();

  const page = options?.page ?? 1;
  const limit = options?.limit ?? 15;
  const search = options?.search?.trim() ?? "";
  const actionFilter = options?.action ?? "";

  const skip = (page - 1) * limit;

  const where: any = {};
  if (actionFilter) {
    where.action = actionFilter;
  }

  if (search) {
    where.OR = [
      { username: { contains: search } },
      { details: { contains: search } },
      { ip: { contains: search } },
      { location: { contains: search } },
      {
        user: {
          fullName: { contains: search },
        },
      },
    ];
  }

  const [items, total] = await Promise.all([
    (db as any).auditLog.findMany({
      where,
      include: { user: { select: { fullName: true, username: true } } },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    (db as any).auditLog.count({ where }),
  ]);

  return { items, total };
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
      "/admin/batch": "admin.batch",
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

//  ADMIN: BATCH MAGANG CRUD 

export const getAdminBatches = query(async () => {
  "use server";
  await requireAdmin();
  return db.batchMagang.findMany({
    include: { _count: { select: { users: true } } },
    orderBy: { startDate: "desc" },
  });
}, "adminBatches");

export const getAllBatches = query(async () => {
  "use server";
  return db.batchMagang.findMany({ orderBy: { name: "asc" } });
}, "allBatches");

export const createBatch = action(async (formData: FormData) => {
  "use server";
  await requireAdmin();
  const name = String(formData.get("name"));
  const startDateStr = String(formData.get("startDate"));
  const endDateStr = String(formData.get("endDate"));
  const description = String(formData.get("description") || "");

  if (!name || name.length < 2) return new Error("Nama batch minimal 2 karakter.");
  if (!startDateStr || !endDateStr) return new Error("Tanggal mulai dan selesai harus diisi.");

  const startDate = new Date(startDateStr);
  const endDate = new Date(endDateStr);
  if (startDate > endDate) return new Error("Tanggal mulai tidak boleh melebihi tanggal selesai.");

  await db.batchMagang.create({
    data: { name, startDate, endDate, description: description || null },
  });
  await logActivity("BUAT_BATCH", `create batch success (${name})`);
  return redirect("/admin/batch");
});

export const updateBatch = action(async (formData: FormData) => {
  "use server";
  await requireAdmin();
  const id = String(formData.get("id"));
  const name = String(formData.get("name"));
  const startDateStr = String(formData.get("startDate"));
  const endDateStr = String(formData.get("endDate"));
  const description = String(formData.get("description") || "");

  if (!name || name.length < 2) return new Error("Nama batch minimal 2 karakter.");
  const startDate = new Date(startDateStr);
  const endDate = new Date(endDateStr);
  if (startDate > endDate) return new Error("Tanggal mulai tidak boleh melebihi tanggal selesai.");

  await db.batchMagang.update({
    where: { id },
    data: { name, startDate, endDate, description: description || null },
  });
  await logActivity("UPDATE_BATCH", `update batch success (${name})`);
  return redirect("/admin/batch");
});

export const deleteBatch = action(async (formData: FormData) => {
  "use server";
  await requireAdmin();
  const id = String(formData.get("id"));
  const target = await db.batchMagang.findUnique({ where: { id } });
  await db.batchMagang.delete({ where: { id } });
  await logActivity("HAPUS_BATCH", `delete batch success (${target?.name ?? "Batch"})`);
  return redirect("/admin/batch");
});
