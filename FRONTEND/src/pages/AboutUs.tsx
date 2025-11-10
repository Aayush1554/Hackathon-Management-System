import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Trophy, 
  Target, 
  Lightbulb, 
  Code, 
  Rocket,
  Shield,
  Zap,
  CheckCircle,
  Award,
  BookOpen,
  MessageCircle,
  Calendar,
  Lock,
  FileText,
  TrendingUp,
  UserPlus,
  ClipboardCheck,
  Link2,
  DollarSign,
  ArrowRight,
  Star
} from "lucide-react";

const AboutUs = () => {
  const features = [
    {
      icon: <Code className="w-8 h-8 text-primary" />,
      title: "Diverse Hackathons",
      description: "Browse through various hackathons across different domains, difficulty levels, and prize pools with detailed prize distribution breakdown."
    },
    {
      icon: <Users className="w-8 h-8 text-primary" />,
      title: "Team Collaboration",
      description: "Form teams using unique team codes, invite members, and collaborate seamlessly. Team leaders can manage members and project submissions."
    },
    {
      icon: <Trophy className="w-8 h-8 text-primary" />,
      title: "Dynamic Leaderboard",
      description: "Real-time leaderboard with current standings and final rankings. Visual indicators show whether scores are provisional or finalized by admins."
    },
    {
      icon: <MessageCircle className="w-8 h-8 text-primary" />,
      title: "WhatsApp-Style Chat",
      description: "Dedicated real-time chat interface between teams and assigned mentors. Share files, ask questions, and get instant feedback on your project."
    },
    {
      icon: <Calendar className="w-8 h-8 text-primary" />,
      title: "Meeting Scheduler",
      description: "Schedule virtual meetings with mentors through Google Meet or Zoom. Automated link generation and calendar integration for seamless communication."
    },
    {
      icon: <UserPlus className="w-8 h-8 text-primary" />,
      title: "Mentor Assignment",
      description: "Smart mentor-to-team assignment system. One team gets one dedicated mentor, while mentors can guide multiple teams based on their expertise."
    },
    {
      icon: <ClipboardCheck className="w-8 h-8 text-primary" />,
      title: "Project Submission",
      description: "Submit GitHub repos, live demos, presentations, and documentation. Upload project files and provide detailed descriptions for evaluation."
    },
    {
      icon: <Star className="w-8 h-8 text-primary" />,
      title: "Score Management",
      description: "Admins can assign scores to teams with detailed evaluation. Scores can be updated until the leaderboard is finalized, ensuring fair assessment."
    },
    {
      icon: <Lock className="w-8 h-8 text-primary" />,
      title: "Leaderboard Finalization",
      description: "Admins can finalize leaderboards to lock rankings. Once finalized, scores cannot be changed, and teams see final standings with trophy indicators."
    },
    {
      icon: <FileText className="w-8 h-8 text-primary" />,
      title: "File Sharing",
      description: "Share documents, presentations, and resources through the communication system. Support for various file formats to enhance collaboration."
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-primary" />,
      title: "Progress Tracking",
      description: "Teams can track their registration status, submission status, and current leaderboard position. Dashboard shows all hackathon activities at a glance."
    },
    {
      icon: <Award className="w-8 h-8 text-primary" />,
      title: "Prize Distribution",
      description: "Transparent prize pool breakdown showing 1st, 2nd, 3rd place prizes and total pool. Teams know exactly what they're competing for."
    },
    {
      icon: <Shield className="w-8 h-8 text-primary" />,
      title: "Role-Based Access",
      description: "Secure authentication with three user roles: Team Members, Mentors, and Admins. Each role has specific permissions and dashboard access."
    },
    {
      icon: <Rocket className="w-8 h-8 text-primary" />,
      title: "Launch Platform",
      description: "Showcase your projects to potential investors, recruiters, and the tech community. Build your portfolio with hackathon achievements."
    },
    {
      icon: <Link2 className="w-8 h-8 text-primary" />,
      title: "External Links",
      description: "Integrate GitHub repositories, live deployment URLs, presentation links, and demo videos for comprehensive project presentation."
    }
  ];

  const roles = [
    {
      title: "Teams",
      description: "Register for hackathons using team codes, collaborate with teammates via dashboard, communicate with assigned mentors through chat, schedule virtual meetings, submit project files and links, track scores on dynamic leaderboards, and view final rankings with prize information.",
      color: "primary"
    },
    {
      title: "Mentors",
      description: "View all assigned teams across different hackathons, access team submissions and project details, chat with teams in real-time, schedule and manage meetings with Google Meet/Zoom integration, provide feedback and guidance, and help teams improve their projects throughout the competition.",
      color: "accent"
    },
    {
      title: "Admins",
      description: "Create and manage hackathons with full details and prize pools, assign mentors to teams (one mentor per team, multiple teams per mentor), view all team submissions and project files, assign and update scores for evaluation, finalize leaderboards to lock rankings, and manage the entire hackathon lifecycle from creation to winner announcement.",
      color: "success"
    }
  ];

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="pt-24 pb-12 px-4">
        <div className="container mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-primary/20 text-primary border-primary/30">
              About HackPlatform
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 gradient-text">
              Empowering Innovation Through Hackathons
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              HackPlatform is your comprehensive hub for discovering, participating in, and managing hackathons. 
              We connect innovators, mentors, and organizers to create groundbreaking solutions with real-time collaboration tools.
            </p>
          </div>

          {/* Mission Section */}
          <Card className="glass-card p-8 mb-12">
            <div className="flex items-center gap-3 mb-4">
              <Zap className="w-8 h-8 text-primary glow-effect" />
              <h2 className="text-3xl font-bold">Our Mission</h2>
            </div>
            <p className="text-lg text-muted-foreground leading-relaxed">
              We believe in the power of collaborative innovation. Our platform democratizes access to hackathons, 
              making it easier for teams to find the right challenges, compete fairly, and showcase their talents. 
              With features like WhatsApp-style chat, dynamic leaderboards, meeting scheduling, and smart mentor assignment,
              we provide everything you need to turn your ideas into reality. Whether you're a student, professional developer, 
              or industry expert, HackPlatform has the tools and community to support your journey.
            </p>
          </Card>

          {/* What We Provide */}
          <div className="mb-16">
            <div className="text-center mb-10">
              <h2 className="text-4xl font-bold mb-4">Comprehensive Features</h2>
              <p className="text-muted-foreground text-lg">
                Everything you need for a complete hackathon experience
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <Card key={index} className="glass-card glass-card-hover p-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="mb-4 p-3 rounded-lg bg-primary/10">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Roles & Access */}
          <div className="mb-16">
            <div className="text-center mb-10">
              <h2 className="text-4xl font-bold mb-4">Who We Serve</h2>
              <p className="text-muted-foreground text-lg">
                Tailored experiences for every participant
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              {roles.map((role, index) => (
                <Card key={index} className="glass-card p-6">
                  <div className="flex items-start gap-3 mb-4">
                    <CheckCircle className={`w-6 h-6 text-${role.color} flex-shrink-0 mt-1`} />
                    <div>
                      <h3 className="text-2xl font-bold mb-3">{role.title}</h3>
                      <p className="text-muted-foreground leading-relaxed">{role.description}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Key Features Highlight */}
          <Card className="glass-card p-8 mb-12 bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">Platform Highlights</h2>
              <p className="text-muted-foreground">Advanced features that set us apart</p>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-background/50 rounded-lg p-6 border border-primary/20">
                <MessageCircle className="w-10 h-10 text-primary mb-3" />
                <h3 className="font-bold text-xl mb-2">Real-Time Communication</h3>
                <p className="text-muted-foreground">WhatsApp-style chat interface for instant team-mentor communication with file sharing and message history.</p>
              </div>
              <div className="bg-background/50 rounded-lg p-6 border border-primary/20">
                <Calendar className="w-10 h-10 text-primary mb-3" />
                <h3 className="font-bold text-xl mb-2">Smart Scheduling</h3>
                <p className="text-muted-foreground">Integrated meeting scheduler with Google Meet and Zoom support for seamless virtual collaboration.</p>
              </div>
              <div className="bg-background/50 rounded-lg p-6 border border-primary/20">
                <TrendingUp className="w-10 h-10 text-primary mb-3" />
                <h3 className="font-bold text-xl mb-2">Dynamic Leaderboards</h3>
                <p className="text-muted-foreground">Live rankings with visual indicators showing current vs finalized standings, ensuring transparency.</p>
              </div>
              <div className="bg-background/50 rounded-lg p-6 border border-primary/20">
                <Lock className="w-10 h-10 text-primary mb-3" />
                <h3 className="font-bold text-xl mb-2">Score Finalization</h3>
                <p className="text-muted-foreground">Admins can lock leaderboards to prevent changes, with disabled buttons and trophy icons for final rankings.</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default AboutUs;
