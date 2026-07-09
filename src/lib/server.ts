import { useSession } from "@solidjs/start/http";
import crypto from "crypto";
import { db } from "./db";

export function validateUsername(username: unknown) {
  if (typeof username !== "string" || username.length < 3) {
    return `Username harus minimal 3 karakter`;
  }
}

export function validatePassword(password: unknown) {
  if (typeof password !== "string" || password.length < 6) {
    return `Password harus minimal 6 karakter`;
  }
}

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto
    .pbkdf2Sync(password, salt, 1000, 64, "sha512")
    .toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const verifyHash = crypto
    .pbkdf2Sync(password, salt, 1000, 64, "sha512")
    .toString("hex");
  return hash === verifyHash;
}

export async function login(username: string, password: string) {
  const user = await db.user.findUnique({ where: { username } });
  if (!user || !verifyPassword(password, user.password)) {
    throw new Error("Username atau password salah");
  }
  if (!user.isActive) {
    throw new Error("Akun Anda dinonaktifkan. Silakan hubungi admin.");
  }
  return user;
}

export async function logout() {
  const session = await getSession();
  await session.update((d) => {
    d.userId = undefined;
  });
}

export async function register(username: string, password: string) {
  const existingUser = await db.user.findUnique({ where: { username } });
  if (existingUser) throw new Error("Username sudah terdaftar");

  const hashedPassword = hashPassword(password);
  return db.user.create({
    data: {
      username: username,
      password: hashedPassword,
      fullName: username,
      email: `${username}@magang.sbi.co.id`,
      role: "USER",
      isActive: true,
    },
  });
}

export function getSession() {
  return useSession({
    name: "sbi_session",
    password:
      process.env.SESSION_SECRET ??
      "areallylongsecretthatyoushouldreplace_solusibangunindonesia_cilacap_2026",
    cookie: {
      secure: process.env.COOKIE_SECURE === "true",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 1 minggu
    },
  });
}

export async function requireUser() {
  const session = await getSession();
  const userId = session.data.userId;
  if (!userId) {
    throw new Error("Unauthorized");
  }
  const user = await db.user.findUnique({
    where: { id: userId },
    include: { divisi: true },
  });
  if (!user || !user.isActive) {
    await logout();
    throw new Error("Unauthorized");
  }
  return user;
}

export async function requireAdmin() {
  const user = await requireUser();
  if (user.role !== "ADMIN") {
    throw new Error("Forbidden");
  }
  return user;
}
