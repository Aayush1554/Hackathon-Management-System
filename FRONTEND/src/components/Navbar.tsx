import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Zap, LogOut, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const Navbar = () => {
  const { user, logout, isAdmin, isMentor, isTeamMember } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/");
  };

  const handleProfileClick = () => {
    if (isAdmin) {
      navigate("/admin/dashboard");
    } else if (isMentor) {
      navigate("/mentor/dashboard");
    } else if (isTeamMember) {
      navigate("/team/dashboard");
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-card border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-colors">
            <Zap className="w-5 h-5 text-primary" />
          </div>
          <span className="text-xl font-bold gradient-text">HackPlatform</span>
        </Link>
        
        <div className="hidden md:flex items-center gap-6">
          <Link to="/hackathons" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Hackathons
          </Link>
          <Link to="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            About Us
          </Link>
        </div>
        
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <button
                onClick={handleProfileClick}
                className="hidden md:flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                title="Go to Dashboard"
              >
                <User className="w-4 h-4" />
                <span>{user.full_name}</span>
              </button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleLogout}
                className="gap-2"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/login/team">Login</Link>
              </Button>
              <Button size="sm" className="bg-primary hover:bg-primary-glow text-primary-foreground" asChild>
                <Link to="/login/team">Get Started</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
