import { APIEvent } from "@solidjs/start/server";
import * as XLSX from "xlsx";
import { db } from "~/lib/db";

export async function GET({ request }: APIEvent) {
  "use server";
  // ponytail: no auth guard on template download — it's just headers, no sensitive data

  const [divisiList, batchList] = await Promise.all([
    db.divisi.findMany({ orderBy: { name: "asc" } }),
    db.batchMagang.findMany({ orderBy: { name: "asc" } }),
  ]);

  // Main sheet with headers + example
  const headers = ["username", "password", "fullName", "email", "phone", "role", "divisi", "batch"];
  const example = ["budi123", "rahasia123", "Budi Santoso", "budi@email.com", "'081234567890", "USER",
    divisiList[0]?.name || "IT", batchList[0]?.name || "Batch 1"];
  const ws = XLSX.utils.aoa_to_sheet([headers, example]);
  ws["!cols"] = headers.map(() => ({ wch: 22 }));

  // Reference sheet — available divisi & batch names + instructions
  const refData: string[][] = [
    ["Daftar Divisi", "Daftar Batch", "", "PETUNJUK PENGISIAN"],
    ...Array.from({ length: Math.max(divisiList.length, batchList.length) }, (_, i) => [
      divisiList[i]?.name || "", batchList[i]?.name || "", "",
      i === 0 ? "[PERINGATAN] JANGAN UBAH baris 1 (header) di sheet Template!" : "",
    ]),
  ];
  // Add instructions if less than 7 rows
  const instructions = [
    "[PERINGATAN] JANGAN UBAH baris 1 (header) di sheet Template!",
    "[PETUNJUK] Tambahkan data pengguna mulai dari baris 2 ke bawah.",
    "[PETUNJUK] Kolom wajib: username, password, fullName, email.",
    "[PETUNJUK] Kolom opsional: phone, role (USER/ADMIN), divisi, batch.",
    "[PETUNJUK] Nilai divisi & batch harus sesuai daftar di kolom A & B.",
    "[PETUNJUK] Contoh data sudah tersedia di baris 2, boleh ditimpa.",
    "[PERINGATAN] JANGAN UBAH nama sheet 'Template'.",
  ];
  // Ensure we have enough rows for instructions
  while (refData.length < instructions.length + 1) {
    refData.push(["", "", "", ""]);
  }
  for (let i = 0; i < instructions.length; i++) {
    refData[i + 1][3] = instructions[i];
  }

  const wsRef = XLSX.utils.aoa_to_sheet(refData);
  wsRef["!cols"] = [{ wch: 30 }, { wch: 30 }, { wch: 3 }, { wch: 55 }];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Template");
  XLSX.utils.book_append_sheet(wb, wsRef, "Referensi");

  const buf = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });

  return new Response(buf, {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": 'attachment; filename="Template_Import_Pengguna.xlsx"',
    },
  });
}
