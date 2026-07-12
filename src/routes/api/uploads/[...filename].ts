import { APIEvent } from "@solidjs/start/server";
import { promises as fs } from "fs";
import path from "path";

const MIME_TYPES: Record<string, string> = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".pdf": "application/pdf",
};

export async function GET({ params }: APIEvent) {
  const filename = params.filename;
  if (!filename || filename.includes("..")) {
    return new Response("Not found", { status: 404 });
  }

  const ext = path.extname(filename).toLowerCase();
  if (!MIME_TYPES[ext]) {
    return new Response("Not found", { status: 404 });
  }

  // Coba production path dulu, fallback ke public/uploads
  const candidates = [
    path.join(process.cwd(), ".output", "public", "uploads", filename),
    path.join(process.cwd(), "public", "uploads", filename),
  ];

  for (const filePath of candidates) {
    try {
      const data = await fs.readFile(filePath);
      return new Response(data, {
        headers: {
          "Content-Type": MIME_TYPES[ext],
          "Cache-Control": "public, max-age=31536000, immutable",
        },
      });
    } catch {}
  }

  return new Response("Not found", { status: 404 });
}
