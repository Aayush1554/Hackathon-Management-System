const db = require('./config/database');

async function updateMemberStatus() {
  let connection;
  try {
    connection = await db.getConnection();
    
    // Update all pending members to active
    const [result] = await connection.query(
      `UPDATE team_members SET status = 'active' WHERE status = 'pending'`
    );
    
    console.log(`✅ Updated ${result.affectedRows} team members from 'pending' to 'active'`);
    
    // Show current status distribution
    const [stats] = await connection.query(
      `SELECT status, COUNT(*) as count FROM team_members GROUP BY status`
    );
    
    console.log('\nCurrent team member status distribution:');
    stats.forEach(stat => {
      console.log(`  ${stat.status}: ${stat.count}`);
    });
    
  } catch (error) {
    console.error('Error updating member status:', error);
  } finally {
    if (connection) connection.release();
    process.exit();
  }
}

updateMemberStatus();
