import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Users } from "lucide-react";
import { toast } from "sonner";

const TeamRegistration = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    teamName: "",
    leadMember: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }
    
    setIsLoading(true);
    
    setTimeout(() => {
      toast.success("Team registered successfully!");
      navigate("/team/dashboard");
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 py-12">
      <div className="w-full max-w-md">
        <Button variant="ghost" className="mb-8" asChild>
          <Link to="/">
            <ArrowLeft className="mr-2 w-4 h-4" />
            Back to Home
          </Link>
        </Button>
        
        <Card className="glass-card p-8">
          <div className="flex items-center justify-center mb-6">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
              <Users className="w-6 h-6 text-primary" />
            </div>
          </div>
          
          <h1 className="text-2xl font-bold text-center mb-2">Register Your Team</h1>
          <p className="text-center text-muted-foreground mb-8">
            Start your hackathon journey
          </p>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="teamName">Team Name</Label>
              <Input
                id="teamName"
                placeholder="Code Warriors"
                value={formData.teamName}
                onChange={(e) => setFormData({...formData, teamName: e.target.value})}
                required
                className="bg-secondary border-border"
              />
            </div>
            
            <div>
              <Label htmlFor="leadMember">Team Lead Name</Label>
              <Input
                id="leadMember"
                placeholder="John Doe"
                value={formData.leadMember}
                onChange={(e) => setFormData({...formData, leadMember: e.target.value})}
                required
                className="bg-secondary border-border"
              />
            </div>
            
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="team@example.com"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
                className="bg-secondary border-border"
              />
            </div>
            
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required
                className="bg-secondary border-border"
              />
            </div>
            
            <div>
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                required
                className="bg-secondary border-border"
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-primary hover:bg-primary-glow text-primary-foreground"
              disabled={isLoading}
            >
              {isLoading ? "Registering..." : "Register Team"}
            </Button>
          </form>
          
          <div className="mt-6 text-center text-sm">
            <span className="text-muted-foreground">Already have an account? </span>
            <Link to="/login/team" className="text-primary hover:underline">
              Login here
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default TeamRegistration;
