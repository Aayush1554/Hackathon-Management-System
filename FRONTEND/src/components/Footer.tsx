import { Link } from "react-router-dom";
import { Github, Twitter, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-border mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4 gradient-text">HackPlatform</h3>
            <p className="text-sm text-muted-foreground">
              Empowering innovation through competitive hackathons.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/hackathons" className="text-sm text-muted-foreground hover:text-primary transition-colors">Browse Hackathons</Link></li>
              <li><Link to="/leaderboard" className="text-sm text-muted-foreground hover:text-primary transition-colors">Leaderboard</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">For Participants</h4>
            <ul className="space-y-2">
              <li><Link to="/register/team" className="text-sm text-muted-foreground hover:text-primary transition-colors">Register Team</Link></li>
              <li><Link to="/login/team" className="text-sm text-muted-foreground hover:text-primary transition-colors">Team Login</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Connect</h4>
            <div className="flex gap-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2025 HackPlatform. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
