import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Search, Users, Calendar, Filter } from "lucide-react";

const Hackathons = () => {
  const [searchQuery, setSearchQuery] = useState("");
  
  const hackathons = [
    {
      id: 1,
      title: "AI Innovation Challenge",
      category: "Artificial Intelligence",
      prize: "$50,000",
      teams: 142,
      deadline: "15 days left",
      status: "Open",
      description: "Build the next generation of AI-powered solutions"
    },
    {
      id: 2,
      title: "Web3 Builder Summit",
      category: "Blockchain",
      prize: "$30,000",
      teams: 98,
      deadline: "22 days left",
      status: "Open",
      description: "Create decentralized applications that matter"
    },
    {
      id: 3,
      title: "Green Tech Solutions",
      category: "Sustainability",
      prize: "$25,000",
      teams: 76,
      deadline: "30 days left",
      status: "Open",
      description: "Innovate for a sustainable future"
    },
    {
      id: 4,
      title: "HealthTech Innovators",
      category: "Healthcare",
      prize: "$40,000",
      teams: 124,
      deadline: "20 days left",
      status: "Open",
      description: "Transform healthcare through technology"
    },
    {
      id: 5,
      title: "EdTech Revolution",
      category: "Education",
      prize: "$35,000",
      teams: 89,
      deadline: "25 days left",
      status: "Open",
      description: "Reshape the future of learning"
    },
    {
      id: 6,
      title: "FinTech Challenge",
      category: "Finance",
      prize: "$45,000",
      teams: 156,
      deadline: "18 days left",
      status: "Open",
      description: "Build the financial tools of tomorrow"
    }
  ];

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="pt-24 pb-12 px-4">
        <div className="container mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">All Hackathons</h1>
          <p className="text-muted-foreground mb-8">
            Explore and join exciting competitions
          </p>
          
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                placeholder="Search hackathons..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-secondary border-border"
              />
            </div>
            <Button variant="outline" className="glass-card">
              <Filter className="mr-2 w-4 h-4" />
              Filters
            </Button>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hackathons.map((hackathon) => (
              <Card key={hackathon.id} className="glass-card glass-card-hover p-6">
                <div className="flex items-start justify-between mb-4">
                  <Badge variant="secondary" className="bg-primary/20 text-primary border-primary/30">
                    {hackathon.status}
                  </Badge>
                  <span className="text-2xl font-bold text-primary">{hackathon.prize}</span>
                </div>
                
                <h3 className="text-xl font-bold mb-2">{hackathon.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">{hackathon.description}</p>
                
                <Badge variant="outline" className="mb-4">
                  {hackathon.category}
                </Badge>
                
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
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Hackathons;
