require('dotenv').config();
const mysql = require('mysql2/promise');

(async () => {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'hackathon_db'
  });
  
  const [rows] = await conn.execute('SELECT title, status, is_online, location FROM hackathons');
  
  console.log('\n✅ Hackathons in database:');
  rows.forEach((r, i) => {
    const loc = r.is_online ? 'Online' : r.location;
    console.log(`   ${i+1}. ${r.title} - ${r.status.toUpperCase()} - ${loc}`);
  });
  
  console.log(`\n📊 Total: ${rows.length} hackathons`);
  
  // Count by status
  const completed = rows.filter(r => r.status === 'completed').length;
  const ongoing = rows.filter(r => r.status === 'ongoing').length;
  const upcoming = rows.filter(r => r.status === 'upcoming').length;
  const online = rows.filter(r => r.is_online).length;
  const offline = rows.filter(r => !r.is_online).length;
  
  console.log(`\n   • Completed: ${completed}`);
  console.log(`   • Ongoing: ${ongoing}`);
  console.log(`   • Upcoming: ${upcoming}`);
  console.log(`   • Online: ${online}`);
  console.log(`   • Offline: ${offline}`);
  
  await conn.end();
})();
