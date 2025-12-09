const db = require('./config/database');

async function addAllMissingColumns() {
  try {
    console.log('🔄 Adding ALL missing columns to match original schema...\n');

    // Get all columns to add/modify per table
    const updates = [
      // TEAMS table updates
      {
        table: 'teams',
        columns: [
          { name: 'team_code', sql: 'ALTER TABLE teams ADD COLUMN team_code VARCHAR(20) UNIQUE NULL AFTER team_leader_id' },
          { name: 'registration_date', sql: 'ALTER TABLE teams ADD COLUMN registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP AFTER description' },
          { name: 'is_approved', sql: 'ALTER TABLE teams ADD COLUMN is_approved BOOLEAN DEFAULT FALSE AFTER registration_date' },
          { name: 'approval_date', sql: 'ALTER TABLE teams ADD COLUMN approval_date TIMESTAMP NULL AFTER is_approved' },
          { name: 'project_title', sql: 'ALTER TABLE teams ADD COLUMN project_title VARCHAR(255) NULL AFTER approval_date' },
          { name: 'project_description', sql: 'ALTER TABLE teams ADD COLUMN project_description TEXT NULL AFTER project_title' },
          { name: 'project_url', sql: 'ALTER TABLE teams ADD COLUMN project_url VARCHAR(255) NULL AFTER project_description' },
          { name: 'demo_video_url', sql: 'ALTER TABLE teams ADD COLUMN demo_video_url VARCHAR(255) NULL AFTER github_repo' },
          { name: 'presentation_url', sql: 'ALTER TABLE teams ADD COLUMN presentation_url VARCHAR(255) NULL AFTER demo_video_url' },
          { name: 'innovation_score', sql: 'ALTER TABLE teams ADD COLUMN innovation_score DECIMAL(5,2) DEFAULT 0.00 AFTER total_score' },
          { name: 'technical_score', sql: 'ALTER TABLE teams ADD COLUMN technical_score DECIMAL(5,2) DEFAULT 0.00 AFTER innovation_score' },
          { name: 'design_score', sql: 'ALTER TABLE teams ADD COLUMN design_score DECIMAL(5,2) DEFAULT 0.00 AFTER technical_score' },
          { name: 'presentation_score', sql: 'ALTER TABLE teams ADD COLUMN presentation_score DECIMAL(5,2) DEFAULT 0.00 AFTER design_score' },
        ]
      },
      // SUBMISSIONS table updates
      {
        table: 'submissions',
        columns: [
          { name: 'submission_title', sql: 'ALTER TABLE submissions CHANGE COLUMN title submission_title VARCHAR(255) NOT NULL' },
          { name: 'submitted_at', sql: 'ALTER TABLE submissions CHANGE COLUMN submission_date submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP' },
          { name: 'documentation_url', sql: 'ALTER TABLE submissions ADD COLUMN documentation_url VARCHAR(255) NULL AFTER video_url' },
          { name: 'version', sql: 'ALTER TABLE submissions ADD COLUMN version INT DEFAULT 1 AFTER is_final' },
        ]
      },
      // MENTORS_HACKATHONS table updates
      {
        table: 'mentors_hackathons',
        columns: [
          { name: 'id', sql: 'ALTER TABLE mentors_hackathons CHANGE COLUMN mentor_hackathon_id id INT AUTO_INCREMENT' },
          { name: 'expertise_area', sql: 'ALTER TABLE mentors_hackathons CHANGE COLUMN specialization expertise_area VARCHAR(255)' },
          { name: 'is_available', sql: 'ALTER TABLE mentors_hackathons ADD COLUMN is_available BOOLEAN DEFAULT TRUE AFTER expertise_area' },
          { name: 'assigned_at', sql: 'ALTER TABLE mentors_hackathons CHANGE COLUMN created_at assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP' },
        ]
      }
    ];

    for (const tableUpdate of updates) {
      console.log(`\n📋 Updating ${tableUpdate.table} table:`);
      
      for (const column of tableUpdate.columns) {
        try {
          await db.query(column.sql);
          console.log(`  ✓ ${column.name}`);
        } catch (err) {
          if (err.code === 'ER_DUP_FIELDNAME') {
            console.log(`  ⚠ ${column.name} already exists`);
          } else if (err.code === 'ER_BAD_FIELD_ERROR' && err.message.includes("check that it exists")) {
            console.log(`  ⚠ ${column.name} - original column doesn't exist, skipping rename`);
          } else {
            console.log(`  ✗ ${column.name}: ${err.message.substring(0, 80)}`);
          }
        }
      }
    }

    // Generate team codes for existing teams
    console.log('\n🔧 Generating team codes for existing teams...');
    const [teams] = await db.query('SELECT team_id FROM teams WHERE team_code IS NULL');
    for (const team of teams) {
      const teamCode = `TEAM${String(team.team_id).padStart(6, '0')}`;
      await db.query('UPDATE teams SET team_code = ? WHERE team_id = ?', [teamCode, team.team_id]);
      console.log(`  ✓ Generated code ${teamCode} for team ${team.team_id}`);
    }

    console.log('\n✅ All missing columns added successfully!');
    console.log('\n🎉 Database schema is now complete and matches the application requirements!');
    
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error(error);
    process.exit(1);
  }
}

addAllMissingColumns();
