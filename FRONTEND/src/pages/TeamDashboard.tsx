import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Navbar from "@/components/Navbar";
import TeamRegistrationModal from "@/components/TeamRegistrationModal";
import { TeamDetailsModal } from "@/components/TeamDetailsModal";
import { SubmissionModal } from "@/components/SubmissionModal";
import MentorContentModal from "@/components/MentorContentModal";
import { TeamSettingsModal } from "@/components/TeamSettingsModal";
import { Upload, Users, Calendar, Award, MessageSquare, Info, TrophyIcon, Settings } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useAutoRefresh } from "@/hooks/use-auto-refresh";
import { hackathonAPI, teamAPI } from "@/lib/api";
import { toast } from "sonner";

const TeamDashboard = () => {
  const navigate = useNavigate();
  const { user, logout, isTeamMember, loading: authLoading } = useAuth();
  const [hackathons, setHackathons] = useState<any[]>([]);
  const [myTeams, setMyTeams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedHackathon, setSelectedHackathon] = useState<any>(null);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  
  // Team details modal state
  const [selectedTeam, setSelectedTeam] = useState<any>(null);
  const [showTeamDetailsModal, setShowTeamDetailsModal] = useState(false);
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [teamSubmission, setTeamSubmission] = useState<any>(null);
  const [loadingTeamDetails, setLoadingTeamDetails] = useState(false);
  
  // Submission modal state
  const [showSubmissionModal, setShowSubmissionModal] = useState(false);
  const [selectedTeamForSubmission, setSelectedTeamForSubmission] = useState<any>(null);

  // Mentor content modal state
  const [showMentorModal, setShowMentorModal] = useState(false);
  const [selectedTeamForMentor, setSelectedTeamForMentor] = useState<any>(null);

  // Settings modal state
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  useEffect(() => {
    // Wait for auth to finish loading before checking authentication
    if (authLoading) return;
    
    if (!user || !isTeamMember) {
      toast.error("Please login as a team member");
      navigate("/login/team");
      return;
    }
    fetchData();
  }, [user, isTeamMember, navigate, authLoading]);

  const fetchData = async () => {
    try {
      setLoading(true);
      await Promise.all([fetchHackathons(), fetchMyTeams()]);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Auto-refresh every 1 second for real-time updates
  // Silent auto-refresh - only update state if data actually changes (prevents blinking)
  useEffect(() => {
    let isMounted = true;
    const silentRefresh = async () => {
      try {
        // Fetch hackathons
        const hackathonRes = await hackathonAPI.getAll();
        const hackathonsData = hackathonRes.data.data || hackathonRes.data || [];
        const now = new Date();
        const ongoingHackathons = hackathonsData.filter((h: any) => {
          const regStart = new Date(h.registration_start_date);
          const regEnd = new Date(h.registration_end_date);
          return now >= regStart && now <= regEnd;
        });
        if (isMounted && JSON.stringify(ongoingHackathons) !== JSON.stringify(hackathons)) {
          setHackathons(ongoingHackathons);
        }

        // Fetch teams
        const teamRes = await teamAPI.getMyTeams();
        const teamsData = teamRes.data.data || teamRes.data || [];
        if (isMounted && JSON.stringify(teamsData) !== JSON.stringify(myTeams)) {
          setMyTeams(teamsData);
        }
      } catch (err) {
        // Silent fail - don't show errors during background refresh
      }
    };
    const interval = setInterval(silentRefresh, 1000); // 1 second for real-time updates
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [hackathons, myTeams]);

  const fetchHackathons = async () => {
    try {
      const response = await hackathonAPI.getAll();
      const hackathonsData = response.data.data || response.data || [];
      
      // Filter hackathons that are currently in registration period
      const now = new Date();
      const ongoingHackathons = hackathonsData.filter((h: any) => {
        const regStart = new Date(h.registration_start_date);
        const regEnd = new Date(h.registration_end_date);
        return now >= regStart && now <= regEnd;
      });
      
      setHackathons(ongoingHackathons);
    } catch (error) {
      console.error('Failed to fetch hackathons:', error);
      setHackathons([]);
    }
  };

  const fetchMyTeams = async () => {
    try {
      const response = await teamAPI.getMyTeams();
      const teamsData = response.data.data || response.data || [];
      setMyTeams(teamsData);
    } catch (error) {
      console.error('Failed to fetch teams:', error);
      setMyTeams([]);
    }
  };

  const handleRegisterTeam = (hackathon: any) => {
    // Check if already registered
    if (isRegisteredForHackathon(hackathon.hackathon_id)) {
      toast.error("You are already registered for this hackathon!");
      return;
    }
    
    setSelectedHackathon(hackathon);
    setShowRegisterModal(true);
  };

  const handleRegistrationSuccess = () => {
    fetchMyTeams(); // Refresh teams list
    toast.success("Team registered successfully!");
  };

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/login/team");
  };

  const calculateDaysLeft = (deadline: string) => {
    const now = new Date();
    const end = new Date(deadline);
    const diffTime = end.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return "Ended";
    if (diffDays === 0) return "Ends today";
    if (diffDays === 1) return "1 day left";
    return `${diffDays} days left`;
  };

  // Check if user is already registered for a hackathon
  const isRegisteredForHackathon = (hackathonId: number) => {
    return myTeams.some(team => team.hackathon_id === hackathonId);
  };

  // Get unregistered ongoing hackathons
  const getUnregisteredHackathons = () => {
    return hackathons.filter(h => !isRegisteredForHackathon(h.hackathon_id));
  };

  const handleViewTeamDetails = async (team: any) => {
    setSelectedTeam(team);
    setShowTeamDetailsModal(true);
    setLoadingTeamDetails(true);
    
    try {
      const response = await teamAPI.getTeamDetails(team.team_id);
      const data = response.data.data || response.data; // Handle both response structures
      setTeamMembers(data.members || []);
      setTeamSubmission(data.submission || null);
    } catch (error) {
      console.error('Failed to fetch team details:', error);
      toast.error("Failed to load team details");
      setTeamMembers([]);
      setTeamSubmission(null);
    } finally {
      setLoadingTeamDetails(false);
    }
  };

  const handleSubmitProject = (team: any) => {
    setSelectedTeamForSubmission(team);
    setShowSubmissionModal(true);
  };

  const handleSubmissionSuccess = () => {
    fetchMyTeams(); // Refresh teams list
    toast.success("Project submitted successfully!");
  };

  const handleViewMentorContent = (team: any) => {
    setSelectedTeamForMentor(team);
    setShowMentorModal(true);
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="pt-24 pb-12 px-4">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold mb-2">Team Dashboard</h1>
              <p className="text-muted-foreground">Welcome back, {user?.full_name || user?.email}!</p>
              {user?.organization && (
                <p className="text-sm text-muted-foreground">Organization: {user.organization}</p>
              )}
            </div>
            <Button
              onClick={() => setShowSettingsModal(true)}
              variant="outline"
              className="gap-2"
            >
              <Settings className="w-4 h-4" />
              Settings
            </Button>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card className="glass-card p-6">
              <Calendar className="w-8 h-8 text-primary mb-4" />
              <div className="text-2xl font-bold mb-2">{myTeams.length}</div>
              <div className="text-sm text-muted-foreground">My Teams</div>
            </Card>
            
            <Card className="glass-card p-6">
              <Users className="w-8 h-8 text-accent mb-4" />
              <div className="text-2xl font-bold mb-2">{getUnregisteredHackathons().length}</div>
              <div className="text-sm text-muted-foreground">Ongoing Hackathons (Not Registered Yet)</div>
            </Card>
            
            <Card className="glass-card p-6">
              <Award className="w-8 h-8 text-success mb-4" />
              <div className="text-2xl font-bold mb-2">
                {myTeams.reduce((total, team) => total + (team.submission_count || 0), 0)}
              </div>
              <div className="text-sm text-muted-foreground">Submissions</div>
            </Card>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* My Teams */}
            <Card className="glass-card p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">My Teams</h2>
              </div>
              
              {loading ? (
                <p className="text-center text-muted-foreground py-8">Loading...</p>
              ) : myTeams.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">You haven't joined any teams yet</p>
                  <p className="text-sm text-muted-foreground">Register for a hackathon to create your team</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {myTeams.map((team) => (
                    <div key={team.team_id} className="glass-card p-4 rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold">{team.team_name}</h3>
                          <p className="text-sm text-muted-foreground">{team.hackathon_title}</p>
                        </div>
                        <Badge 
                          variant="secondary" 
                          className={
                            team.status === "confirmed" ? "bg-success/20 text-success border-success/30" :
                            team.status === "registered" ? "bg-primary/20 text-primary border-primary/30" :
                            team.status === "submitted" ? "bg-blue-500/20 text-blue-500 border-blue-500/30" :
                            "bg-muted/20 text-muted-foreground border-muted/30"
                          }
                        >
                          {team.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3 flex-wrap">
                        <span className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {team.member_count} members
                        </span>
                        {team.team_code && (
                          <span className="font-mono text-primary">Code: {team.team_code}</span>
                        )}
                        {(team.status === 'submitted' || team.status === 'judged' || team.status === 'winner') && 
                         team.total_score !== null && team.total_score !== undefined && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span className="flex items-center gap-1 px-2 py-1 rounded-md bg-yellow-500/10 border border-yellow-500/30 cursor-help">
                                  <Award className="w-4 h-4 text-yellow-500" />
                                  <span className="font-semibold text-yellow-500">{team.total_score}/100</span>
                                  {team.leaderboard_finalized ? (
                                    <TrophyIcon className="w-4 h-4 text-yellow-500" />
                                  ) : (
                                    <Info className="w-4 h-4 text-blue-500" />
                                  )}
                                </span>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="max-w-xs">
                                  {team.leaderboard_finalized 
                                    ? "🏆 This is the Final Standing" 
                                    : "⚠️ This is the current leaderboard. Final rankings may have different standings and teams once the admin finalizes the leaderboard."}
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                      </div>
                      {team.submission_deadline && (
                        <p className="text-sm text-muted-foreground mb-3">
                          Deadline: {calculateDaysLeft(team.submission_deadline)}
                        </p>
                      )}
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="glass-card flex-1"
                          onClick={() => handleViewTeamDetails(team)}
                        >
                          View Team Details
                        </Button>
                        {(team.status === 'submitted' || team.status === 'judged' || team.status === 'winner') && (
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="glass-card flex-1"
                            onClick={() => navigate(`/hackathon/${team.hackathon_id}/leaderboard`)}
                          >
                            <Award className="w-4 h-4 mr-1" />
                            Leaderboard
                          </Button>
                        )}
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="glass-card flex-1"
                          onClick={() => handleViewMentorContent(team)}
                        >
                          <MessageSquare className="w-4 h-4 mr-1" />
                          Mentor
                        </Button>
                        {(team.status === "forming" || team.status === "confirmed" || team.status === "registered") && (
                          <Button 
                            size="sm" 
                            className="bg-primary hover:bg-primary-glow text-primary-foreground flex-1"
                            onClick={() => handleSubmitProject(team)}
                          >
                            <Upload className="w-4 h-4 mr-1" />
                            Submit
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            {/* Ongoing Hackathons (Not Registered Yet) */}
            <Card className="glass-card p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Ongoing Hackathons (Not Registered Yet)</h2>
                <Button size="sm" className="bg-primary hover:bg-primary-glow text-primary-foreground" asChild>
                  <Link to="/hackathons">View All</Link>
                </Button>
              </div>
              
              {loading ? (
                <p className="text-center text-muted-foreground py-8">Loading...</p>
              ) : getUnregisteredHackathons().length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No ongoing hackathons available to register</p>
              ) : (
                <div className="space-y-4">
                  {getUnregisteredHackathons().slice(0, 3).map((hackathon) => (
                    <div key={hackathon.hackathon_id} className="glass-card p-4 rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold">{hackathon.title}</h3>
                        <Badge 
                          variant="secondary" 
                          className={
                            hackathon.status === "open" ? "bg-success/20 text-success border-success/30" :
                            "bg-primary/20 text-primary border-primary/30"
                          }
                        >
                          {hackathon.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        {calculateDaysLeft(hackathon.submission_deadline)}
                      </p>
                      {hackathon.prize_pool && (
                        <p className="text-sm font-semibold text-primary mb-3">
                          Prize: {typeof hackathon.prize_pool === 'number' 
                            ? `$${hackathon.prize_pool.toLocaleString()}` 
                            : hackathon.prize_pool.toString().replace(/₹/g, '').startsWith('$') 
                              ? hackathon.prize_pool.toString().replace(/₹/g, '') 
                              : `$${hackathon.prize_pool.toString().replace(/₹/g, '')}`}
                        </p>
                      )}
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="glass-card flex-1" asChild>
                          <Link to={`/hackathon/${hackathon.hackathon_id}`}>View Details</Link>
                        </Button>
                        <Button 
                          size="sm" 
                          className="bg-primary flex-1"
                          onClick={() => handleRegisterTeam(hackathon)}
                          disabled={isRegisteredForHackathon(hackathon.hackathon_id)}
                        >
                          {isRegisteredForHackathon(hackathon.hackathon_id) ? 'Already Registered' : 'Register Team'}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>

      {/* Team Registration Modal */}
      {selectedHackathon && (
        <TeamRegistrationModal
          isOpen={showRegisterModal}
          onClose={() => setShowRegisterModal(false)}
          hackathon={selectedHackathon}
          onSuccess={handleRegistrationSuccess}
        />
      )}

      {/* Team Details Modal */}
      {selectedTeam && (
        <TeamDetailsModal
          isOpen={showTeamDetailsModal}
          onClose={() => setShowTeamDetailsModal(false)}
          team={selectedTeam}
          members={teamMembers}
          submission={teamSubmission}
          loading={loadingTeamDetails}
        />
      )}

      {/* Submission Modal */}
      {selectedTeamForSubmission && (
        <SubmissionModal
          isOpen={showSubmissionModal}
          onClose={() => setShowSubmissionModal(false)}
          team={selectedTeamForSubmission}
          onSuccess={handleSubmissionSuccess}
        />
      )}

      {/* Mentor Content Modal */}
      {selectedTeamForMentor && (
        <MentorContentModal
          open={showMentorModal}
          onClose={() => setShowMentorModal(false)}
          teamId={selectedTeamForMentor.team_id}
        />
      )}

      {/* Settings Modal */}
      <TeamSettingsModal
        open={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
        team={myTeams.length > 0 ? myTeams[0] : null}
        onUpdate={fetchMyTeams}
      />
    </div>
  );
};

export default TeamDashboard;
