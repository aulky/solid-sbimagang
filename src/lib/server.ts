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
    include: { divisi: true },
  });
  if (!user || (user as any).status === "NONAKTIF") {
    await logout();
    throw redirect("/login");
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

async function getIpLocation(ip: string): Promise<string> {
  if (!ip || isPrivateIp(ip)) {
    return "Localhost";
  }

  // Try ipapi.co (HTTPS) first
  try {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), 2000);
    const res = await fetch(`https://ipapi.co/${ip}/json/`, { signal: controller.signal });
    clearTimeout(id);
    if (res.ok) {
      const data = (await res.json()) as any;
      if (data && !data.error) {
        const city = data.city || "";
        const region = data.region || "";
        const country = data.country_name || "";
        const loc = [city, region, country].filter(Boolean).join(", ");
        if (loc) return loc;
      }
    }
  } catch (e) {
    // Ignore and fallback
  }

  // Fallback to ip-api.com (HTTP)
  try {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), 2000);
    const res = await fetch(`http://ip-api.com/json/${ip}`, { signal: controller.signal });
    clearTimeout(id);
    if (res.ok) {
      const data = (await res.json()) as any;
      if (data && data.status === "success") {
        const city = data.city || "";
        const region = data.regionName || "";
        const country = data.country || "";
        return [city, region, country].filter(Boolean).join(", ");
      }
    }
  } catch (e) {
    // Ignore
  }

  return "Tidak diketahui";
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

    // 4. Create Audit Log entry (initially with location null or loading)
    const logEntry = await (db as any).auditLog.create({
      data: {
        userId: userId || undefined,
        username: username || undefined,
        action,
        details,
        ip,
        userAgent,
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

