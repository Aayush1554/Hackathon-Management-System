// Centralized mock data for hackathons and leaderboard entries.
// In a real app these would be fetched from an API.

export interface Hackathon {
  id: number;
  title: string;
  category: string;
  prize: string;
  teams: number;
  deadline: string; // could be a date string or relative label
  status: string;
  description: string;
  rules: string[];
  prizes: { place: string; amount: string }[];
  timeline: { phase: string; date: string }[];
  criteria: string[];
}

export const hackathons: Hackathon[] = [
  {
    id: 1,
    title: "AI Innovation Challenge",
    category: "Artificial Intelligence",
    prize: "$50,000",
    teams: 142,
    deadline: "15 days left",
    status: "Open",
    description:
      "Build the next generation of AI-powered solutions. This hackathon focuses on practical applications of artificial intelligence to solve real-world problems.",
    rules: [
      "Teams must consist of 2-5 members",
      "All code must be original work created during the hackathon",
      "Projects must be submitted by the deadline",
      "Use of open-source libraries is encouraged",
    ],
    prizes: [
      { place: "1st Place", amount: "$25,000" },
      { place: "2nd Place", amount: "$15,000" },
      { place: "3rd Place", amount: "$10,000" },
    ],
    timeline: [
      { phase: "Registration", date: "Feb 1 - Feb 28" },
      { phase: "Team Formation", date: "Mar 1 - Mar 5" },
      { phase: "Development Phase", date: "Mar 6 - Mar 14" },
      { phase: "Submission Deadline", date: "Mar 15" },
      { phase: "Judging", date: "Mar 16 - Mar 18" },
      { phase: "Winners Announced", date: "Mar 20" },
    ],
    criteria: [
      "Innovation and creativity",
      "Technical implementation",
      "User experience and design",
      "Practical applicability",
      "Presentation and documentation",
    ],
  },
  {
    id: 2,
    title: "Web3 Builder Summit",
    category: "Blockchain",
    prize: "$30,000",
    teams: 98,
    deadline: "22 days left",
    status: "Open",
    description: "Create decentralized applications that matter.",
    rules: ["General hackathon rules apply"],
    prizes: [
      { place: "1st Place", amount: "$15,000" },
      { place: "2nd Place", amount: "$9,000" },
      { place: "3rd Place", amount: "$6,000" },
    ],
    timeline: [
      { phase: "Registration", date: "Open" },
      { phase: "Submission", date: "TBA" },
    ],
    criteria: ["Innovation", "Utility", "Security"],
  },
  {
    id: 3,
    title: "Green Tech Solutions",
    category: "Sustainability",
    prize: "$25,000",
    teams: 76,
    deadline: "30 days left",
    status: "Open",
    description: "Innovate for a sustainable future.",
    rules: ["General hackathon rules apply"],
    prizes: [
      { place: "1st Place", amount: "$12,000" },
      { place: "2nd Place", amount: "$8,000" },
      { place: "3rd Place", amount: "$5,000" },
    ],
    timeline: [
      { phase: "Registration", date: "Open" },
      { phase: "Submission", date: "TBA" },
    ],
    criteria: ["Impact", "Feasibility", "Innovation"],
  },
  // Additional hackathons simplified
  {
    id: 4,
    title: "HealthTech Innovators",
    category: "Healthcare",
    prize: "$40,000",
    teams: 124,
    deadline: "20 days left",
    status: "Open",
    description: "Transform healthcare through technology.",
    rules: ["General hackathon rules apply"],
    prizes: [
      { place: "1st Place", amount: "$20,000" },
      { place: "2nd Place", amount: "$12,000" },
      { place: "3rd Place", amount: "$8,000" },
    ],
    timeline: [
      { phase: "Registration", date: "Open" },
      { phase: "Submission", date: "TBA" },
    ],
    criteria: ["Clinical relevance", "User experience", "Scalability"],
  },
  {
    id: 5,
    title: "EdTech Revolution",
    category: "Education",
    prize: "$35,000",
    teams: 89,
    deadline: "25 days left",
    status: "Open",
    description: "Reshape the future of learning.",
    rules: ["General hackathon rules apply"],
    prizes: [
      { place: "1st Place", amount: "$17,000" },
      { place: "2nd Place", amount: "$10,000" },
      { place: "3rd Place", amount: "$8,000" },
    ],
    timeline: [
      { phase: "Registration", date: "Open" },
      { phase: "Submission", date: "TBA" },
    ],
    criteria: ["Engagement", "Pedagogical value", "Innovation"],
  },
  {
    id: 6,
    title: "FinTech Challenge",
    category: "Finance",
    prize: "$45,000",
    teams: 156,
    deadline: "18 days left",
    status: "Open",
    description: "Build the financial tools of tomorrow.",
    rules: ["General hackathon rules apply"],
    prizes: [
      { place: "1st Place", amount: "$22,000" },
      { place: "2nd Place", amount: "$14,000" },
      { place: "3rd Place", amount: "$9,000" },
    ],
    timeline: [
      { phase: "Registration", date: "Open" },
      { phase: "Submission", date: "TBA" },
    ],
    criteria: ["Security", "Innovation", "Market potential"],
  },
];

export interface LeaderboardEntry {
  hackathonId: number;
  name: string;
  score: number;
  leader: string;
}

// Sample leaderboard data (scores are per-hackathon; ranks will be computed dynamically)
export const leaderboardEntries: LeaderboardEntry[] = [
  { hackathonId: 1, name: "Code Warriors", score: 98, leader: "John Doe" },
  { hackathonId: 1, name: "Tech Titans", score: 95, leader: "Jane Smith" },
  { hackathonId: 1, name: "Innovation Squad", score: 92, leader: "Bob Johnson" },
  { hackathonId: 1, name: "Byte Force", score: 88, leader: "Fiona Green" },
  { hackathonId: 2, name: "Digital Pioneers", score: 90, leader: "Alice Williams" },
  { hackathonId: 2, name: "Future Builders", score: 88, leader: "Charlie Brown" },
  { hackathonId: 3, name: "Code Ninjas", score: 86, leader: "Diana Prince" },
  { hackathonId: 3, name: "Tech Wizards", score: 84, leader: "Ethan Hunt" },
];

export const getHackathonById = (id: number) => hackathons.find(h => h.id === id);