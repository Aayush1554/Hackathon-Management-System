const db = require('./config/database');

async function fixTeamMembersTable() {
  try {
    console.log('🔄 Fixing team_members table...\n');

    const columns = [
      {
        name: 'is_leader',
        sql: 'ALTER TABLE team_members ADD COLUMN is_leader BOOLEAN DEFAULT FALSE AFTER role'
      },
      {
        name: 'status',
        sql: "ALTER TABLE team_members ADD COLUMN status ENUM('pending', 'active', 'left') DEFAULT 'active' AFTER is_leader"
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

    console.log('\n✅ team_members table fixed successfully!');
    console.log('\nYou can now create teams.');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

fixTeamMembersTable();
