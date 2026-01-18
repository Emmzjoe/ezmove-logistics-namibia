// ==================== MIGRATION RUNNER ====================
// Script to run database migrations

const fs = require('fs').promises;
const path = require('path');
const db = require('../config/database');

async function runMigration(filePath) {
  try {
    console.log(`\n📄 Reading migration: ${path.basename(filePath)}`);
    const sql = await fs.readFile(filePath, 'utf8');

    console.log('🔄 Executing migration...');
    await db.query(sql);

    console.log('✅ Migration completed successfully');
    return true;
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    throw error;
  }
}

async function runAllMigrations() {
  const migrationsDir = path.join(__dirname, 'migrations');

  try {
    console.log('\n🚀 ========================================');
    console.log('🚀 Database Migration Runner');
    console.log('🚀 ========================================');

    // Read all migration files
    const files = await fs.readdir(migrationsDir);
    const migrationFiles = files
      .filter(f => f.endsWith('.sql'))
      .sort(); // Run in alphabetical order

    if (migrationFiles.length === 0) {
      console.log('⚠️  No migration files found');
      return;
    }

    console.log(`\n📋 Found ${migrationFiles.length} migration(s)`);

    // Run each migration
    for (const file of migrationFiles) {
      const filePath = path.join(migrationsDir, file);
      await runMigration(filePath);
    }

    console.log('\n✨ ========================================');
    console.log('✨ All migrations completed successfully!');
    console.log('✨ ========================================\n');

  } catch (error) {
    console.error('\n❌ Migration process failed:', error.message);
    process.exit(1);
  } finally {
    // Close database connection
    await db.pool.end();
    console.log('🔌 Database connection closed\n');
  }
}

// Run if called directly
if (require.main === module) {
  runAllMigrations();
}

module.exports = { runMigration, runAllMigrations };
