import { T as cloneServerReference, U as createServerReference, V as requireAdmin, W as db, X as validateUsername, Y as validatePassword, Z as hashPassword, _ as logActivity } from "../../entry-server.js";
import * as XLSX from "xlsx";
import "solid-js/web";
import "solid-js";
import "solid-js/web/storage";
import "fs";
import "path";
import "crypto";
import "@prisma/client";
import "node:stream";
const serverFn_1 = createServerReference("b7db7114-0", async function POST({
  request
}) {
  try {
    await requireAdmin();
  } catch (err) {
    return new Response(JSON.stringify({
      error: "Akses ditolak. Anda bukan admin."
    }), {
      status: 403,
      headers: {
        "Content-Type": "application/json"
      }
    });
  }
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    if (!file || file.size === 0) {
      return new Response(JSON.stringify({
        error: "File tidak valid atau kosong."
      }), {
        status: 400,
        headers: {
          "Content-Type": "application/json"
        }
      });
    }
    if (file.size > 2 * 1024 * 1024) {
      return new Response(JSON.stringify({
        error: "Ukuran file maksimal 2MB."
      }), {
        status: 400,
        headers: {
          "Content-Type": "application/json"
        }
      });
    }
    const bytes = await file.arrayBuffer();
    const wb = XLSX.read(new Uint8Array(bytes), {
      type: "array"
    });
    if (!wb || !wb.SheetNames || wb.SheetNames.length === 0) {
      return new Response(JSON.stringify({
        error: "Format Excel tidak valid atau kosong."
      }), {
        status: 400,
        headers: {
          "Content-Type": "application/json"
        }
      });
    }
    const sheet = wb.Sheets[wb.SheetNames[0]];
    if (!sheet) {
      return new Response(JSON.stringify({
        error: "Sheet pertama tidak ditemukan dalam file."
      }), {
        status: 400,
        headers: {
          "Content-Type": "application/json"
        }
      });
    }
    const rows = XLSX.utils.sheet_to_json(sheet);
    if (rows.length === 0) {
      return new Response(JSON.stringify({
        error: "Template kosong, tidak ada data."
      }), {
        status: 400,
        headers: {
          "Content-Type": "application/json"
        }
      });
    }
    const [divisiList, batchList, existingUsers] = await Promise.all([db.divisi.findMany(), db.batchMagang.findMany(), db.user.findMany({
      select: {
        username: true,
        email: true
      }
    })]);
    const divisiMap = new Map(divisiList.map((d) => [d.name.toLowerCase().trim(), d.id]));
    const batchMap = new Map(batchList.map((b) => [b.name.toLowerCase().trim(), b.id]));
    const usedUsernames = new Set(existingUsers.map((u) => u.username.toLowerCase()));
    const usedEmails = new Set(existingUsers.map((u) => u.email.toLowerCase()));
    const errors = [];
    let successCount = 0;
    const batchUsernames = /* @__PURE__ */ new Set();
    const batchEmails = /* @__PURE__ */ new Set();
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
        errors.push({
          row: rowNum,
          username: username || "(kosong)",
          error: "username, password, fullName, dan email wajib diisi."
        });
        continue;
      }
      const ue = validateUsername(username);
      if (ue) {
        errors.push({
          row: rowNum,
          username,
          error: ue
        });
        continue;
      }
      const pe = validatePassword(password);
      if (pe) {
        errors.push({
          row: rowNum,
          username,
          error: pe
        });
        continue;
      }
      if (!["USER", "ADMIN"].includes(role)) {
        errors.push({
          row: rowNum,
          username,
          error: `Role "${r.role}" tidak valid. Gunakan USER atau ADMIN.`
        });
        continue;
      }
      const uLower = username.toLowerCase();
      const eLower = email.toLowerCase();
      if (usedUsernames.has(uLower) || batchUsernames.has(uLower)) {
        errors.push({
          row: rowNum,
          username,
          error: "Username sudah terdaftar."
        });
        continue;
      }
      if (usedEmails.has(eLower) || batchEmails.has(eLower)) {
        errors.push({
          row: rowNum,
          username,
          error: "Email sudah terdaftar."
        });
        continue;
      }
      let divisiId = null;
      if (divisiName) {
        divisiId = divisiMap.get(divisiName.toLowerCase()) ?? null;
        if (!divisiId) {
          errors.push({
            row: rowNum,
            username,
            error: `Divisi "${divisiName}" tidak ditemukan.`
          });
          continue;
        }
      }
      let batchId = null;
      if (batchName) {
        batchId = batchMap.get(batchName.toLowerCase()) ?? null;
        if (!batchId) {
          errors.push({
            row: rowNum,
            username,
            error: `Batch "${batchName}" tidak ditemukan.`
          });
          continue;
        }
      }
      try {
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
            status: "AKTIF"
          }
        });
        batchUsernames.add(uLower);
        batchEmails.add(eLower);
        successCount++;
      } catch (e) {
        errors.push({
          row: rowNum,
          username,
          error: e.message || "Gagal menyimpan."
        });
      }
    }
    if (successCount > 0) {
      await logActivity("BUAT_PENGGUNA", `bulk create ${successCount}/${rows.length} users`);
    }
    return new Response(JSON.stringify({
      total: rows.length,
      successCount,
      errors
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json"
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      error: error.message || "Gagal mengimpor data."
    }), {
      status: 500,
      headers: {
        "Content-Type": "application/json"
      }
    });
  }
});
const POST2 = cloneServerReference(serverFn_1);
export {
  POST2 as POST
};
//# sourceMappingURL=import-D5TA8Z0C.js.map
