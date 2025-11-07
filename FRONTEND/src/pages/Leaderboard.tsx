import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Trophy, Medal, Award, Filter } from "lucide-react";

const Leaderboard = () => {
  const [selectedHackathon, setSelectedHackathon] = useState("all");
  
  const teams = [
    { rank: 1, name: "Code Warriors", hackathon: "AI Innovation Challenge", score: 98, leader: "John Doe" },
    { rank: 2, name: "Tech Titans", hackathon: "AI Innovation Challenge", score: 95, leader: "Jane Smith" },
    { rank: 3, name: "Innovation Squad", hackathon: "AI Innovation Challenge", score: 92, leader: "Bob Johnson" },
    { rank: 4, name: "Digital Pioneers", hackathon: "Web3 Builder Summit", score: 90, leader: "Alice Williams" },
    { rank: 5, name: "Future Builders", hackathon: "Web3 Builder Summit", score: 88, leader: "Charlie Brown" },
    { rank: 6, name: "Code Ninjas", hackathon: "Green Tech Solutions", score: 86, leader: "Diana Prince" },
    { rank: 7, name: "Tech Wizards", hackathon: "Green Tech Solutions", score: 84, leader: "Ethan Hunt" },
    { rank: 8, name: "Byte Force", hackathon: "AI Innovation Challenge", score: 82, leader: "Fiona Green" }
  ];

  const getRankIcon = (rank: number) => {
    switch(rank) {
      case 1:
        return <Trophy className="w-6 h-6 text-primary" />;
      case 2:
        return <Medal className="w-6 h-6 text-accent" />;
      case 3:
        return <Award className="w-6 h-6 text-success" />;
      default:
        return <span className="w-6 h-6 flex items-center justify-center text-muted-foreground font-bold">{rank}</span>;
    }
  };

  const getRankClass = (rank: number) => {
    switch(rank) {
      case 1:
        return "glass-card border-primary/30 bg-primary/5";
      case 2:
        return "glass-card border-accent/30 bg-accent/5";
      case 3:
        return "glass-card border-success/30 bg-success/5";
      default:
        return "glass-card";
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="pt-24 pb-12 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Leaderboard</h1>
            <p className="text-muted-foreground">Top performing teams across all hackathons</p>
          </div>
          
          <div className="flex justify-center mb-8">
            <Button variant="outline" className="glass-card">
              <Filter className="mr-2 w-4 h-4" />
              Filter by Hackathon
            </Button>
          </div>
          
          {/* Top 3 Podium */}
          <div className="grid md:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto">
            {/* 2nd Place */}
            <Card className={`${getRankClass(2)} p-6 md:mt-8`}>
              <div className="flex justify-center mb-4">
                <Medal className="w-12 h-12 text-accent" />
              </div>
              <div className="text-center">
                <Badge variant="secondary" className="bg-accent/20 text-accent border-accent/30 mb-3">
                  2nd Place
                </Badge>
                <h3 className="font-bold text-xl mb-1">{teams[1].name}</h3>
                <p className="text-sm text-muted-foreground mb-2">{teams[1].leader}</p>
                <p className="text-3xl font-bold text-accent">{teams[1].score}</p>
              </div>
            </Card>
            
            {/* 1st Place */}
            <Card className={`${getRankClass(1)} p-6`}>
              <div className="flex justify-center mb-4">
                <Trophy className="w-16 h-16 text-primary glow-effect" />
              </div>
              <div className="text-center">
                <Badge className="bg-primary/20 text-primary border-primary/30 mb-3">
                  Champion
                </Badge>
                <h3 className="font-bold text-2xl mb-1">{teams[0].name}</h3>
                <p className="text-sm text-muted-foreground mb-2">{teams[0].leader}</p>
                <p className="text-4xl font-bold text-primary">{teams[0].score}</p>
              </div>
            </Card>
            
            {/* 3rd Place */}
            <Card className={`${getRankClass(3)} p-6 md:mt-8`}>
              <div className="flex justify-center mb-4">
                <Award className="w-12 h-12 text-success" />
              </div>
              <div className="text-center">
                <Badge variant="secondary" className="bg-success/20 text-success border-success/30 mb-3">
                  3rd Place
                </Badge>
                <h3 className="font-bold text-xl mb-1">{teams[2].name}</h3>
                <p className="text-sm text-muted-foreground mb-2">{teams[2].leader}</p>
                <p className="text-3xl font-bold text-success">{teams[2].score}</p>
              </div>
            </Card>
          </div>
          
          {/* Full Leaderboard */}
          <Card className="glass-card p-6">
            <h2 className="text-2xl font-bold mb-6">Complete Rankings</h2>
            <div className="space-y-3">
              {teams.map((team) => (
                <div key={team.rank} className={`${getRankClass(team.rank)} p-4 rounded-lg flex items-center justify-between`}>
                  <div className="flex items-center gap-4">
                    <div className="w-12 flex justify-center">
                      {getRankIcon(team.rank)}
                    </div>
                    <div>
                      <h3 className="font-bold">{team.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {team.leader} • {team.hackathon}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary">{team.score}</div>
                    <div className="text-xs text-muted-foreground">points</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Leaderboard;
