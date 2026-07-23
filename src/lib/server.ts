import { useSession } from "@solidjs/start/http";
import { redirect } from "@solidjs/router";
import { getRequestEvent } from "solid-js/web";
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
  if ((user as any).status === "NONAKTIF") {
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
    throw redirect("/login");
  }
  const user = await db.user.findUnique({
    where: { id: userId },
    include: { divisi: true, batch: true },
  });
  if (!user || (user as any).status === "NONAKTIF") {
    await logout();
    throw redirect("/login");
  }

  // Auto-alumni: jika batch sudah berakhir, update status ke ALUMNI
  if ((user as any).status === "AKTIF" && user.batch) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const endDate = new Date(user.batch.endDate);
    endDate.setHours(0, 0, 0, 0);
    if (today > endDate) {
      await db.user.update({
        where: { id: user.id },
        data: { status: "ALUMNI" },
      });
      (user as any).status = "ALUMNI";
    }
  }

  return user;
}

export async function requireAdmin() {
  const user = await requireUser();
  if (user.role !== "ADMIN") {
    throw redirect("/unauthorized");
  }
  return user;
}

function parseUserAgent(ua: string): string {
  if (!ua || ua === "Unknown") return "Tidak diketahui";

  let os = "OS Tidak Diketahui";
  if (ua.includes("Windows")) os = "Windows";
  else if (ua.includes("Macintosh") || ua.includes("Mac OS X")) os = "macOS";
  else if (ua.includes("Linux") && !ua.includes("Android")) os = "Linux";
  else if (ua.includes("Android")) os = "Android";
  else if (ua.includes("iPhone") || ua.includes("iPad") || ua.includes("iPod")) os = "iOS";

  let browser = "Browser Tidak Diketahui";
  if (ua.includes("Firefox/")) {
    const match = ua.match(/Firefox\/(\d+)/);
    browser = `Firefox ${match ? match[1] : ""}`;
  } else if (ua.includes("Chrome/") && !ua.includes("Edg/")) {
    const match = ua.match(/Chrome\/(\d+)/);
    browser = `Chrome ${match ? match[1] : ""}`;
  } else if (ua.includes("Safari/") && !ua.includes("Chrome/")) {
    const match = ua.match(/Version\/(\d+)/);
    browser = `Safari ${match ? match[1] : ""}`;
  } else if (ua.includes("Edg/")) {
    const match = ua.match(/Edg\/(\d+)/);
    browser = `Edge ${match ? match[1] : ""}`;
  } else if (ua.includes("PostmanRuntime/")) {
    browser = "Postman";
  }

  return `${browser} (${os})`;
}

function isPrivateIp(ip: string): boolean {
  if (!ip) return true;
  return (
    ip === "127.0.0.1" ||
    ip === "::1" ||
    ip.startsWith("::ffff:127.0.0.1") ||
    ip.startsWith("192.168.") ||
    ip.startsWith("10.") ||
    ip.startsWith("172.16.") ||
    ip.startsWith("172.17.") ||
    ip.startsWith("172.18.") ||
    ip.startsWith("172.19.") ||
    ip.startsWith("172.2") ||
    ip.startsWith("172.30.") ||
    ip.startsWith("172.31.") ||
    ip.startsWith("fe80:")
  );
}

async function tryGeoFetch(url: string, extract: (data: any) => string | null, timeoutMs = 4000): Promise<string | null> {
  try {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeoutMs);
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(id);
    if (res.ok) {
      const data = (await res.json()) as any;
      return extract(data);
    }
  } catch (_) {
    // fallthrough
  }
  return null;
}

async function getIpLocation(ip: string): Promise<string> {
  if (!ip || isPrivateIp(ip)) {
    return "Localhost";
  }

  // 1. ipwho.is — free, no key, HTTPS, no strict rate limit
  const loc1 = await tryGeoFetch(`https://ipwho.is/${ip}`, (d) => {
    if (!d || d.success === false) return null;
    return [d.city, d.region, d.country].filter(Boolean).join(", ") || null;
  });
  if (loc1) return loc1;

  // 2. ipapi.co — free 1000/day, HTTPS
  const loc2 = await tryGeoFetch(`https://ipapi.co/${ip}/json/`, (d) => {
    if (!d || d.error) return null;
    return [d.city, d.region, d.country_name].filter(Boolean).join(", ") || null;
  });
  if (loc2) return loc2;

  // 3. ip-api.com — free, HTTPS via fields endpoint (non-commercial)
  const loc3 = await tryGeoFetch(`https://ip-api.com/json/${ip}?fields=status,city,regionName,country`, (d) => {
    if (!d || d.status !== "success") return null;
    return [d.city, d.regionName, d.country].filter(Boolean).join(", ") || null;
  });
  if (loc3) return loc3;

  return "Tidak diketahui";
}

export function signLogEntry(data: {
  userId?: string | null;
  username?: string | null;
  action: string;
  details?: string | null;
  ip?: string | null;
  userAgent?: string | null;
  createdAt: Date;
}): string {
  const secret =
    process.env.LOG_SIGNING_SECRET ??
    process.env.SESSION_SECRET ??
    "default_sbi_secure_audit_log_signing_key_2026";
  const hmac = crypto.createHmac("sha256", secret);
  const payload = [
    data.userId || "",
    data.username || "",
    data.action,
    data.details || "",
    data.ip || "",
    data.userAgent || "",
    data.createdAt.getTime().toString(),
  ].join("|");
  return hmac.update(payload).digest("hex");
}

export function verifyLogEntry(log: {
  userId?: string | null;
  username?: string | null;
  action: string;
  details?: string | null;
  ip?: string | null;
  userAgent?: string | null;
  createdAt: Date;
  signature?: string | null;
}): boolean {
  if (!log.signature) return false;
  const expected = signLogEntry(log);
  if (log.signature.length !== expected.length) return false;
  return crypto.timingSafeEqual(
    Buffer.from(log.signature, "hex"),
    Buffer.from(expected, "hex"),
  );
}

export async function logActivity(action: string, details?: string, overrideUserId?: string) {
  try {
    const event = getRequestEvent();

    // 1. Get Client IP (Check proxy headers first to bypass reverse proxies / Cloudflare)
    const headers = event?.request?.headers;
    const ip = headers?.get("cf-connecting-ip")
      || headers?.get("x-real-ip")
      || headers?.get("x-forwarded-for")?.split(",")[0]?.trim()
      || event?.clientAddress
      || "127.0.0.1";

    // 2. Get User Agent
    const rawUA = event?.request?.headers?.get("user-agent") || "Unknown";
    const userAgent = parseUserAgent(rawUA);

    // 3. Get User ID
    let userId: string | null = null;
    let username: string | null = null;

    if (overrideUserId) {
      userId = overrideUserId;
      const user = await db.user.findUnique({ where: { id: overrideUserId } });
      if (user) {
        username = user.username;
      }
    } else {
      const session = await getSession();
      if (session.data.userId) {
        userId = session.data.userId;
        const user = await db.user.findUnique({ where: { id: userId || undefined } });
        if (user) {
          username = user.username;
        }
      }
    }

    const createdAt = new Date();
    const signature = signLogEntry({
      userId,
      username,
      action,
      details,
      ip,
      userAgent,
      createdAt,
    });

    // 4. Create Audit Log entry (initially with location null or loading)
    const logEntry = await (db as any).auditLog.create({
      data: {
        userId: userId || undefined,
        username: username || undefined,
        action,
        details,
        ip,
        userAgent,
        signature,
        createdAt,
        location: isPrivateIp(ip) ? "Localhost" : "Memuat...",
      },
    });

    // 5. Fetch location asynchronously (fire-and-forget background promise)
    if (ip && !isPrivateIp(ip)) {
      getIpLocation(ip).then(async (loc) => {
        if (loc) {
          await (db as any).auditLog.update({
            where: { id: logEntry.id },
            data: { location: loc },
          });
        }
      }).catch((e) => {
        console.error("Geocoding background error:", e);
      });
    }
  } catch (err) {
    console.error("Audit log error:", err);
  }
}

