import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Boxes } from "@/components/ui/background-boxes";
import { ArrowRight, Users, Award, Zap, Calendar, Trophy, BookOpen, Lightbulb, Code, Target, Shield, MessageCircle } from "lucide-react";
import { hackathonAPI } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

interface Hackathon {
  hackathon_id: number;
  title: string;
  category: string;
  description: string;
  prize_pool?: number | string;
  status: string;
  registration_start_date: string;
  registration_end_date: string;
  submission_deadline: string;
  is_online: boolean;
}

const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [featuredHackathons, setFeaturedHackathons] = useState<Hackathon[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHackathons();
  }, []);

  const fetchHackathons = async () => {
    try {
      setLoading(true);
      const response = await hackathonAPI.getAll();
      const hackathonsData = response.data.data || response.data || [];
      
      // Sort by registration_start_date (newest first - most recent leftmost)
      const sortedByDate = [...hackathonsData].sort((a: Hackathon, b: Hackathon) => {
        const dateA = new Date(a.registration_start_date).getTime();
        const dateB = new Date(b.registration_start_date).getTime();
        return dateB - dateA; // Descending order (newest first)
      });
      
      // Separate active (open/ongoing) and inactive hackathons, keeping date sort
      const openOngoing = sortedByDate.filter((h: Hackathon) => h.status === 'open' || h.status === 'ongoing');
      const others = sortedByDate.filter((h: Hackathon) => h.status !== 'open' && h.status !== 'ongoing');
      
      // Show active hackathons first (sorted by date), then others, take first 3
      const featured = [...openOngoing, ...others].slice(0, 3);
      setFeaturedHackathons(featured);
    } catch (error) {
      console.error('Failed to fetch hackathons:', error);
      setFeaturedHackathons([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterClick = () => {
    // If user is not logged in, redirect to team login page
    if (!isAuthenticated) {
      navigate('/login/team');
      return;
    }
    // If user is logged in, go to registration page (they can choose hackathon there)
    navigate('/hackathons');
  };

  const calculateDaysLeft = (deadline: string) => {
    const now = new Date();
    const end = new Date(deadline);
    const diffTime = end.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return "Ended";
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "1 day left";
    return `${diffDays} days left`;
  };

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
            <Button 
              size="lg" 
              className="bg-primary hover:bg-primary-glow text-primary-foreground glow-effect"
              onClick={handleRegisterClick}
            >
              Register Your Team <ArrowRight className="ml-2 w-4 h-4" />
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
          
          {loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading hackathons...</p>
            </div>
          ) : featuredHackathons.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No active hackathons at the moment. Check back soon!</p>
            </div>
          ) : (
            <>
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                {featuredHackathons.map((hackathon) => (
                  <Card key={hackathon.hackathon_id} className="glass-card glass-card-hover p-6">
                    <div className="flex items-start justify-between mb-4">
                      {(() => {
                        // Compute registration-open based on registration_start_date/registration_end_date
                        const now = new Date();
                        const start = (hackathon as any).registration_start_date ? new Date((hackathon as any).registration_start_date) : null;
                        const end = (hackathon as any).registration_end_date ? new Date((hackathon as any).registration_end_date) : null;
                        const isRegistrationOpen = start && end ? (now >= start && now <= end) : false;

                        // Determine a friendly label:
                        // - If registration window is active => 'Open for registration'
                        // - If registration window ended but submissions still open => 'Registration closed'
                        // - If submission deadline passed => 'Ended'
                        // - Otherwise fall back to the raw status
                        let statusLabel = hackathon.status;
                        if (isRegistrationOpen) {
                          statusLabel = 'Open for registration';
                        } else if (end && now > end) {
                          const submissionEnd = (hackathon as any).submission_deadline ? new Date((hackathon as any).submission_deadline) : null;
                          if (submissionEnd && now <= submissionEnd) {
                            statusLabel = 'Registration closed';
                          } else {
                            statusLabel = 'Ended';
                          }
                        }

                        // Only show success (green) style when registration is actually open.
                        const isSuccessStyle = isRegistrationOpen;

                        return (
                          <Badge
                            variant="secondary"
                            className={
                              isSuccessStyle ? "bg-success/20 text-success border-success/30" :
                              hackathon.status === "ongoing" ? "bg-primary/20 text-primary border-primary/30" :
                              "bg-muted"
                            }
                          >
                            {statusLabel}
                          </Badge>
                        );
                      })()}
                      {hackathon.prize_pool && (
                        <span className="text-2xl font-bold text-primary">
                          {typeof hackathon.prize_pool === 'number' 
                            ? `$${hackathon.prize_pool.toLocaleString()}` 
                            : hackathon.prize_pool.toString().startsWith('$') 
                              ? hackathon.prize_pool 
                              : `$${hackathon.prize_pool}`}
                        </span>
                      )}
                    </div>
                    
                    <h3 className="text-xl font-bold mb-2">{hackathon.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{hackathon.category}</p>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                      <div className="flex items-center gap-1">
                        {hackathon.is_online ? (
                          <Badge variant="outline" className="text-xs">Online</Badge>
                        ) : (
                          <Badge variant="outline" className="text-xs">Offline</Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{calculateDaysLeft(hackathon.submission_deadline)}</span>
                      </div>
                    </div>
                    
                    <Button className="w-full bg-primary hover:bg-primary-glow text-primary-foreground" asChild>
                      <Link to={`/hackathon/${hackathon.hackathon_id}`}>View Details</Link>
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
            </>
          )}
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 bg-secondary/20">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-muted-foreground text-lg">
              Your journey from discovery to victory in six steps
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="glass-card p-6 relative">
              <div className="absolute -top-4 -left-4 w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-xl glow-effect">
                1
              </div>
              <div className="mt-4">
                <div className="flex items-center gap-2 mb-3 text-primary">
                  <BookOpen className="w-6 h-6" />
                  <h3 className="text-lg font-bold">Browse Hackathons</h3>
                </div>
                <p className="text-muted-foreground text-sm">Explore upcoming and ongoing hackathons with detailed info on themes, dates, prizes, and difficulty levels.</p>
              </div>
            </Card>

            <Card className="glass-card p-6 relative">
              <div className="absolute -top-4 -left-4 w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-xl glow-effect">
                2
              </div>
              <div className="mt-4">
                <div className="flex items-center gap-2 mb-3 text-primary">
                  <Users className="w-6 h-6" />
                  <h3 className="text-lg font-bold">Register Your Team</h3>
                </div>
                <p className="text-muted-foreground text-sm">Create or join a team using unique team codes. Team leaders can invite members and manage the team composition.</p>
              </div>
            </Card>

            <Card className="glass-card p-6 relative">
              <div className="absolute -top-4 -left-4 w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-xl glow-effect">
                3
              </div>
              <div className="mt-4">
                <div className="flex items-center gap-2 mb-3 text-primary">
                  <Lightbulb className="w-6 h-6" />
                  <h3 className="text-lg font-bold">Get Mentor Support</h3>
                </div>
                <p className="text-muted-foreground text-sm">Admins assign mentors to teams. Connect via chat, schedule meetings, and get expert guidance throughout the hackathon.</p>
              </div>
            </Card>

            <Card className="glass-card p-6 relative">
              <div className="absolute -top-4 -left-4 w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-xl glow-effect">
                4
              </div>
              <div className="mt-4">
                <div className="flex items-center gap-2 mb-3 text-primary">
                  <Code className="w-6 h-6" />
                  <h3 className="text-lg font-bold">Build & Collaborate</h3>
                </div>
                <p className="text-muted-foreground text-sm">Work with your team, share updates with mentors, and develop your innovative solution using provided resources.</p>
              </div>
            </Card>

            <Card className="glass-card p-6 relative">
              <div className="absolute -top-4 -left-4 w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-xl glow-effect">
                5
              </div>
              <div className="mt-4">
                <div className="flex items-center gap-2 mb-3 text-primary">
                  <Target className="w-6 h-6" />
                  <h3 className="text-lg font-bold">Submit Project</h3>
                </div>
                <p className="text-muted-foreground text-sm">Upload your GitHub repo, add live demo links, presentation files, and documentation before the deadline.</p>
              </div>
            </Card>

            <Card className="glass-card p-6 relative">
              <div className="absolute -top-4 -left-4 w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-xl glow-effect">
                6
              </div>
              <div className="mt-4">
                <div className="flex items-center gap-2 mb-3 text-primary">
                  <Trophy className="w-6 h-6" />
                  <h3 className="text-lg font-bold">Compete & Win</h3>
                </div>
                <p className="text-muted-foreground text-sm">Admins evaluate submissions, assign scores, and finalize leaderboards. Track your ranking and compete for prizes!</p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Platform Workflow */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Platform Workflow</h2>
            <p className="text-muted-foreground text-lg">
              How our three user roles interact and collaborate
            </p>
          </div>
          
          <Card className="glass-card p-8 bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {/* Admin Column */}
              <div className="space-y-4">
                <div className="bg-purple-500/20 border-2 border-purple-500 rounded-lg p-4 text-center">
                  <Shield className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                  <h3 className="font-bold text-lg text-purple-500">ADMIN</h3>
                </div>
                <div className="space-y-3">
                  <div className="bg-background/50 rounded-lg p-3 border border-purple-500/30">
                    <p className="text-sm font-medium">📋 Create Hackathon</p>
                    <p className="text-xs text-muted-foreground">Set theme, dates, prizes</p>
                  </div>
                  <div className="flex justify-center">
                    <ArrowRight className="w-5 h-5 text-purple-500 rotate-90" />
                  </div>
                  <div className="bg-background/50 rounded-lg p-3 border border-purple-500/30">
                    <p className="text-sm font-medium">👥 Assign Mentors</p>
                    <p className="text-xs text-muted-foreground">1 team = 1 mentor</p>
                  </div>
                  <div className="flex justify-center">
                    <ArrowRight className="w-5 h-5 text-purple-500 rotate-90" />
                  </div>
                  <div className="bg-background/50 rounded-lg p-3 border border-purple-500/30">
                    <p className="text-sm font-medium">⭐ Evaluate & Score</p>
                    <p className="text-xs text-muted-foreground">Assign team scores</p>
                  </div>
                  <div className="flex justify-center">
                    <ArrowRight className="w-5 h-5 text-purple-500 rotate-90" />
                  </div>
                  <div className="bg-background/50 rounded-lg p-3 border border-purple-500/30">
                    <p className="text-sm font-medium">🔒 Finalize Rankings</p>
                    <p className="text-xs text-muted-foreground">Lock leaderboard</p>
                  </div>
                </div>
              </div>

              {/* Team Column */}
              <div className="space-y-4">
                <div className="bg-blue-500/20 border-2 border-blue-500 rounded-lg p-4 text-center">
                  <Users className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                  <h3 className="font-bold text-lg text-blue-500">TEAMS</h3>
                </div>
                <div className="space-y-3">
                  <div className="bg-background/50 rounded-lg p-3 border border-blue-500/30">
                    <p className="text-sm font-medium">📝 Register Team</p>
                    <p className="text-xs text-muted-foreground">Join with team code</p>
                  </div>
                  <div className="flex justify-center">
                    <ArrowRight className="w-5 h-5 text-blue-500 rotate-90" />
                  </div>
                  <div className="bg-background/50 rounded-lg p-3 border border-blue-500/30">
                    <p className="text-sm font-medium">💬 Chat with Mentor</p>
                    <p className="text-xs text-muted-foreground">Real-time messaging</p>
                  </div>
                  <div className="flex justify-center">
                    <ArrowRight className="w-5 h-5 text-blue-500 rotate-90" />
                  </div>
                  <div className="bg-background/50 rounded-lg p-3 border border-blue-500/30">
                    <p className="text-sm font-medium">🚀 Submit Project</p>
                    <p className="text-xs text-muted-foreground">GitHub, demo, files</p>
                  </div>
                  <div className="flex justify-center">
                    <ArrowRight className="w-5 h-5 text-blue-500 rotate-90" />
                  </div>
                  <div className="bg-background/50 rounded-lg p-3 border border-blue-500/30">
                    <p className="text-sm font-medium">📊 View Leaderboard</p>
                    <p className="text-xs text-muted-foreground">Track rankings</p>
                  </div>
                </div>
              </div>

              {/* Mentor Column */}
              <div className="space-y-4">
                <div className="bg-green-500/20 border-2 border-green-500 rounded-lg p-4 text-center">
                  <Lightbulb className="w-8 h-8 text-green-500 mx-auto mb-2" />
                  <h3 className="font-bold text-lg text-green-500">MENTORS</h3>
                </div>
                <div className="space-y-3">
                  <div className="bg-background/50 rounded-lg p-3 border border-green-500/30">
                    <p className="text-sm font-medium">👀 View Teams</p>
                    <p className="text-xs text-muted-foreground">All assigned teams</p>
                  </div>
                  <div className="flex justify-center">
                    <ArrowRight className="w-5 h-5 text-green-500 rotate-90" />
                  </div>
                  <div className="bg-background/50 rounded-lg p-3 border border-green-500/30">
                    <p className="text-sm font-medium">💬 Chat & Guide</p>
                    <p className="text-xs text-muted-foreground">Answer questions</p>
                  </div>
                  <div className="flex justify-center">
                    <ArrowRight className="w-5 h-5 text-green-500 rotate-90" />
                  </div>
                  <div className="bg-background/50 rounded-lg p-3 border border-green-500/30">
                    <p className="text-sm font-medium">📅 Schedule Meetings</p>
                    <p className="text-xs text-muted-foreground">Google Meet/Zoom</p>
                  </div>
                  <div className="flex justify-center">
                    <ArrowRight className="w-5 h-5 text-green-500 rotate-90" />
                  </div>
                  <div className="bg-background/50 rounded-lg p-3 border border-green-500/30">
                    <p className="text-sm font-medium">💡 Provide Feedback</p>
                    <p className="text-xs text-muted-foreground">Help improve projects</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Flow Connections */}
            <div className="border-t border-primary/20 pt-6">
              <div className="grid md:grid-cols-3 gap-4 text-center text-sm">
                <div className="bg-purple-500/10 rounded-lg p-3">
                  <p className="font-medium text-purple-500">Admin → Teams</p>
                  <p className="text-xs text-muted-foreground">Creates hackathons, assigns scores</p>
                </div>
                <div className="bg-blue-500/10 rounded-lg p-3">
                  <p className="font-medium text-blue-500">Teams ↔ Mentors</p>
                  <p className="text-xs text-muted-foreground">Chat, meetings, guidance</p>
                </div>
                <div className="bg-green-500/10 rounded-lg p-3">
                  <p className="font-medium text-green-500">Admin → Mentors</p>
                  <p className="text-xs text-muted-foreground">Assigns to teams</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

        <Footer />
      </div>
    </div>
  );
};

export default Index;
