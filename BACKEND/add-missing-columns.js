const db = require('./config/database');

async function addMissingColumns() {
  try {
    console.log('🔄 Adding missing columns to hackathons table...\n');

    // Add missing columns one by one
    const columns = [
      {
        name: 'development_start_date',
        sql: 'ALTER TABLE hackathons ADD COLUMN development_start_date DATETIME NULL AFTER team_formation_end_date'
      },
      {
        name: 'development_end_date',
        sql: 'ALTER TABLE hackathons ADD COLUMN development_end_date DATETIME NULL AFTER development_start_date'
      },
      {
        name: 'winner_announcement_date',
        sql: 'ALTER TABLE hackathons ADD COLUMN winner_announcement_date DATETIME NULL AFTER result_announcement_date'
      },
      {
        name: 'location',
        sql: 'ALTER TABLE hackathons ADD COLUMN location VARCHAR(255) NULL AFTER tags'
      },
      {
        name: 'is_online',
        sql: 'ALTER TABLE hackathons ADD COLUMN is_online BOOLEAN DEFAULT TRUE AFTER location'
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

    console.log('\n✅ All missing columns added successfully!');
    console.log('\nYou can now create hackathons in the admin panel.');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

addMissingColumns();
