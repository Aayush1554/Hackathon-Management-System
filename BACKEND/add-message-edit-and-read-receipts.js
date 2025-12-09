const mysql = require('mysql2/promise');

async function addEditAndReadReceiptColumns() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'hackathon'
  });

  try {
    console.log('🔧 Adding message edit and read receipt columns...\n');

    // Add columns for message editing
    console.log('1️⃣ Adding edited_at column...');
    await connection.execute(`
      ALTER TABLE team_mentor_communications 
      ADD COLUMN IF NOT EXISTS edited_at TIMESTAMP NULL,
      ADD COLUMN IF NOT EXISTS is_edited BOOLEAN DEFAULT FALSE
    `);
    console.log('✅ Edit tracking columns added\n');

    // Add columns for read receipts (single tick = sent, double tick = read)
    console.log('2️⃣ Adding read receipt columns...');
    await connection.execute(`
      ALTER TABLE team_mentor_communications 
      ADD COLUMN IF NOT EXISTS is_delivered BOOLEAN DEFAULT TRUE,
      ADD COLUMN IF NOT EXISTS is_read BOOLEAN DEFAULT FALSE,
      ADD COLUMN IF NOT EXISTS read_at TIMESTAMP NULL
    `);
    console.log('✅ Read receipt columns added\n');

    // Create index for read status queries
    console.log('3️⃣ Creating indexes...');
    await connection.execute(`
      CREATE INDEX IF NOT EXISTS idx_read_status 
      ON team_mentor_communications (is_read, is_delivered)
    `);
    console.log('✅ Indexes created\n');

    console.log('✨ All columns and indexes created successfully!');
    console.log('\nNew columns:');
    console.log('- edited_at: Timestamp when message was last edited');
    console.log('- is_edited: Boolean flag indicating if message was edited');
    console.log('- is_delivered: Boolean for single tick (message sent/delivered)');
    console.log('- is_read: Boolean for double tick (message read by receiver)');
    console.log('- read_at: Timestamp when message was read');

  } catch (error) {
    console.error('❌ Error:', error.message);
    throw error;
  } finally {
    await connection.end();
  }
}

addEditAndReadReceiptColumns()
  .then(() => {
    console.log('\n✅ Database schema updated successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Failed to update schema:', error);
    process.exit(1);
  });
