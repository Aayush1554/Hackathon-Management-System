require('dotenv').config();
const mysql = require('mysql2/promise');

(async () => {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'hackathon_db'
  });
  
  const [rows] = await conn.execute(`
    SELECT title, status, is_online, location, 
           registration_end_date, hackathon_start_date, hackathon_end_date 
    FROM hackathons 
    ORDER BY hackathon_id
  `);
  
  const now = new Date('2025-11-11');
  
  console.log('\n✅ HACKATHON STATUS REPORT (as of November 11, 2025)\n');
  console.log('═'.repeat(80));
  
  let registrationEnded = 0;
  let registrationOpen = 0;
  
  rows.forEach((h, i) => {
    const regEndDate = new Date(h.registration_end_date);
    const hackStartDate = new Date(h.hackathon_start_date);
    const hackEndDate = new Date(h.hackathon_end_date);
    const canRegister = regEndDate >= now;
    const isOngoing = hackStartDate <= now && hackEndDate >= now;
    const isUpcoming = hackStartDate > now;
    
    if (canRegister) registrationOpen++;
    else registrationEnded++;
    
    const loc = h.is_online ? '🌐 Online' : `📍 ${h.location}`;
    const regStatus = canRegister ? '✅ OPEN' : '❌ ENDED';
    const hackStatus = isOngoing ? '🔄 ONGOING' : isUpcoming ? '📅 UPCOMING' : '✓ COMPLETED';
    
    console.log(`\n${i+1}. ${h.title}`);
    console.log(`   Location: ${loc}`);
    console.log(`   Registration: ${regStatus} (closes ${regEndDate.toLocaleDateString()})`);
    console.log(`   Hackathon: ${hackStatus}`);
    console.log(`   Duration: ${hackStartDate.toLocaleDateString()} - ${hackEndDate.toLocaleDateString()}`);
  });
  
  console.log('\n' + '═'.repeat(80));
  console.log('\n📊 SUMMARY:');
  console.log(`   • Registration ENDED: ${registrationEnded} hackathons`);
  console.log(`   • Registration OPEN: ${registrationOpen} hackathons`);
  console.log(`   • Total: ${rows.length} hackathons`);
  console.log('\n⚠️  Teams can only register for hackathons with OPEN registration!');
  
  await conn.end();
})();
