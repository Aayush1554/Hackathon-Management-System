import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowLeft, Calendar, Users, Trophy, Clock, CheckCircle } from "lucide-react";

const HackathonDetails = () => {
  const { id } = useParams();
  
  const hackathon = {
    title: "AI Innovation Challenge",
    category: "Artificial Intelligence",
    prize: "$50,000",
    teams: 142,
    deadline: "March 15, 2025",
    status: "Open",
    description: "Join us in building the next generation of AI-powered solutions. This hackathon focuses on practical applications of artificial intelligence to solve real-world problems.",
    rules: [
      "Teams must consist of 2-5 members",
      "All code must be original work created during the hackathon",
      "Projects must be submitted by the deadline",
      "Use of open-source libraries is encouraged"
    ],
    prizes: [
      { place: "1st Place", amount: "$25,000" },
      { place: "2nd Place", amount: "$15,000" },
      { place: "3rd Place", amount: "$10,000" }
    ],
    timeline: [
      { phase: "Registration", date: "Feb 1 - Feb 28" },
      { phase: "Team Formation", date: "Mar 1 - Mar 5" },
      { phase: "Development Phase", date: "Mar 6 - Mar 14" },
      { phase: "Submission Deadline", date: "Mar 15" },
      { phase: "Judging", date: "Mar 16 - Mar 18" },
      { phase: "Winners Announced", date: "Mar 20" }
    ],
    criteria: [
      "Innovation and creativity",
      "Technical implementation",
      "User experience and design",
      "Practical applicability",
      "Presentation and documentation"
    ]
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="pt-24 pb-12 px-4">
        <div className="container mx-auto">
          <Button variant="ghost" className="mb-6" asChild>
            <Link to="/hackathons">
              <ArrowLeft className="mr-2 w-4 h-4" />
              Back to Hackathons
            </Link>
          </Button>
          
          {/* Hero Section */}
          <Card className="glass-card p-8 mb-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <div>
                <Badge variant="secondary" className="bg-primary/20 text-primary border-primary/30 mb-4">
                  {hackathon.status}
                </Badge>
                <h1 className="text-4xl font-bold mb-2">{hackathon.title}</h1>
                <p className="text-muted-foreground">{hackathon.description}</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">{hackathon.prize}</div>
                <div className="text-sm text-muted-foreground">Total Prize Pool</div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-muted-foreground" />
                <div>
                  <div className="font-semibold">{hackathon.teams}</div>
                  <div className="text-sm text-muted-foreground">Teams</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-muted-foreground" />
                <div>
                  <div className="font-semibold">{hackathon.deadline}</div>
                  <div className="text-sm text-muted-foreground">Deadline</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-muted-foreground" />
                <div>
                  <div className="font-semibold">15 days</div>
                  <div className="text-sm text-muted-foreground">Remaining</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-muted-foreground" />
                <div>
                  <div className="font-semibold">{hackathon.category}</div>
                  <div className="text-sm text-muted-foreground">Category</div>
                </div>
              </div>
            </div>
            
            <Button size="lg" className="w-full md:w-auto bg-primary hover:bg-primary-glow text-primary-foreground glow-effect" asChild>
              <Link to="/register/team">Register Your Team</Link>
            </Button>
          </Card>
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* Rules & Criteria */}
            <Card className="glass-card p-6">
              <h2 className="text-2xl font-bold mb-4">Rules & Guidelines</h2>
              <ul className="space-y-3">
                {hackathon.rules.map((rule, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">{rule}</span>
                  </li>
                ))}
              </ul>
              
              <h3 className="text-xl font-bold mt-6 mb-4">Judging Criteria</h3>
              <ul className="space-y-3">
                {hackathon.criteria.map((criterion, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">{criterion}</span>
                  </li>
                ))}
              </ul>
            </Card>
            
            {/* Prize Distribution */}
            <div className="space-y-6">
              <Card className="glass-card p-6">
                <h2 className="text-2xl font-bold mb-4">Prize Distribution</h2>
                <div className="space-y-4">
                  {hackathon.prizes.map((prize, index) => (
                    <div key={index} className="flex items-center justify-between p-4 glass-card rounded-lg">
                      <span className="font-semibold">{prize.place}</span>
                      <span className="text-2xl font-bold text-primary">{prize.amount}</span>
                    </div>
                  ))}
                </div>
              </Card>
              
              {/* Timeline */}
              <Card className="glass-card p-6">
                <h2 className="text-2xl font-bold mb-4">Timeline</h2>
                <div className="space-y-4">
                  {hackathon.timeline.map((item, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                      <div>
                        <div className="font-semibold">{item.phase}</div>
                        <div className="text-sm text-muted-foreground">{item.date}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default HackathonDetails;
