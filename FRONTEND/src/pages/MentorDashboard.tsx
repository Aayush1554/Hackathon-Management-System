import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import { Users, Calendar, MessageSquare, Award } from "lucide-react";

const MentorDashboard = () => {
  const teams = [
    { id: 1, name: "Code Warriors", hackathon: "AI Innovation Challenge", status: "Active", lastContact: "2 days ago" },
    { id: 2, name: "Tech Titans", hackathon: "Web3 Builder Summit", status: "Active", lastContact: "1 day ago" },
    { id: 3, name: "Innovation Squad", hackathon: "Green Tech Solutions", status: "Active", lastContact: "5 hours ago" }
  ];

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="pt-24 pb-12 px-4">
        <div className="container mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Mentor Dashboard</h1>
            <p className="text-muted-foreground">Guide your teams to success</p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <Card className="glass-card p-6">
              <Users className="w-8 h-8 text-primary mb-4" />
              <div className="text-2xl font-bold mb-2">{teams.length}</div>
              <div className="text-sm text-muted-foreground">Teams Under Mentorship</div>
            </Card>
            
            <Card className="glass-card p-6">
              <Calendar className="w-8 h-8 text-accent mb-4" />
              <div className="text-2xl font-bold mb-2">5</div>
              <div className="text-sm text-muted-foreground">Scheduled Meetings</div>
            </Card>
            
            <Card className="glass-card p-6">
              <MessageSquare className="w-8 h-8 text-success mb-4" />
              <div className="text-2xl font-bold mb-2">12</div>
              <div className="text-sm text-muted-foreground">Feedbacks Given</div>
            </Card>
            
            <Card className="glass-card p-6">
              <Award className="w-8 h-8 text-primary mb-4" />
              <div className="text-2xl font-bold mb-2">8</div>
              <div className="text-sm text-muted-foreground">Projects Reviewed</div>
            </Card>
          </div>
          
          <Card className="glass-card p-6 mb-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">My Teams</h2>
              <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
                <Calendar className="mr-2 w-4 h-4" />
                Schedule Meeting
              </Button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4">Team Name</th>
                    <th className="text-left py-3 px-4">Hackathon</th>
                    <th className="text-left py-3 px-4">Status</th>
                    <th className="text-left py-3 px-4">Last Contact</th>
                    <th className="text-left py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {teams.map((team) => (
                    <tr key={team.id} className="border-b border-border/50">
                      <td className="py-4 px-4 font-semibold">{team.name}</td>
                      <td className="py-4 px-4 text-muted-foreground">{team.hackathon}</td>
                      <td className="py-4 px-4">
                        <Badge variant="secondary" className="bg-success/20 text-success border-success/30">
                          {team.status}
                        </Badge>
                      </td>
                      <td className="py-4 px-4 text-muted-foreground">{team.lastContact}</td>
                      <td className="py-4 px-4">
                        <Button size="sm" variant="outline" className="glass-card">
                          View Details
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
          
          <Card className="glass-card p-6">
            <h2 className="text-2xl font-bold mb-4">Give Feedback</h2>
            <p className="text-muted-foreground mb-6">
              Provide valuable insights to help teams improve their projects
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              {teams.slice(0, 2).map((team) => (
                <div key={team.id} className="glass-card p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">{team.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{team.hackathon}</p>
                  <Button size="sm" className="w-full bg-secondary hover:bg-secondary/80">
                    Write Feedback
                  </Button>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MentorDashboard;
