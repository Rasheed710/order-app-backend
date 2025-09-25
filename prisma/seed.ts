// prisma/seed.ts
import { PrismaClient } from '@prisma/client'
import * as bcrypt from "bcryptjs";
const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database with an admin user...');

  const adminEmail = 'admin@jrfoods.com';
  const adminPassword = 'JRFood@2025'; // Choose a strong password!

  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    await prisma.user.create({
      data: {
        email: adminEmail,
        password: hashedPassword,
        name: 'Admin User',
        role: 'ADMIN',
      },
    });
    console.log(`Admin user created: ${adminEmail} (password: ${adminPassword})`);
  } else {
    console.log(`Admin user '${adminEmail}' already exists.`);
  }

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })