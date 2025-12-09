const db = require('./config/database');

async function fixSubmissionsTable() {
  try {
    console.log('🔄 Fixing submissions table columns...\n');

    const columns = [
      {
        name: 'project_zip_url',
        sql: 'ALTER TABLE submissions ADD COLUMN project_zip_url VARCHAR(255) NULL AFTER description'
      }
    ];

    for (const column of columns) {
      try {
        await db.query(column.sql);
        console.log(`  ✓ Added column: ${column.name}`);
      } catch (err) {
        if (err.code === 'ER_DUP_FIELDNAME') {
          console.log(`  ⚠ Column ${column.name} already exists`);
        } else {
          console.error(`  ✗ Error adding ${column.name}:`, err.message);
        }
      }
    }

    console.log('\n✅ Submissions table fixed!');
    console.log('\nYou can now submit projects with ZIP files.');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

fixSubmissionsTable();
