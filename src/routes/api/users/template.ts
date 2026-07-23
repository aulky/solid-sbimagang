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
  const example = ["budi123", "rahasia123", "Budi Santoso", "budi@email.com", "081234567890", "USER",
    divisiList[0]?.name || "IT", batchList[0]?.name || "Batch 1"];
  const ws = XLSX.utils.aoa_to_sheet([headers, example]);
  ws["!cols"] = headers.map(() => ({ wch: 22 }));

  // Reference sheet — available divisi & batch names
  const refData: string[][] = [["Daftar Divisi", "Daftar Batch"]];
  const maxLen = Math.max(divisiList.length, batchList.length);
  for (let i = 0; i < maxLen; i++) {
    refData.push([divisiList[i]?.name || "", batchList[i]?.name || ""]);
  }
  const wsRef = XLSX.utils.aoa_to_sheet(refData);
  wsRef["!cols"] = [{ wch: 30 }, { wch: 30 }];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Template");
  XLSX.utils.book_append_sheet(wb, wsRef, "Referensi");

  const buf = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });

  return new Response(buf, {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": 'attachment; filename="Template_Bulk_User.xlsx"',
    },
  });
}
