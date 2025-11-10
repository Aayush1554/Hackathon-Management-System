const db = require('./config/database');

async function deepInspect() {
  const connection = await db.getConnection();
  
  try {
    console.log('🔍 DEEP DATABASE INSPECTION\n');
    
    // Check with different isolation levels
    await connection.query('SET SESSION TRANSACTION ISOLATION LEVEL READ UNCOMMITTED');
    
    const [teams1] = await connection.query('SELECT * FROM teams');
    console.log('Teams (READ UNCOMMITTED):', teams1.length);
    if (teams1.length > 0) console.table(teams1);
    
    const [members1] = await connection.query('SELECT * FROM team_members');
    console.log('\nTeam Members (READ UNCOMMITTED):', members1.length);
    if (members1.length > 0) console.table(members1);
    
    // Force delete everything
    console.log('\n🗑️ FORCE DELETING EVERYTHING...');
    await connection.query('SET FOREIGN_KEY_CHECKS = 0');
    
    // Delete from dependent tables first
    await connection.query('DELETE FROM mentor_team_assignments');
    console.log('✅ Deleted mentor_team_assignments');
    
    await connection.query('TRUNCATE TABLE team_members');
    console.log('✅ Truncated team_members');
    
    await connection.query('TRUNCATE TABLE teams');
    console.log('✅ Truncated teams');
    
    await connection.query('SET FOREIGN_KEY_CHECKS = 1');
    
    console.log('✅ Truncated both tables');
    
    // Verify
    const [teamsAfter] = await connection.query('SELECT COUNT(*) as c FROM teams');
    const [membersAfter] = await connection.query('SELECT COUNT(*) as c FROM team_members');
    
    console.log(`\n✅ After truncate:`);
    console.log(`   Teams: ${teamsAfter[0].c}`);
    console.log(`   Team Members: ${membersAfter[0].c}`);
    
    connection.release();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    connection.release();
    process.exit(1);
  }
}

deepInspect();
