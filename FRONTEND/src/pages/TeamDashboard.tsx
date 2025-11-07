import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import { Upload, Users, Calendar, Award } from "lucide-react";

const TeamDashboard = () => {
  const team = {
    name: "Code Warriors",
    members: ["John Doe (Lead)", "Jane Smith", "Bob Johnson"],
    hackathons: [
      {
        id: 1,
        title: "AI Innovation Challenge",
        status: "Active",
        deadline: "15 days left",
        progress: 65
      }
    ]
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="pt-24 pb-12 px-4">
        <div className="container mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Team Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, {team.name}!</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card className="glass-card p-6">
              <Calendar className="w-8 h-8 text-primary mb-4" />
              <div className="text-2xl font-bold mb-2">1</div>
              <div className="text-sm text-muted-foreground">Active Hackathons</div>
            </Card>
            
            <Card className="glass-card p-6">
              <Users className="w-8 h-8 text-accent mb-4" />
              <div className="text-2xl font-bold mb-2">{team.members.length}</div>
              <div className="text-sm text-muted-foreground">Team Members</div>
            </Card>
            
            <Card className="glass-card p-6">
              <Award className="w-8 h-8 text-success mb-4" />
              <div className="text-2xl font-bold mb-2">0</div>
              <div className="text-sm text-muted-foreground">Submissions</div>
            </Card>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* Active Hackathons */}
            <Card className="glass-card p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">My Hackathons</h2>
                <Button size="sm" className="bg-primary hover:bg-primary-glow text-primary-foreground" asChild>
                  <Link to="/hackathons">Register New</Link>
                </Button>
              </div>
              
              <div className="space-y-4">
                {team.hackathons.map((hackathon) => (
                  <div key={hackathon.id} className="glass-card p-4 rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold">{hackathon.title}</h3>
                      <Badge variant="secondary" className="bg-success/20 text-success border-success/30">
                        {hackathon.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{hackathon.deadline}</p>
                    <div className="w-full bg-secondary rounded-full h-2 mb-2">
                      <div 
                        className="bg-primary h-2 rounded-full" 
                        style={{ width: `${hackathon.progress}%` }}
                      />
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-muted-foreground">Progress: {hackathon.progress}%</span>
                      <Button size="sm" variant="outline" className="glass-card" asChild>
                        <Link to={`/hackathon/${hackathon.id}`}>View Details</Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
            
            {/* Team Members & Submission */}
            <div className="space-y-6">
              <Card className="glass-card p-6">
                <h2 className="text-2xl font-bold mb-4">Team Members</h2>
                <ul className="space-y-3">
                  {team.members.map((member, index) => (
                    <li key={index} className="flex items-center gap-3 glass-card p-3 rounded-lg">
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                        <Users className="w-4 h-4 text-primary" />
                      </div>
                      <span>{member}</span>
                    </li>
                  ))}
                </ul>
              </Card>
              
              <Card className="glass-card p-6">
                <h2 className="text-2xl font-bold mb-4">Upload Submission</h2>
                <p className="text-muted-foreground mb-4">
                  Submit your project for the AI Innovation Challenge
                </p>
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center glass-card">
                  <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-sm text-muted-foreground mb-4">
                    Drag and drop your files here or click to browse
                  </p>
                  <Button className="bg-primary hover:bg-primary-glow text-primary-foreground">
                    Choose Files
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamDashboard;
