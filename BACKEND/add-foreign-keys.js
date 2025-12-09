const mysql = require('mysql2/promise');
require('dotenv').config();

async function addForeignKeys() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'hackathon_db',
    port: process.env.DB_PORT || 3306
  });
  
  try {
    console.log('✓ Database connected successfully\n');
    
    console.log('🔄 Adding foreign key constraints...\n');
    
    // Add team_id FK
    try {
      await connection.execute(`
        ALTER TABLE team_mentor_communications 
        ADD CONSTRAINT fk_tmc_team 
        FOREIGN KEY (team_id) REFERENCES teams(team_id) ON DELETE CASCADE
      `);
      console.log('  ✓ Added fk_tmc_team');
    } catch (err) {
      console.log(`  ⚠ fk_tmc_team: ${err.message}`);
    }
    
    // Add mentor_id FK
    try {
      await connection.execute(`
        ALTER TABLE team_mentor_communications 
        ADD CONSTRAINT fk_tmc_mentor 
        FOREIGN KEY (mentor_id) REFERENCES users(user_id) ON DELETE CASCADE
      `);
      console.log('  ✓ Added fk_tmc_mentor');
    } catch (err) {
      console.log(`  ⚠ fk_tmc_mentor: ${err.message}`);
    }
    
    // Add sender_id FK
    try {
      await connection.execute(`
        ALTER TABLE team_mentor_communications 
        ADD CONSTRAINT fk_tmc_sender 
        FOREIGN KEY (sender_id) REFERENCES users(user_id) ON DELETE SET NULL
      `);
      console.log('  ✓ Added fk_tmc_sender');
    } catch (err) {
      console.log(`  ⚠ fk_tmc_sender: ${err.message}`);
    }
    
    // Add reply_to_communication_id FK (self-referencing)
    try {
      await connection.execute(`
        ALTER TABLE team_mentor_communications 
        ADD CONSTRAINT fk_tmc_reply 
        FOREIGN KEY (reply_to_communication_id) 
        REFERENCES team_mentor_communications(communication_id) ON DELETE SET NULL
      `);
      console.log('  ✓ Added fk_tmc_reply (self-referencing)');
    } catch (err) {
      console.log(`  ⚠ fk_tmc_reply: ${err.message}`);
    }
    
    console.log('\n✅ Foreign keys added successfully!');
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    throw error;
  } finally {
    await connection.end();
  }
}

addForeignKeys()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('\n❌ Failed:', error);
    process.exit(1);
  });
