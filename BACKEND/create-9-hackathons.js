require('dotenv').config();
const mysql = require('mysql2/promise');

// Helper function to get admin user_id
async function getAdminUserId(connection) {
  const [rows] = await connection.execute(
    "SELECT user_id FROM users WHERE email = 'admin@hackplatform.com' LIMIT 1"
  );
  if (rows.length === 0) {
    throw new Error("Admin user not found! Please create admin user first.");
  }
  return rows[0].user_id;
}

// Function to create slug from title
function createSlug(title) {
  return title.toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

async function createHackathons() {
  let connection;
  
  try {
    console.log('🔄 Connecting to database...');
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'hackathon_db'
    });
    
    console.log('✓ Database connected successfully');
    
    // Get admin user_id
    const adminUserId = await getAdminUserId(connection);
    console.log(`✓ Found admin user (ID: ${adminUserId})\n`);
    
    const hackathons = [
      // 2 COMPLETED Hackathons
      {
        title: "AI Innovation Challenge 2024",
        category: "Artificial Intelligence",
        description: "Build innovative AI solutions that solve real-world problems. Focus on machine learning, NLP, and computer vision applications.",
        detailed_description: "Join us for an exciting AI hackathon where you'll develop cutting-edge solutions using the latest in artificial intelligence and machine learning technologies.",
        prize_pool: "₹1,00,000",
        first_prize: "₹50,000",
        second_prize: "₹30,000",
        third_prize: "₹20,000",
        rules: "Teams of 2-4 members. Must use at least one AI/ML framework. Code must be original. Open source libraries allowed.",
        judging_criteria: "Innovation (30%), Technical Implementation (30%), Impact (20%), Presentation (20%)",
        tags: JSON.stringify(["AI", "Machine Learning", "NLP", "Computer Vision"]),
        registration_start_date: "2024-08-01 00:00:00",
        registration_end_date: "2024-08-20 23:59:59",
        team_formation_start_date: "2024-08-01 00:00:00",
        team_formation_end_date: "2024-08-24 23:59:59",
        development_start_date: "2024-08-25 00:00:00",
        development_end_date: "2024-09-15 23:59:59",
        hackathon_start_date: "2024-08-25 00:00:00",
        hackathon_end_date: "2024-09-15 23:59:59",
        submission_deadline: "2024-09-15 23:59:59",
        judging_start_date: "2024-09-16 00:00:00",
        judging_end_date: "2024-09-19 23:59:59",
        winner_announcement_date: "2024-09-20 18:00:00",
        max_team_size: 4,
        min_team_size: 2,
        is_online: true,
        location: "Online",
        status: "completed"
      },
      {
        title: "Web3 Blockchain Hackathon",
        category: "Blockchain",
        description: "Explore the future of decentralized applications. Build DApps, smart contracts, and blockchain solutions.",
        detailed_description: "Dive into the world of Web3 and blockchain technology. Build decentralized applications and smart contracts.",
        prize_pool: "₹1,45,000",
        first_prize: "₹75,000",
        second_prize: "₹45,000",
        third_prize: "₹25,000",
        rules: "Teams of 2-5 members. Must deploy on test network. Documentation required. Use any blockchain platform.",
        judging_criteria: "Innovation (25%), Technical Implementation (30%), Security (25%), Use Case (20%)",
        tags: JSON.stringify(["Blockchain", "Web3", "DApps", "Smart Contracts"]),
        registration_start_date: "2024-07-10 00:00:00",
        registration_end_date: "2024-07-30 23:59:59",
        team_formation_start_date: "2024-07-10 00:00:00",
        team_formation_end_date: "2024-08-03 23:59:59",
        development_start_date: "2024-08-05 09:00:00",
        development_end_date: "2024-08-25 18:00:00",
        hackathon_start_date: "2024-08-05 09:00:00",
        hackathon_end_date: "2024-08-25 18:00:00",
        submission_deadline: "2024-08-25 18:00:00",
        judging_start_date: "2024-08-26 09:00:00",
        judging_end_date: "2024-08-30 18:00:00",
        winner_announcement_date: "2024-09-01 16:00:00",
        max_team_size: 5,
        min_team_size: 2,
        is_online: false,
        location: "SVNIT SURAT Guest House",
        status: "completed"
      },
      
      // 5 ONGOING Hackathons
      {
        title: "Full Stack Developer Challenge",
        category: "Web Development",
        description: "Create modern, scalable web applications using the latest technologies. Showcase your full-stack development skills.",
        detailed_description: "Build end-to-end web applications with frontend, backend, and database integration.",
        prize_pool: "₹1,25,000",
        first_prize: "₹60,000",
        second_prize: "₹35,000",
        third_prize: "₹20,000",
        rules: "Teams of 2-4 members. Must include frontend, backend, and database. Responsive design mandatory. API documentation required.",
        judging_criteria: "Code Quality (25%), UI/UX Design (25%), Functionality (25%), Innovation (15%), Documentation (10%)",
        tags: JSON.stringify(["Full Stack", "Web Development", "React", "Node.js"]),
        registration_start_date: "2024-10-15 00:00:00",
        registration_end_date: "2024-11-05 23:59:59",
        team_formation_start_date: "2024-10-15 00:00:00",
        team_formation_end_date: "2024-11-08 23:59:59",
        development_start_date: "2024-11-10 00:00:00",
        development_end_date: "2024-12-10 23:59:59",
        hackathon_start_date: "2024-11-10 00:00:00",
        hackathon_end_date: "2024-12-10 23:59:59",
        submission_deadline: "2024-12-10 23:59:59",
        judging_start_date: "2024-12-11 00:00:00",
        judging_end_date: "2024-12-14 23:59:59",
        winner_announcement_date: "2024-12-15 17:00:00",
        max_team_size: 4,
        min_team_size: 2,
        is_online: true,
        location: "Online",
        status: "ongoing"
      },
      {
        title: "Mobile App Innovation Sprint",
        category: "Mobile Development",
        description: "Develop cutting-edge mobile applications for Android and iOS. Focus on user experience and innovative features.",
        detailed_description: "Create innovative mobile applications that solve real problems with great user experience.",
        prize_pool: "₹1,00,000",
        first_prize: "₹55,000",
        second_prize: "₹30,000",
        third_prize: "₹15,000",
        rules: "Teams of 2-4 members. Native or cross-platform allowed. Must work on real devices. Include demo video.",
        judging_criteria: "User Experience (30%), Technical Implementation (25%), Innovation (25%), Performance (20%)",
        tags: JSON.stringify(["Mobile", "Android", "iOS", "Flutter", "React Native"]),
        registration_start_date: "2024-10-20 00:00:00",
        registration_end_date: "2024-11-08 23:59:59",
        team_formation_start_date: "2024-10-20 00:00:00",
        team_formation_end_date: "2024-11-11 23:59:59",
        development_start_date: "2024-11-12 00:00:00",
        development_end_date: "2024-12-12 23:59:59",
        hackathon_start_date: "2024-11-12 00:00:00",
        hackathon_end_date: "2024-12-12 23:59:59",
        submission_deadline: "2024-12-12 23:59:59",
        judging_start_date: "2024-12-13 00:00:00",
        judging_end_date: "2024-12-17 23:59:59",
        winner_announcement_date: "2024-12-18 16:00:00",
        max_team_size: 4,
        min_team_size: 2,
        is_online: true,
        location: "Online",
        status: "ongoing"
      },
      {
        title: "Cybersecurity & Ethical Hacking",
        category: "Cybersecurity",
        description: "Test your security skills by finding vulnerabilities and building secure systems. CTF challenges included.",
        detailed_description: "Put your cybersecurity skills to the test! Participate in CTF challenges and build secure systems.",
        prize_pool: "₹1,50,000",
        first_prize: "₹70,000",
        second_prize: "₹40,000",
        third_prize: "₹25,000",
        rules: "Teams of 2-3 members. No illegal activities. Report vulnerabilities responsibly. Document all findings.",
        judging_criteria: "Technical Depth (30%), Security Impact (30%), Documentation (20%), Responsible Disclosure (20%)",
        tags: JSON.stringify(["Cybersecurity", "Ethical Hacking", "CTF", "Security"]),
        registration_start_date: "2024-10-25 00:00:00",
        registration_end_date: "2024-11-10 23:59:59",
        team_formation_start_date: "2024-10-25 00:00:00",
        team_formation_end_date: "2024-11-13 23:59:59",
        development_start_date: "2024-11-15 09:00:00",
        development_end_date: "2024-12-05 18:00:00",
        hackathon_start_date: "2024-11-15 09:00:00",
        hackathon_end_date: "2024-12-05 18:00:00",
        submission_deadline: "2024-12-05 18:00:00",
        judging_start_date: "2024-12-06 09:00:00",
        judging_end_date: "2024-12-09 18:00:00",
        winner_announcement_date: "2024-12-10 15:00:00",
        max_team_size: 3,
        min_team_size: 2,
        is_online: false,
        location: "IIT Gandhinagar",
        status: "ongoing"
      },
      {
        title: "Cloud Computing & DevOps Challenge",
        category: "Cloud & DevOps",
        description: "Build scalable cloud-native applications with modern DevOps practices. Focus on automation and deployment.",
        detailed_description: "Embrace the cloud! Build scalable applications using cloud platforms and implement DevOps pipelines.",
        prize_pool: "₹1,25,000",
        first_prize: "₹65,000",
        second_prize: "₹40,000",
        third_prize: "₹20,000",
        rules: "Teams of 2-5 members. Must use cloud platform (AWS/Azure/GCP). CI/CD pipeline required. Infrastructure as code mandatory.",
        judging_criteria: "Architecture (30%), Automation (25%), Scalability (25%), Best Practices (20%)",
        tags: JSON.stringify(["Cloud", "DevOps", "AWS", "Azure", "Kubernetes", "Docker"]),
        registration_start_date: "2024-10-28 00:00:00",
        registration_end_date: "2024-11-12 23:59:59",
        team_formation_start_date: "2024-10-28 00:00:00",
        team_formation_end_date: "2024-11-15 23:59:59",
        development_start_date: "2024-11-16 00:00:00",
        development_end_date: "2024-12-16 23:59:59",
        hackathon_start_date: "2024-11-16 00:00:00",
        hackathon_end_date: "2024-12-16 23:59:59",
        submission_deadline: "2024-12-16 23:59:59",
        judging_start_date: "2024-12-17 00:00:00",
        judging_end_date: "2024-12-21 23:59:59",
        winner_announcement_date: "2024-12-22 14:00:00",
        max_team_size: 5,
        min_team_size: 2,
        is_online: true,
        location: "Online",
        status: "ongoing"
      },
      {
        title: "IoT & Smart Systems Hackathon",
        category: "Internet of Things",
        description: "Create innovative IoT solutions for smart homes, cities, and industries. Hardware and software integration required.",
        detailed_description: "Build the future of connected devices! Create IoT solutions combining hardware and software.",
        prize_pool: "₹1,75,000",
        first_prize: "₹80,000",
        second_prize: "₹50,000",
        third_prize: "₹30,000",
        rules: "Teams of 2-4 members. Must include hardware component. Arduino/Raspberry Pi allowed. Working prototype required.",
        judging_criteria: "Innovation (30%), Hardware Design (25%), Software Integration (25%), Practicality (20%)",
        tags: JSON.stringify(["IoT", "Arduino", "Raspberry Pi", "Smart Systems", "Hardware"]),
        registration_start_date: "2024-11-01 00:00:00",
        registration_end_date: "2024-11-15 23:59:59",
        team_formation_start_date: "2024-11-01 00:00:00",
        team_formation_end_date: "2024-11-17 23:59:59",
        development_start_date: "2024-11-18 00:00:00",
        development_end_date: "2024-12-18 23:59:59",
        hackathon_start_date: "2024-11-18 00:00:00",
        hackathon_end_date: "2024-12-18 23:59:59",
        submission_deadline: "2024-12-18 23:59:59",
        judging_start_date: "2024-12-19 00:00:00",
        judging_end_date: "2024-12-24 23:59:59",
        winner_announcement_date: "2024-12-25 12:00:00",
        max_team_size: 4,
        min_team_size: 2,
        is_online: true,
        location: "Online",
        status: "ongoing"
      },
      
      // 2 UPCOMING Hackathons
      {
        title: "Data Science & Analytics Summit",
        category: "Data Science",
        description: "Analyze large datasets and build predictive models. Focus on data visualization, machine learning, and insights.",
        detailed_description: "Dive deep into data! Work with real-world datasets to extract insights and build predictive models.",
        prize_pool: "₹1,90,000",
        first_prize: "₹90,000",
        second_prize: "₹55,000",
        third_prize: "₹35,000",
        rules: "Teams of 2-4 members. Dataset will be provided. Must use Python or R. Jupyter notebooks accepted. Presentation required.",
        judging_criteria: "Data Analysis (25%), Model Performance (30%), Visualization (25%), Insights (20%)",
        tags: JSON.stringify(["Data Science", "Machine Learning", "Analytics", "Python"]),
        registration_start_date: "2024-12-01 00:00:00",
        registration_end_date: "2024-12-20 23:59:59",
        team_formation_start_date: "2024-12-01 00:00:00",
        team_formation_end_date: "2024-12-23 23:59:59",
        development_start_date: "2024-12-25 00:00:00",
        development_end_date: "2025-01-25 23:59:59",
        hackathon_start_date: "2024-12-25 00:00:00",
        hackathon_end_date: "2025-01-25 23:59:59",
        submission_deadline: "2025-01-25 23:59:59",
        judging_start_date: "2025-01-26 00:00:00",
        judging_end_date: "2025-01-31 23:59:59",
        winner_announcement_date: "2025-02-01 15:00:00",
        max_team_size: 4,
        min_team_size: 2,
        is_online: true,
        location: "Online",
        status: "upcoming"
      },
      {
        title: "Game Development Championship",
        category: "Game Development",
        description: "Design and develop engaging games using any game engine. Show your creativity and programming skills.",
        detailed_description: "Unleash your creativity! Design and develop engaging games that players will love.",
        prize_pool: "₹2,20,000",
        first_prize: "₹1,00,000",
        second_prize: "₹60,000",
        third_prize: "₹40,000",
        rules: "Teams of 2-5 members. Any game engine allowed (Unity, Unreal, Godot). Must be playable. Include game design document.",
        judging_criteria: "Gameplay (30%), Graphics & Audio (25%), Innovation (25%), Technical Implementation (20%)",
        tags: JSON.stringify(["Game Development", "Unity", "Unreal", "Gaming"]),
        registration_start_date: "2024-12-10 00:00:00",
        registration_end_date: "2025-01-05 23:59:59",
        team_formation_start_date: "2024-12-10 00:00:00",
        team_formation_end_date: "2025-01-08 23:59:59",
        development_start_date: "2025-01-10 00:00:00",
        development_end_date: "2025-02-10 23:59:59",
        hackathon_start_date: "2025-01-10 00:00:00",
        hackathon_end_date: "2025-02-10 23:59:59",
        submission_deadline: "2025-02-10 23:59:59",
        judging_start_date: "2025-02-11 00:00:00",
        judging_end_date: "2025-02-14 23:59:59",
        winner_announcement_date: "2025-02-15 16:00:00",
        max_team_size: 5,
        min_team_size: 2,
        is_online: true,
        location: "Online",
        status: "upcoming"
      }
    ];
    
    for (const hackathon of hackathons) {
      const slug = createSlug(hackathon.title);
      
      const query = `
        INSERT INTO hackathons (
          title, slug, category, description, detailed_description,
          prize_pool, first_prize, second_prize, third_prize,
          rules, judging_criteria, tags,
          registration_start_date, registration_end_date,
          team_formation_start_date, team_formation_end_date,
          development_start_date, development_end_date,
          hackathon_start_date, hackathon_end_date,
          submission_deadline, judging_start_date, judging_end_date,
          winner_announcement_date,
          max_team_size, min_team_size,
          is_online, location, status, created_by
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      
      const values = [
        hackathon.title,
        slug,
        hackathon.category,
        hackathon.description,
        hackathon.detailed_description,
        hackathon.prize_pool,
        hackathon.first_prize,
        hackathon.second_prize,
        hackathon.third_prize,
        hackathon.rules,
        hackathon.judging_criteria,
        hackathon.tags,
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
        hackathon.max_team_size,
        hackathon.min_team_size,
        hackathon.is_online,
        hackathon.location,
        hackathon.status,
        adminUserId
      ];
      
      await connection.execute(query, values);
      console.log(`✓ Created: ${hackathon.title} (${hackathon.status.toUpperCase()}) - ${hackathon.location}`);
    }
    
    console.log('\n✅ All 9 hackathons created successfully!');
    console.log('\n📊 Summary:');
    console.log('   • 2 Completed hackathons');
    console.log('   • 5 Ongoing hackathons');
    console.log('   • 2 Upcoming hackathons');
    console.log('   • 7 Online mode');
    console.log('   • 2 Offline mode (SVNIT SURAT Guest House, IIT Gandhinagar)');
    
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

createHackathons();
