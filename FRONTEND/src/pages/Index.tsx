import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Boxes } from "@/components/ui/background-boxes";
import { ArrowRight, Users, Award, Zap, Calendar, Trophy } from "lucide-react";

const Index = () => {
  const featuredHackathons = [
    {
      id: 1,
      title: "AI Innovation Challenge",
      category: "Artificial Intelligence",
      prize: "$50,000",
      teams: 142,
      deadline: "15 days left",
      status: "Open"
    },
    {
      id: 2,
      title: "Web3 Builder Summit",
      category: "Blockchain",
      prize: "$30,000",
      teams: 98,
      deadline: "22 days left",
      status: "Open"
    },
    {
      id: 3,
      title: "Green Tech Solutions",
      category: "Sustainability",
      prize: "$25,000",
      teams: 76,
      deadline: "30 days left",
      status: "Open"
    }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 w-full h-full z-0">
        <Boxes />
        <div className="absolute inset-0 w-full h-full bg-background z-10 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] pointer-events-none" />
      </div>
      
      {/* Content */}
      <div className="relative z-20">
        <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-6">
            <Zap className="w-4 h-4 text-primary" />
            <span className="text-sm text-muted-foreground">Welcome to the future of hackathons</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Build, Compete & Win
            <br />
            <span className="gradient-text">Amazing Prizes</span>
          </h1>
          
          <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
            Join the most innovative hackathon platform. Connect with mentors, 
            collaborate with teams, and showcase your projects to the world.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" className="bg-primary hover:bg-primary-glow text-primary-foreground glow-effect" asChild>
              <Link to="/register/team">
                Register Your Team <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="glass-card" asChild>
              <Link to="/hackathons">Browse Hackathons</Link>
            </Button>
          </div>
          
          {/* Role Selection Cards */}
          <div className="grid md:grid-cols-3 gap-6 mt-20 max-w-4xl mx-auto">
            <Link to="/login/team">
              <Card className="glass-card glass-card-hover p-6 cursor-pointer">
                <Users className="w-8 h-8 text-primary mb-4" />
                <h3 className="font-semibold text-lg mb-2">For Teams</h3>
                <p className="text-sm text-muted-foreground">Register and compete in hackathons</p>
              </Card>
            </Link>
            
            <Link to="/login/mentor">
              <Card className="glass-card glass-card-hover p-6 cursor-pointer">
                <Award className="w-8 h-8 text-accent mb-4" />
                <h3 className="font-semibold text-lg mb-2">For Mentors</h3>
                <p className="text-sm text-muted-foreground">Guide and support participating teams</p>
              </Card>
            </Link>
            
            <Link to="/login/admin">
              <Card className="glass-card glass-card-hover p-6 cursor-pointer">
                <Trophy className="w-8 h-8 text-success mb-4" />
                <h3 className="font-semibold text-lg mb-2">For Admins</h3>
                <p className="text-sm text-muted-foreground">Manage hackathons and teams</p>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Hackathons */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Hackathons</h2>
            <p className="text-muted-foreground">Join the most exciting competitions happening now</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {featuredHackathons.map((hackathon) => (
              <Card key={hackathon.id} className="glass-card glass-card-hover p-6">
                <div className="flex items-start justify-between mb-4">
                  <Badge variant="secondary" className="bg-primary/20 text-primary border-primary/30">
                    {hackathon.status}
                  </Badge>
                  <span className="text-2xl font-bold text-primary">{hackathon.prize}</span>
                </div>
                
                <h3 className="text-xl font-bold mb-2">{hackathon.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">{hackathon.category}</p>
                
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{hackathon.teams} teams</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{hackathon.deadline}</span>
                  </div>
                </div>
                
                <Button className="w-full bg-secondary hover:bg-secondary/80" asChild>
                  <Link to={`/hackathon/${hackathon.id}`}>View Details</Link>
                </Button>
              </Card>
            ))}
          </div>
          
          <div className="text-center">
            <Button variant="outline" className="glass-card" asChild>
              <Link to="/hackathons">
                View All Hackathons <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

        <Footer />
      </div>
    </div>
  );
};

export default Index;
