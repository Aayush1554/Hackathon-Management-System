import { Link } from "react-router-dom";
import { Github, Twitter, Linkedin, Mail, Code, Users, Trophy, MessageCircle } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-border mt-20 bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About Section */}
          <div>
            <h3 className="font-bold text-lg mb-4 gradient-text">HackPlatform</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Hackathon Management Platform
            </p>
            <div className="flex gap-3">
              <a href="https://github.com/abhim-5" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="https://www.linkedin.com/in/abhimanyu-kumar5/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="mailto:kumarabhi9589@gmail.com" className="text-muted-foreground hover:text-primary transition-colors">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>
          
          {/* Features Section */}
          <div>
            <h4 className="font-semibold mb-4">Key Features</h4>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-primary" />
                <span className="text-sm text-muted-foreground">WhatsApp-Style Chat</span>
              </li>
              <li className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-primary" />
                <span className="text-sm text-muted-foreground">Dynamic Leaderboards</span>
              </li>
              <li className="flex items-center gap-2">
                <Users className="w-4 h-4 text-primary" />
                <span className="text-sm text-muted-foreground">Mentor Assignment</span>
              </li>
              <li className="flex items-center gap-2">
                <Code className="w-4 h-4 text-primary" />
                <span className="text-sm text-muted-foreground">Project Submissions</span>
              </li>
            </ul>
          </div>
          
          {/* Quick Links Section */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/hackathons" onClick={() => window.scrollTo(0, 0)} className="text-sm text-muted-foreground hover:text-primary transition-colors">Browse Hackathons</Link></li>
              <li><Link to="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">About Us</Link></li>
            </ul>
          </div>
          
          {/* Access Portal Section */}
          <div>
            <h4 className="font-semibold mb-4">Access Portal</h4>
            <ul className="space-y-2">
              <li><Link to="/login/team" className="text-sm text-muted-foreground hover:text-primary transition-colors">Team Login</Link></li>
              <li><Link to="/login/mentor" className="text-sm text-muted-foreground hover:text-primary transition-colors">Mentor Login</Link></li>
              <li><Link to="/login/admin" className="text-sm text-muted-foreground hover:text-primary transition-colors">Admin Login</Link></li>
            </ul>
          </div>
        </div>
        
        {/* Bottom Section */}
        <div className="border-t border-border mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              &copy; 2025 HackPlatform. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <Link to="#" className="hover:text-primary transition-colors">Privacy Policy</Link>
              <Link to="#" className="hover:text-primary transition-colors">Terms of Service</Link>
              <Link to="#" className="hover:text-primary transition-colors">Contact Us</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
