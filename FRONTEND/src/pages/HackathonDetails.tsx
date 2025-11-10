import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowLeft, Calendar, Users, Trophy, Clock, MapPin } from "lucide-react";
import { hackathonAPI, teamAPI } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

interface Hackathon {
  hackathon_id: number;
  title: string;
  category: string;
  description: string;
  detailed_description?: string;
  prize_pool?: number | string;
  first_prize?: number | string;
  second_prize?: number | string;
  third_prize?: number | string;
  status: string;
  registration_start_date: string;
  registration_end_date: string;
  development_start_date: string;
  development_end_date: string;
  submission_deadline: string;
  min_team_size: number;
  max_team_size: number;
  rules?: string;
  judging_criteria?: string;
  is_online: boolean;
  location?: string;
  stats?: {
    totalTeams: number;
    totalParticipants: number;
  };
}

const HackathonDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, isTeamMember, isMentor, isAdmin } = useAuth();
  const [hackathon, setHackathon] = useState<Hackathon | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRegistered, setIsRegistered] = useState(false);
  const [checkingRegistration, setCheckingRegistration] = useState(false);

  useEffect(() => {
    if (id) {
      fetchHackathon(Number(id));
      if (isAuthenticated && isTeamMember) {
        checkIfRegistered(Number(id));
      }
    }
  }, [id, isAuthenticated, isTeamMember]);

  const checkIfRegistered = async (hackathonId: number) => {
    try {
      setCheckingRegistration(true);
      const response = await teamAPI.getMyTeams();
      const teams = response.data.data || response.data || [];
      
      // Check if user has any team registered for this hackathon
      const registered = teams.some((team: any) => team.hackathon_id === hackathonId);
      setIsRegistered(registered);
    } catch (error) {
      console.error('Failed to check registration:', error);
      setIsRegistered(false);
    } finally {
      setCheckingRegistration(false);
    }
  };

  const fetchHackathon = async (hackathonId: number) => {
    try {
      setLoading(true);
      const response = await hackathonAPI.getById(hackathonId);
      const data = response.data.data || response.data;
      setHackathon(data);
    } catch (error) {
      console.error('Failed to fetch hackathon:', error);
      setHackathon(null);
    } finally {
      setLoading(false);
    }
  };

  const calculateDaysLeft = (deadline: string) => {
    const now = new Date();
    const end = new Date(deadline);
    const diffTime = end.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleRegisterClick = () => {
    // If user is not logged in, redirect to team login page
    if (!isAuthenticated) {
      navigate('/login/team');
      return;
    }
    // If user is logged in, go to registration page
    navigate(`/register/team?hackathon=${id}`);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="pt-24 pb-12 px-4">
          <div className="container mx-auto text-center">
            <p className="text-muted-foreground">Loading hackathon details...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!hackathon) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="pt-24 pb-12 px-4">
          <div className="container mx-auto text-center">
            <h1 className="text-3xl font-bold mb-4">Hackathon Not Found</h1>
            <p className="text-muted-foreground mb-6">The hackathon you're looking for doesn't exist.</p>
            <Button asChild>
              <Link to="/hackathons">Back to Hackathons</Link>
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const daysLeft = calculateDaysLeft(hackathon.submission_deadline);

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="pt-24 pb-12 px-4">
        <div className="container mx-auto">
          <Button variant="ghost" className="mb-6" asChild>
            <Link to="/hackathons">
              <ArrowLeft className="mr-2 w-4 h-4" />
              Back to Hackathons
            </Link>
          </Button>
          
          {/* Hero Section */}
          <Card className="glass-card p-8 mb-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <div className="flex-1">
                <Badge 
                  variant="secondary" 
                  className={
                    hackathon.status === "open" ? "bg-success/20 text-success border-success/30 mb-4" :
                    hackathon.status === "ongoing" ? "bg-primary/20 text-primary border-primary/30 mb-4" :
                    "bg-muted mb-4"
                  }
                >
                  {hackathon.status}
                </Badge>
                <h1 className="text-4xl font-bold mb-2">{hackathon.title}</h1>
                <p className="text-muted-foreground">{hackathon.description}</p>
                {hackathon.detailed_description && (
                  <p className="text-muted-foreground mt-4 whitespace-pre-wrap">{hackathon.detailed_description}</p>
                )}
              </div>
              {hackathon.prize_pool && (
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary mb-2">
                    {typeof hackathon.prize_pool === 'number' 
                      ? `$${hackathon.prize_pool.toLocaleString()}` 
                      : hackathon.prize_pool.toString().startsWith('$') 
                        ? hackathon.prize_pool 
                        : `$${hackathon.prize_pool}`}
                  </div>
                  <div className="text-sm text-muted-foreground">Total Prize Pool</div>
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-muted-foreground" />
                <div>
                  <div className="font-semibold">{hackathon.min_team_size}-{hackathon.max_team_size}</div>
                  <div className="text-sm text-muted-foreground">Team Size</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-muted-foreground" />
                <div>
                  <div className="font-semibold">{formatDate(hackathon.submission_deadline)}</div>
                  <div className="text-sm text-muted-foreground">Deadline</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-muted-foreground" />
                <div>
                  <div className="font-semibold">{daysLeft > 0 ? `${daysLeft} days` : 'Ended'}</div>
                  <div className="text-sm text-muted-foreground">Remaining</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-muted-foreground" />
                <div>
                  <div className="font-semibold">{hackathon.category}</div>
                  <div className="text-sm text-muted-foreground">Category</div>
                </div>
              </div>
            </div>

            {hackathon.is_online ? (
              <div className="flex items-center gap-2 mb-6">
                <MapPin className="w-5 h-5 text-primary" />
                <span className="text-sm font-semibold">Online Event</span>
              </div>
            ) : hackathon.location ? (
              <div className="flex items-center gap-2 mb-6">
                <MapPin className="w-5 h-5 text-primary" />
                <div>
                  <div className="text-sm font-semibold">Location</div>
                  <div className="text-sm text-muted-foreground">{hackathon.location}</div>
                </div>
              </div>
            ) : null}
            
            <div className="flex flex-col md:flex-row gap-3">
              {/* Only show Register button to team members, not mentors or admins */}
              {!isMentor && !isAdmin && (
                <Button 
                  size="lg" 
                  className="w-full md:w-auto bg-primary hover:bg-primary-glow text-primary-foreground glow-effect"
                  onClick={handleRegisterClick}
                  disabled={isRegistered || checkingRegistration}
                >
                  {checkingRegistration 
                    ? 'Checking...' 
                    : isRegistered 
                      ? 'Already Registered' 
                      : 'Register Your Team'}
                </Button>
              )}
              <Button size="lg" variant="outline" className="w-full md:w-auto glass-card" asChild>
                <Link to={`/hackathon/${id}/leaderboard`}>View Leaderboard</Link>
              </Button>
            </div>
          </Card>
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* Rules & Criteria */}
            <Card className="glass-card p-6">
              <h2 className="text-2xl font-bold mb-4">Rules & Guidelines</h2>
              {hackathon.rules ? (
                <div className="text-muted-foreground whitespace-pre-wrap">{hackathon.rules}</div>
              ) : (
                <p className="text-muted-foreground">No specific rules defined yet.</p>
              )}
              
              <h3 className="text-xl font-bold mt-6 mb-4">Judging Criteria</h3>
              {hackathon.judging_criteria ? (
                <div className="text-muted-foreground whitespace-pre-wrap">{hackathon.judging_criteria}</div>
              ) : (
                <p className="text-muted-foreground">Judging criteria will be announced soon.</p>
              )}
            </Card>
            
            {/* Prize Distribution */}
            <div className="space-y-6">
              {(hackathon.first_prize || hackathon.second_prize || hackathon.third_prize) && (
                <Card className="glass-card p-6">
                  <h2 className="text-2xl font-bold mb-4">Prize Distribution</h2>
                  <div className="space-y-4">
                    {hackathon.first_prize && (
                      <div className="flex items-center justify-between p-4 glass-card rounded-lg">
                        <span className="font-semibold">🥇 First Place</span>
                        <span className="text-2xl font-bold text-primary">
                          {typeof hackathon.first_prize === 'number' 
                            ? `$${hackathon.first_prize.toLocaleString()}` 
                            : hackathon.first_prize.toString().startsWith('$') 
                              ? hackathon.first_prize 
                              : `$${hackathon.first_prize}`}
                        </span>
                      </div>
                    )}
                    {hackathon.second_prize && (
                      <div className="flex items-center justify-between p-4 glass-card rounded-lg">
                        <span className="font-semibold">🥈 Second Place</span>
                        <span className="text-2xl font-bold text-primary">
                          {typeof hackathon.second_prize === 'number' 
                            ? `$${hackathon.second_prize.toLocaleString()}` 
                            : hackathon.second_prize.toString().startsWith('$') 
                              ? hackathon.second_prize 
                              : `$${hackathon.second_prize}`}
                        </span>
                      </div>
                    )}
                    {hackathon.third_prize && (
                      <div className="flex items-center justify-between p-4 glass-card rounded-lg">
                        <span className="font-semibold">🥉 Third Place</span>
                        <span className="text-2xl font-bold text-primary">
                          {typeof hackathon.third_prize === 'number' 
                            ? `$${hackathon.third_prize.toLocaleString()}` 
                            : hackathon.third_prize.toString().startsWith('$') 
                              ? hackathon.third_prize 
                              : `$${hackathon.third_prize}`}
                        </span>
                      </div>
                    )}
                  </div>
                </Card>
              )}
              
              {/* Timeline */}
              <Card className="glass-card p-6">
                <h2 className="text-2xl font-bold mb-4">Timeline</h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                    <div>
                      <div className="font-semibold">Registration Opens</div>
                      <div className="text-sm text-muted-foreground">{formatDate(hackathon.registration_start_date)}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                    <div>
                      <div className="font-semibold">Registration Closes</div>
                      <div className="text-sm text-muted-foreground">{formatDate(hackathon.registration_end_date)}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                    <div>
                      <div className="font-semibold">Development Begins</div>
                      <div className="text-sm text-muted-foreground">{formatDate(hackathon.development_start_date)}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                    <div>
                      <div className="font-semibold">Development Ends</div>
                      <div className="text-sm text-muted-foreground">{formatDate(hackathon.development_end_date)}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-success mt-2" />
                    <div>
                      <div className="font-semibold">Final Submission Deadline</div>
                      <div className="text-sm text-muted-foreground">{formatDate(hackathon.submission_deadline)}</div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default HackathonDetails;
