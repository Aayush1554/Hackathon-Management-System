require('dotenv').config();
const mysql = require('mysql2/promise');

async function updateHackathonDates() {
  let connection;
  
  try {
    console.log('🔄 Connecting to database...');
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'hackathon_db'
    });
    
    console.log('✓ Database connected successfully\n');
    
    // Current date: November 11, 2025
    
    // 2 ENDED HACKATHONS (registration deadline has passed)
    const endedHackathons = [
      {
        title: "AI Innovation Challenge 2024",
        registration_start_date: "2025-09-01 00:00:00",
        registration_end_date: "2025-10-20 23:59:59", // ENDED (before Nov 11)
        team_formation_start_date: "2025-09-01 00:00:00",
        team_formation_end_date: "2025-10-24 23:59:59",
        development_start_date: "2025-10-25 00:00:00",
        development_end_date: "2025-12-15 23:59:59",
        hackathon_start_date: "2025-10-25 00:00:00",
        hackathon_end_date: "2025-12-15 23:59:59",
        submission_deadline: "2025-12-15 23:59:59",
        judging_start_date: "2025-12-16 00:00:00",
        judging_end_date: "2025-12-20 23:59:59",
        winner_announcement_date: "2025-12-21 18:00:00",
        status: "in_progress"
      },
      {
        title: "Web3 Blockchain Hackathon",
        registration_start_date: "2025-09-15 00:00:00",
        registration_end_date: "2025-11-05 23:59:59", // ENDED (before Nov 11)
        team_formation_start_date: "2025-09-15 00:00:00",
        team_formation_end_date: "2025-11-08 23:59:59",
        development_start_date: "2025-11-10 09:00:00",
        development_end_date: "2025-12-25 18:00:00",
        hackathon_start_date: "2025-11-10 09:00:00",
        hackathon_end_date: "2025-12-25 18:00:00",
        submission_deadline: "2025-12-25 18:00:00",
        judging_start_date: "2025-12-26 09:00:00",
        judging_end_date: "2025-12-30 18:00:00",
        winner_announcement_date: "2025-12-31 16:00:00",
        status: "in_progress"
      }
    ];
    
    // 5 ONGOING HACKATHONS (registration open, hackathon in progress)
    const ongoingHackathons = [
      {
        title: "Full Stack Developer Challenge",
        registration_start_date: "2025-10-01 00:00:00",
        registration_end_date: "2025-11-25 23:59:59", // Still open (after Nov 11)
        team_formation_start_date: "2025-10-01 00:00:00",
        team_formation_end_date: "2025-11-28 23:59:59",
        development_start_date: "2025-11-01 00:00:00",
        development_end_date: "2026-01-10 23:59:59",
        hackathon_start_date: "2025-11-01 00:00:00",
        hackathon_end_date: "2026-01-10 23:59:59",
        submission_deadline: "2026-01-10 23:59:59",
        judging_start_date: "2026-01-11 00:00:00",
        judging_end_date: "2026-01-15 23:59:59",
        winner_announcement_date: "2026-01-16 17:00:00",
        status: "in_progress"
      },
      {
        title: "Mobile App Innovation Sprint",
        registration_start_date: "2025-10-10 00:00:00",
        registration_end_date: "2025-11-30 23:59:59", // Still open (after Nov 11)
        team_formation_start_date: "2025-10-10 00:00:00",
        team_formation_end_date: "2025-12-03 23:59:59",
        development_start_date: "2025-11-05 00:00:00",
        development_end_date: "2026-01-15 23:59:59",
        hackathon_start_date: "2025-11-05 00:00:00",
        hackathon_end_date: "2026-01-15 23:59:59",
        submission_deadline: "2026-01-15 23:59:59",
        judging_start_date: "2026-01-16 00:00:00",
        judging_end_date: "2026-01-20 23:59:59",
        winner_announcement_date: "2026-01-21 16:00:00",
        status: "in_progress"
      },
      {
        title: "Cybersecurity & Ethical Hacking",
        registration_start_date: "2025-10-15 00:00:00",
        registration_end_date: "2025-11-20 23:59:59", // Still open (after Nov 11)
        team_formation_start_date: "2025-10-15 00:00:00",
        team_formation_end_date: "2025-11-23 23:59:59",
        development_start_date: "2025-11-01 09:00:00",
        development_end_date: "2025-12-20 18:00:00",
        hackathon_start_date: "2025-11-01 09:00:00",
        hackathon_end_date: "2025-12-20 18:00:00",
        submission_deadline: "2025-12-20 18:00:00",
        judging_start_date: "2025-12-21 09:00:00",
        judging_end_date: "2025-12-25 18:00:00",
        winner_announcement_date: "2025-12-26 15:00:00",
        status: "in_progress"
      },
      {
        title: "Cloud Computing & DevOps Challenge",
        registration_start_date: "2025-10-20 00:00:00",
        registration_end_date: "2025-12-05 23:59:59", // Still open (after Nov 11)
        team_formation_start_date: "2025-10-20 00:00:00",
        team_formation_end_date: "2025-12-08 23:59:59",
        development_start_date: "2025-11-10 00:00:00",
        development_end_date: "2026-01-20 23:59:59",
        hackathon_start_date: "2025-11-10 00:00:00",
        hackathon_end_date: "2026-01-20 23:59:59",
        submission_deadline: "2026-01-20 23:59:59",
        judging_start_date: "2026-01-21 00:00:00",
        judging_end_date: "2026-01-25 23:59:59",
        winner_announcement_date: "2026-01-26 14:00:00",
        status: "in_progress"
      },
      {
        title: "IoT & Smart Systems Hackathon",
        registration_start_date: "2025-10-25 00:00:00",
        registration_end_date: "2025-12-10 23:59:59", // Still open (after Nov 11)
        team_formation_start_date: "2025-10-25 00:00:00",
        team_formation_end_date: "2025-12-13 23:59:59",
        development_start_date: "2025-11-05 00:00:00",
        development_end_date: "2026-01-25 23:59:59",
        hackathon_start_date: "2025-11-05 00:00:00",
        hackathon_end_date: "2026-01-25 23:59:59",
        submission_deadline: "2026-01-25 23:59:59",
        judging_start_date: "2026-01-26 00:00:00",
        judging_end_date: "2026-01-30 23:59:59",
        winner_announcement_date: "2026-01-31 12:00:00",
        status: "in_progress"
      }
    ];
    
    // 2 UPCOMING HACKATHONS (registration open, hackathon hasn't started yet)
    const upcomingHackathons = [
      {
        title: "Data Science & Analytics Summit",
        registration_start_date: "2025-11-01 00:00:00",
        registration_end_date: "2025-12-20 23:59:59", // Still open (after Nov 11)
        team_formation_start_date: "2025-11-01 00:00:00",
        team_formation_end_date: "2025-12-23 23:59:59",
        development_start_date: "2026-01-05 00:00:00",
        development_end_date: "2026-02-28 23:59:59",
        hackathon_start_date: "2026-01-05 00:00:00",
        hackathon_end_date: "2026-02-28 23:59:59",
        submission_deadline: "2026-02-28 23:59:59",
        judging_start_date: "2026-03-01 00:00:00",
        judging_end_date: "2026-03-05 23:59:59",
        winner_announcement_date: "2026-03-06 15:00:00",
        status: "open"
      },
      {
        title: "Game Development Championship",
        registration_start_date: "2025-11-05 00:00:00",
        registration_end_date: "2026-01-10 23:59:59", // Still open (after Nov 11)
        team_formation_start_date: "2025-11-05 00:00:00",
        team_formation_end_date: "2026-01-13 23:59:59",
        development_start_date: "2026-01-20 00:00:00",
        development_end_date: "2026-03-20 23:59:59",
        hackathon_start_date: "2026-01-20 00:00:00",
        hackathon_end_date: "2026-03-20 23:59:59",
        submission_deadline: "2026-03-20 23:59:59",
        judging_start_date: "2026-03-21 00:00:00",
        judging_end_date: "2026-03-25 23:59:59",
        winner_announcement_date: "2026-03-26 16:00:00",
        status: "open"
      }
    ];
    
    const allHackathons = [...endedHackathons, ...ongoingHackathons, ...upcomingHackathons];
    
    for (const hackathon of allHackathons) {
      const query = `
        UPDATE hackathons SET
          registration_start_date = ?,
          registration_end_date = ?,
          team_formation_start_date = ?,
          team_formation_end_date = ?,
          development_start_date = ?,
          development_end_date = ?,
          hackathon_start_date = ?,
          hackathon_end_date = ?,
          submission_deadline = ?,
          judging_start_date = ?,
          judging_end_date = ?,
          winner_announcement_date = ?,
          status = ?
        WHERE title = ?
      `;
      
      const values = [
        hackathon.registration_start_date,
        hackathon.registration_end_date,
        hackathon.team_formation_start_date,
        hackathon.team_formation_end_date,
        hackathon.development_start_date,
        hackathon.development_end_date,
        hackathon.hackathon_start_date,
        hackathon.hackathon_end_date,
        hackathon.submission_deadline,
        hackathon.judging_start_date,
        hackathon.judging_end_date,
        hackathon.winner_announcement_date,
        hackathon.status,
        hackathon.title
      ];
      
      await connection.execute(query, values);
      
      const registrationStatus = new Date(hackathon.registration_end_date) < new Date('2025-11-11') 
        ? '❌ REGISTRATION ENDED' 
        : '✅ REGISTRATION OPEN';
      
      console.log(`✓ Updated: ${hackathon.title} (${hackathon.status.toUpperCase()}) - ${registrationStatus}`);
    }
    
    console.log('\n✅ All hackathon dates updated successfully!');
    console.log('\n📊 Summary (as of November 11, 2025):');
    console.log('   • 2 Hackathons with ENDED registration (teams cannot register)');
    console.log('   • 5 Ongoing hackathons (registration OPEN)');
    console.log('   • 2 Upcoming hackathons (registration OPEN)');
    console.log('\n⚠️  Note: Teams can only register for hackathons where registration is still open!');
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    throw error;
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n✓ Database connection closed');
    }
  }
}

updateHackathonDates();
