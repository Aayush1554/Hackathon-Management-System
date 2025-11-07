import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import { Plus, Users, Trophy, TrendingUp, Calendar } from "lucide-react";

const AdminDashboard = () => {
  const stats = [
    { label: "Total Hackathons", value: "12", icon: Calendar, color: "text-primary" },
    { label: "Active Teams", value: "456", icon: Users, color: "text-accent" },
    { label: "Total Mentors", value: "34", icon: Trophy, color: "text-success" },
    { label: "Submissions", value: "289", icon: TrendingUp, color: "text-primary" }
  ];

  const hackathons = [
    { id: 1, name: "AI Innovation Challenge", status: "Active", teams: 142, deadline: "15 days" },
    { id: 2, name: "Web3 Builder Summit", status: "Active", teams: 98, deadline: "22 days" },
    { id: 3, name: "Green Tech Solutions", status: "Active", teams: 76, deadline: "30 days" }
  ];

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="pt-24 pb-12 px-4">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
              <p className="text-muted-foreground">Manage and oversee all hackathons</p>
            </div>
            <Button className="bg-success hover:bg-success/90 text-success-foreground">
              <Plus className="mr-2 w-4 h-4" />
              Add New Hackathon
            </Button>
          </div>
          
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <Card key={index} className="glass-card p-6">
                <stat.icon className={`w-8 h-8 ${stat.color} mb-4`} />
                <div className="text-2xl font-bold mb-2">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </Card>
            ))}
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="glass-card p-6">
              <h2 className="text-2xl font-bold mb-6">Hackathon Management</h2>
              <div className="space-y-4">
                {hackathons.map((hackathon) => (
                  <div key={hackathon.id} className="glass-card p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold">{hackathon.name}</h3>
                      <Badge variant="secondary" className="bg-success/20 text-success border-success/30">
                        {hackathon.status}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
                      <span>{hackathon.teams} teams registered</span>
                      <span>{hackathon.deadline} left</span>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="glass-card flex-1">
                        Edit
                      </Button>
                      <Button size="sm" variant="outline" className="glass-card flex-1">
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
            
            <div className="space-y-6">
              <Card className="glass-card p-6">
                <h2 className="text-2xl font-bold mb-4">Mentor Assignment</h2>
                <p className="text-muted-foreground mb-4">
                  Assign mentors to teams for better guidance
                </p>
                <div className="space-y-3">
                  <div className="flex items-center justify-between glass-card p-3 rounded-lg">
                    <span className="text-sm">Pending Assignments</span>
                    <Badge className="bg-primary/20 text-primary">8</Badge>
                  </div>
                  <Button className="w-full bg-secondary hover:bg-secondary/80">
                    Manage Assignments
                  </Button>
                </div>
              </Card>
              
              <Card className="glass-card p-6">
                <h2 className="text-2xl font-bold mb-4">Score Entry</h2>
                <p className="text-muted-foreground mb-4">
                  Enter scores for completed hackathon submissions
                </p>
                <div className="space-y-3">
                  <div className="flex items-center justify-between glass-card p-3 rounded-lg">
                    <span className="text-sm">Pending Reviews</span>
                    <Badge className="bg-accent/20 text-accent">12</Badge>
                  </div>
                  <Button className="w-full bg-secondary hover:bg-secondary/80">
                    Enter Scores
                  </Button>
                </div>
              </Card>
              
              <Card className="glass-card p-6">
                <h2 className="text-2xl font-bold mb-4">Analytics</h2>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Participation Rate</span>
                    <span className="font-bold text-success">94%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Completion Rate</span>
                    <span className="font-bold text-primary">78%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Avg Team Size</span>
                    <span className="font-bold text-accent">3.8</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
