#!/usr/bin/env node

require('dotenv').config();
const bcrypt = require('bcrypt');
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function createAdmin() {
  const email = 'admin@example.com';
  const password = 'password123';
  const fullName = 'Administrator';

  try {
    // Hash password
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Insert admin user
    const result = await pool.query(
      `INSERT INTO admin_users (email, password_hash, full_name, is_active)
       VALUES ($1, $2, $3, true)
       ON CONFLICT (email) DO NOTHING
       RETURNING id, email, full_name`,
      [email, passwordHash, fullName]
    );

    if (result.rows.length > 0) {
      console.log('✅ Admin user created successfully!');
      console.log(`📧 Email: ${email}`);
      console.log(`🔑 Password: ${password}`);
      console.log('🔐 Password is hashed with bcrypt');
    } else {
      console.log('ℹ️ Admin user already exists');
    }

    await pool.end();
  } catch (error) {
    console.error('❌ Error creating admin user:', error.message);
    process.exit(1);
  }
}

createAdmin();