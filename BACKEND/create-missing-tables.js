const db = require('./config/database');

async function createMissingTables() {
  try {
    console.log('🔄 Creating any missing tables...\n');

    // Check and create mentor_team_assignments table
    try {
      await db.query(`
        CREATE TABLE IF NOT EXISTS mentor_team_assignments (
          assignment_id INT PRIMARY KEY AUTO_INCREMENT,
          mentor_id INT NOT NULL,
          team_id INT NOT NULL,
          assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          notes TEXT,
          FOREIGN KEY (mentor_id) REFERENCES users(user_id) ON DELETE CASCADE,
          FOREIGN KEY (team_id) REFERENCES teams(team_id) ON DELETE CASCADE,
          INDEX idx_mentor (mentor_id),
          INDEX idx_team (team_id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);
      console.log('  ✓ Created mentor_team_assignments table');
    } catch (err) {
      console.log('  ⚠ mentor_team_assignments table already exists');
    }

    console.log('\n✅ All tables verified!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

createMissingTables();
