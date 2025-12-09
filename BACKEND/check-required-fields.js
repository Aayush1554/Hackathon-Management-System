require('dotenv').config();
const mysql = require('mysql2/promise');

(async () => {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'hackathon_db'
  });
  
  const [rows] = await conn.execute('DESCRIBE hackathons');
  console.log('REQUIRED FIELDS (NOT NULL with no default):');
  rows.forEach(r => {
    if(r.Null === 'NO' && r.Default === null && r.Extra !== 'auto_increment') {
      console.log(`  - ${r.Field} (${r.Type})`);
    }
  });
  
  await conn.end();
})();
