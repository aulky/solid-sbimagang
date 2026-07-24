import { createMiddleware } from "@solidjs/start/middleware";
import { db } from "./lib/db";
import { signLogEntry } from "./lib/server";

export default createMiddleware({
  onRequest: [
    async (event) => {
      const url = new URL(event.request.url);
      const path = url.pathname;
      const method = event.request.method.toUpperCase();

      // 1. Enforce security headers on all responses
      event.response.headers.set("X-Frame-Options", "DENY");
      event.response.headers.set("X-Content-Type-Options", "nosniff");
      event.response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
      event.response.headers.set("X-XSS-Protection", "1; mode=block");
      event.response.headers.set(
        "Content-Security-Policy",
        "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://fonts.googleapis.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data:; connect-src 'self' https://ipwho.is https://ipapi.co https://ip-api.com;"
      );

      // Exclude static assets/internal routes from security checks
      if (
        path.startsWith("/_build") ||
        path.startsWith("/public") ||
        path.includes(".")
      ) {
        return;
      }

      // 2. Block common hacking attempts & directory traversals
      const maliciousPatterns = [
        "etc/passwd",
        "../",
        "..\\",
        "proc/self",
        ".env",
        ".git",
        "wp-admin",
        "wp-login",
        "union select",
        "union all",
        "select ",
        "insert ",
        "delete ",
        "drop table",
        "<script",
        "javascript:",
        "alert(",
        "onload="
      ];

      const checkStr = (path + url.search).toLowerCase();
      if (maliciousPatterns.some((pattern) => checkStr.includes(pattern))) {
        const ip =
          event.request.headers.get("cf-connecting-ip") ||
          event.request.headers.get("x-real-ip") ||
          event.request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
          event.clientAddress ||
          "127.0.0.1";
        const userAgent = event.request.headers.get("user-agent") || "Unknown";
        const createdAt = new Date();
        const action = "SECURITY_BLOCKED";
        const details = `Blocked malicious request: ${method} ${path}${url.search}`;

        const signature = signLogEntry({
          userId: null,
          username: "SYSTEM",
          action,
          details,
          ip,
          userAgent,
          createdAt,
        });

        try {
          await db.auditLog.create({
            data: {
              userId: undefined,
              username: "SYSTEM",
              action,
              details,
              ip,
              userAgent,
              signature,
              createdAt,
              location: "Blocked Attack",
            },
          });
        } catch (e) {
          console.error("Failed to log security block to DB:", e);
        }

        console.warn(`[SECURITY ALERT] Blocked malicious request: ${method} ${url.href} from ${ip}`);
        return new Response("Access Denied: Malicious Request Detected", {
          status: 403,
          headers: { "Content-Type": "text/plain" }
        });
      }

      // 3. CSRF Protection for state-changing requests
      if (["POST", "PUT", "DELETE", "PATCH"].includes(method)) {
        const origin = event.request.headers.get("origin");
        const referer = event.request.headers.get("referer");
        const host = event.request.headers.get("host");
        let targetHost: string | null = null;

        if (origin) {
          try {
            targetHost = new URL(origin).host;
          } catch (_) {}
        } else if (referer) {
          try {
            targetHost = new URL(referer).host;
          } catch (_) {}
        }

        if (!targetHost || targetHost !== host) {
          console.warn(`[SECURITY ALERT] CSRF blocked: Origin/Referer (${targetHost || "missing"}) does not match Host (${host})`);

          const ip =
            event.request.headers.get("cf-connecting-ip") ||
            event.request.headers.get("x-real-ip") ||
            event.request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
            event.clientAddress ||
            "127.0.0.1";
          const userAgent = event.request.headers.get("user-agent") || "Unknown";
          const createdAt = new Date();
          const action = "CSRF_BLOCKED";
          const details = `Blocked CSRF attempt: ${method} ${path}${url.search}. Host: ${host}, Target: ${targetHost || "None"}`;

          const signature = signLogEntry({
            userId: null,
            username: "SYSTEM",
            action,
            details,
            ip,
            userAgent,
            createdAt,
          });

          try {
            await db.auditLog.create({
              data: {
                userId: undefined,
                username: "SYSTEM",
                action,
                details,
                ip,
                userAgent,
                signature,
                createdAt,
                location: "CSRF Blocked",
              },
            });
          } catch (e) {
            console.error("Failed to log CSRF block to DB:", e);
          }

          return new Response("Access Denied: CSRF Verification Failed", {
            status: 403,
            headers: { "Content-Type": "text/plain" }
          });
        }
      }
    }
  ]
});
