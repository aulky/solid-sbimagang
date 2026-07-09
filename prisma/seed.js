import { PrismaClient } from "../src/generated/client/index.js";
import crypto from "crypto";

const db = new PrismaClient();

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex");
  return `${salt}:${hash}`;
}

async function main() {
  console.log("Seeding database...");

  // Clear existing
  await db.izin.deleteMany();
  await db.absensi.deleteMany();
  await db.user.deleteMany();
  await db.divisi.deleteMany();

  // Create Admin
  const adminPassword = hashPassword("admin123456");
  await db.user.create({
    data: {
      username: "admin",
      password: adminPassword,
      fullName: "Admin Pengelola Magang",
      email: "admin@solusibangunindonesia.co.id",
      phone: "081234567890",
      role: "ADMIN",
      status: "AKTIF"
    }
  });

  // Create Intern User 1 (IT)
  const user1Password = hashPassword("intern123456");
  await db.user.create({
    data: {
      username: "budi",
      password: user1Password,
      fullName: "Budi Santoso",
      email: "budi.santoso@magang.sbi.co.id",
      phone: "089876543210",
      role: "USER",
      status: "AKTIF"
    }
  });

  // Create Intern User 2 (HR)
  const user2Password = hashPassword("intern123456");
  await db.user.create({
    data: {
      username: "siti",
      password: user2Password,
      fullName: "Siti Rahma",
      email: "siti.rahma@magang.sbi.co.id",
      phone: "085678901234",
      role: "USER",
      status: "AKTIF"
    }
  });

  console.log("Seeding done successfully.");
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
