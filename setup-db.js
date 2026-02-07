#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting database setup...');

// PostgreSQL bin path (adjust if different)
const PG_BIN = '"C:\\Program Files\\PostgreSQL\\18\\bin"';

function runCommand(command, description) {
  try {
    console.log(`📄 ${description}...`);
    const result = execSync(command, { stdio: 'inherit', cwd: process.cwd() });
    return result;
  } catch (error) {
    console.error(`❌ Error ${description}:`, error.message);
    throw error;
  }
}

async function setup() {
  try {
    // Create database
    runCommand(
      `${PG_BIN}\\createdb.exe jujutsu_502`,
      'Creating database jujutsu_502'
    );

    // Run schema
    runCommand(
      `${PG_BIN}\\psql.exe -d jujutsu_502 -f database/schema.sql`,
      'Running database/schema.sql'
    );

    // Run seed data
    runCommand(
      `${PG_BIN}\\psql.exe -d jujutsu_502 -f database/seed.sql`,
      'Running database/seed.sql'
    );

    console.log('✅ Database setup completed successfully!');
    console.log('🎯 You can now start the server with: npm run dev');

  } catch (error) {
    console.error('💥 Database setup failed:', error.message);
    process.exit(1);
  }
}

setup();