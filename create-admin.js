#!/usr/bin/env node

require('dotenv').config();
const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function createAdmin() {
  const email = 'admin@example.com';
  const password = 'password123';
  const fullName = 'Administrator';

  try {
    // Hash password
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Check if admin already exists
    const existing = await prisma.adminUser.findUnique({ where: { email } });

    if (existing) {
      console.log('ℹ️ Admin user already exists');
    } else {
      const user = await prisma.adminUser.create({
        data: {
          email,
          password_hash: passwordHash,
          full_name: fullName,
          is_active: true,
        },
        select: { id: true, email: true, full_name: true },
      });

      console.log('✅ Admin user created successfully!');
      console.log(`📧 Email: ${email}`);
      console.log(`🔑 Password: ${password}`);
      console.log('🔐 Password is hashed with bcrypt');
    }

    await prisma.$disconnect();
  } catch (error) {
    console.error('❌ Error creating admin user:', error.message);
    await prisma.$disconnect();
    process.exit(1);
  }
}

createAdmin();
