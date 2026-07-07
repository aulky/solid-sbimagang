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

  // Create Divisi
  const divisiIT = await db.divisi.create({
    data: {
      name: "Teknologi Informasi (IT)",
      description: "Divisi pengembangan sistem, jaringan, dan otomasi industri di PT. Solusi Bangun Indonesia."
    }
  });

  const divisiHR = await db.divisi.create({
    data: {
      name: "Human Resources (HR)",
      description: "Divisi pengelolaan sumber daya manusia dan administrasi anak magang."
    }
  });

  const divisiPR = await db.divisi.create({
    data: {
      name: "Public Relations (PR)",
      description: "Divisi hubungan masyarakat dan komunikasi eksternal."
    }
  });

  console.log("Divisions created.");

  // Create Admin
  const adminPassword = hashPassword("admin123456");
  const admin = await db.user.create({
    data: {
      username: "admin",
      password: adminPassword,
      fullName: "Admin Pengelola Magang",
      email: "admin@solusibangunindonesia.co.id",
      phone: "081234567890",
      role: "ADMIN",
      isActive: true
    }
  });

  // Create Intern User 1 (IT)
  const user1Password = hashPassword("intern123456");
  const user1 = await db.user.create({
    data: {
      username: "budi",
      password: user1Password,
      fullName: "Budi Santoso",
      email: "budi.santoso@magang.sbi.co.id",
      phone: "089876543210",
      role: "USER",
      divisiId: divisiIT.id,
      isActive: true
    }
  });

  // Create Intern User 2 (HR)
  const user2Password = hashPassword("intern123456");
  const user2 = await db.user.create({
    data: {
      username: "siti",
      password: user2Password,
      fullName: "Siti Rahma",
      email: "siti.rahma@magang.sbi.co.id",
      phone: "085678901234",
      role: "USER",
      divisiId: divisiHR.id,
      isActive: true
    }
  });

  console.log("Users created.");

  // Create some history for Budi
  const today = new Date();
  for (let i = 5; i >= 1; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);

    // Check-in jam 07:45 (HADIR), check-out jam 16:05
    const checkIn = new Date(d);
    checkIn.setHours(7, 45, 0);
    const checkOut = new Date(d);
    checkOut.setHours(16, 5, 0);

    await db.absensi.create({
      data: {
        userId: user1.id,
        date: d,
        checkIn,
        checkOut,
        status: "HADIR",
        location: "Kantor Utama (Cilacap)",
        notes: "Kerja di ruangan IT"
      }
    });
  }

  // Create some history for Siti
  for (let i = 5; i >= 2; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);

    // Check-in jam 08:15 (TELAT), check-out jam 16:00
    const checkIn = new Date(d);
    checkIn.setHours(8, 15, 0);
    const checkOut = new Date(d);
    checkOut.setHours(16, 0, 0);

    await db.absensi.create({
      data: {
        userId: user2.id,
        date: d,
        checkIn,
        checkOut,
        status: "TELAT",
        location: "HR Room",
        notes: "Macet di jalan"
      }
    });
  }

  // Siti had 1 Leave (Izin)
  const dIzin = new Date(today);
  dIzin.setDate(today.getDate() - 1);
  await db.izin.create({
    data: {
      userId: user2.id,
      startDate: dIzin,
      endDate: dIzin,
      type: "SAKIT",
      reason: "Demam tinggi, istirahat di rumah",
      status: "APPROVED",
      approvedBy: admin.id,
      approvedAt: new Date()
    }
  });

  await db.absensi.create({
    data: {
      userId: user2.id,
      date: dIzin,
      status: "IZIN",
      notes: "Sakit (Approved)"
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
