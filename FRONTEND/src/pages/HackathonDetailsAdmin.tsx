import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { 
  ArrowLeft, 
  Users, 
  Trophy, 
  Calendar, 
  MapPin, 
  Eye,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  Edit,
  Award
} from "lucide-react";
import { hackathonAPI, teamAPI } from "@/lib/api";

interface TeamMember {
  member_id: number;
  user_id: number;
  full_name: string;
  email: string;
  role?: string;
  is_leader: boolean;
  status: string;
}

interface Team {
  team_id: number;
  team_name: string;
  team_code: string;
  description?: string;
  leader_name: string;
  leader_email: string;
  member_count: number;
  status: string;
  registration_date: string;
  project_title?: string;
  project_description?: string;
  project_url?: string;
  github_repo?: string;
  demo_video_url?: string;
  presentation_url?: string;
  submission_date?: string;
  total_score?: number;
  members?: TeamMember[];
}

interface Submission {
  submission_id: number;
  submission_title: string;
  description?: string;
  project_zip_url?: string;
  github_url?: string;
  demo_url?: string;
  video_url?: string;
  documentation_url?: string;
  submitted_at: string;
}

interface Hackathon {
  hackathon_id: number;
  title: string;
  category: string;
  description: string;
  detailed_description?: string;
  prize_pool: string;
  first_prize?: string;
  second_prize?: string;
  third_prize?: string;
  registration_start_date: string;
  registration_end_date: string;
  development_start_date: string;
  development_end_date: string;
  submission_deadline: string;
  min_team_size: number;
  max_team_size: number;
  status: string;
  location?: string;
  is_online: boolean;
}

const HackathonDetailsAdmin = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const { toast } = useToast();
  
  const [hackathon, setHackathon] = useState<Hackathon | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [selectedTeamSubmission, setSelectedTeamSubmission] = useState<Submission | null>(null);
  const [loading, setLoading] = useState(true);
  const [showTeamModal, setShowTeamModal] = useState(false);
  const [loadingTeamDetails, setLoadingTeamDetails] = useState(false);
  const [showScoreDialog, setShowScoreDialog] = useState(false);
  const [scoreTeam, setScoreTeam] = useState<Team | null>(null);
  const [scoreValue, setScoreValue] = useState('');
  const [leaderboardFinalized, setLeaderboardFinalized] = useState(false);

  useEffect(() => {
    if (!user || !isAdmin) {
      toast({
        title: "Access Denied",
        description: "You must be logged in as admin to access this page.",
        variant: "destructive"
      });
      navigate("/admin/login");
      return;
    }
    fetchHackathonDetails();
    fetchTeams();
  }, [id, user, isAdmin]);

  const fetchHackathonDetails = async () => {
    try {
      const response = await hackathonAPI.getById(Number(id));
      setHackathon(response.data.data);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to fetch hackathon details",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchTeams = async () => {
    try {
      const response = await teamAPI.getByHackathon(Number(id));
      setTeams(response.data.data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to fetch teams",
        variant: "destructive"
      });
    }
  };

  const fetchTeamDetails = async (teamId: number) => {
    setLoadingTeamDetails(true);
    try {
      const response = await teamAPI.getTeamDetails(teamId);
      const data = response.data.data || response.data;
      setSelectedTeam(data.team || response.data.data);
      setSelectedTeamSubmission(data.submission || null);
      setShowTeamModal(true);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to fetch team details",
        variant: "destructive"
      });
    } finally {
      setLoadingTeamDetails(false);
    }
  };

  const handleEditScore = (team: Team) => {
    setScoreTeam(team);
    setScoreValue(team.total_score?.toString() || '0');
    setShowScoreDialog(true);
  };

  const handleSaveScore = async () => {
    if (!scoreTeam) return;
    
    const score = parseFloat(scoreValue);
    if (isNaN(score) || score < 0 || score > 100) {
      toast({
        title: "Invalid Score",
        description: "Score must be between 0 and 100",
        variant: "destructive"
      });
      return;
    }

    try {
      console.log('Updating score for team:', scoreTeam.team_id, 'Score:', score);
      const response = await hackathonAPI.updateTeamScore(scoreTeam.team_id, score);
      console.log('Score update response:', response);
      toast({
        title: "Success",
        description: "Team score updated successfully"
      });
      setShowScoreDialog(false);
      fetchTeams(); // Refresh teams list
    } catch (error: any) {
      console.error('Score update error:', error);
      console.error('Error response:', error.response);
      toast({
        title: "Error",
        description: error.response?.data?.message || error.message || "Failed to update score",
        variant: "destructive"
      });
    }
  };

  const handleFinalizeLeaderboard = async () => {
    try {
      console.log('Finalizing leaderboard for hackathon:', id);
      const response = await hackathonAPI.finalizeLeaderboard(Number(id));
      console.log('Finalize response:', response);
      setLeaderboardFinalized(true);
      toast({
        title: "Success",
        description: "Leaderboard has been finalized!"
      });
      fetchHackathonDetails();
    } catch (error: any) {
      console.error('Finalize error:', error);
      console.error('Error response:', error.response);
      toast({
        title: "Error",
        description: error.response?.data?.message || error.message || "Failed to finalize leaderboard",
        variant: "destructive"
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { color: string; label: string }> = {
      registered: { color: "bg-blue-500", label: "Registered" },
      confirmed: { color: "bg-green-500", label: "Confirmed" },
      submitted: { color: "bg-blue-600", label: "Submitted" },
      judged: { color: "bg-yellow-500", label: "Judged" },
      winner: { color: "bg-gold-500", label: "Winner" },
      disqualified: { color: "bg-red-500", label: "Disqualified" }
    };
    const config = statusConfig[status] || { color: "bg-gray-500", label: status };
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const submittedTeams = teams.filter(t => t.status === 'submitted' || t.status === 'judged' || t.status === 'winner');
  const registeredTeams = teams.filter(t => t.status === 'registered' || t.status === 'confirmed');

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="pt-24 pb-12 px-4">
          <div className="container mx-auto max-w-7xl flex items-center justify-center min-h-[60vh]">
            <div className="text-xl">Loading...</div>
          </div>
        </div>
      </div>
    );
  }

  if (!hackathon) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="pt-24 pb-12 px-4">
          <div className="container mx-auto max-w-7xl">
            <div className="text-xl">Hackathon not found</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-7xl">
          {/* Header */}
          <div className="mb-6">
            <Button 
              variant="ghost" 
              onClick={() => navigate("/admin/dashboard")}
              className="mb-4"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
            
            <Card className="glass-card p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h1 className="text-3xl font-bold mb-2">{hackathon.title}</h1>
                  <p className="text-muted-foreground mb-2">{hackathon.description}</p>
                  <div className="flex gap-2 flex-wrap">
                    <Badge variant="secondary">{hackathon.category}</Badge>
                    {getStatusBadge(hackathon.status)}
                    <Badge variant="outline">
                      {hackathon.is_online ? <MapPin className="w-3 h-3 mr-1" /> : null}
                      {hackathon.is_online ? "Online" : hackathon.location}
                    </Badge>
                  </div>
                </div>
                <div className="flex flex-col gap-3 items-end">
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary">{hackathon.prize_pool}</div>
                    <div className="text-sm text-muted-foreground">Total Prize Pool</div>
                  </div>
                  <Button
                    onClick={handleFinalizeLeaderboard}
                    className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
                    disabled={leaderboardFinalized || submittedTeams.length === 0}
                    title={submittedTeams.length === 0 ? "At least one team must submit their project before finalizing" : ""}
                  >
                    <Award className="w-4 h-4 mr-2" />
                    {leaderboardFinalized ? 'Leaderboard Finalized' : 'Finalize Leaderboard'}
                  </Button>
                  {!leaderboardFinalized && submittedTeams.length === 0 && (
                    <p className="text-xs text-muted-foreground text-right">
                      At least 1 team must submit before finalizing
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
                <Card className="glass-card">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-muted-foreground">Total Teams</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{teams.length}</div>
                  </CardContent>
                </Card>
                <Card className="glass-card">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-muted-foreground">Registered</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-blue-500">{registeredTeams.length}</div>
                  </CardContent>
                </Card>
                <Card className="glass-card">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-muted-foreground">Submitted</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-success">{submittedTeams.length}</div>
                  </CardContent>
                </Card>
                <Card className="glass-card">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-muted-foreground">Team Size</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-primary">
                      {hackathon.min_team_size}-{hackathon.max_team_size}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </Card>
          </div>

          {/* Teams Tabs */}
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="glass-card">
              <TabsTrigger value="all">All Teams ({teams.length})</TabsTrigger>
              <TabsTrigger value="registered">Registered ({registeredTeams.length})</TabsTrigger>
              <TabsTrigger value="submitted">Submitted ({submittedTeams.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              <TeamsTable teams={teams} onViewDetails={fetchTeamDetails} onEditScore={handleEditScore} isFinalized={leaderboardFinalized} />
            </TabsContent>

            <TabsContent value="registered">
              <TeamsTable teams={registeredTeams} onViewDetails={fetchTeamDetails} onEditScore={handleEditScore} isFinalized={leaderboardFinalized} />
            </TabsContent>

            <TabsContent value="submitted">
              <TeamsTable teams={submittedTeams} onViewDetails={fetchTeamDetails} onEditScore={handleEditScore} isFinalized={leaderboardFinalized} />
            </TabsContent>
          </Tabs>

          {/* Team Details Modal */}
          {showTeamModal && selectedTeam && (
            <TeamDetailsModal 
              team={selectedTeam}
              submission={selectedTeamSubmission}
              loading={loadingTeamDetails}
              onClose={() => {
                setShowTeamModal(false);
                setSelectedTeam(null);
                setSelectedTeamSubmission(null);
              }}
            />
          )}

          {/* Score Edit Dialog */}
          <Dialog open={showScoreDialog} onOpenChange={setShowScoreDialog}>
            <DialogContent className="glass-card">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-yellow-500" />
                  Update Team Score
                </DialogTitle>
                <DialogDescription>
                  Assign a score (0-100) for {scoreTeam?.team_name}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <Label htmlFor="score">Score (out of 100)</Label>
                  <Input
                    id="score"
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={scoreValue}
                    onChange={(e) => setScoreValue(e.target.value)}
                    placeholder="Enter score..."
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Current score: {scoreTeam?.total_score || 0}/100
                  </p>
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowScoreDialog(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={handleSaveScore}
                  className="bg-yellow-500 hover:bg-yellow-600"
                >
                  Save Score
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

// Teams Table Component
const TeamsTable = ({ teams, onViewDetails, onEditScore, isFinalized }: { teams: Team[]; onViewDetails: (teamId: number) => void; onEditScore: (team: Team) => void; isFinalized: boolean }) => {
  const getStatusIcon = (status: string) => {
    if (status === 'submitted' || status === 'judged' || status === 'winner') {
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    } else if (status === 'disqualified') {
      return <XCircle className="h-4 w-4 text-red-500" />;
    }
    return <Clock className="h-4 w-4 text-blue-500" />;
  };

  return (
    <Card className="glass-card">
      <CardContent className="p-6">
        {teams.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No teams found
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Team Name</TableHead>
                <TableHead>Team Code</TableHead>
                <TableHead>Leader</TableHead>
                <TableHead>Members</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Registered</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {teams.map((team) => (
                <TableRow key={team.team_id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(team.status)}
                      {team.team_name}
                    </div>
                  </TableCell>
                  <TableCell>{team.team_code}</TableCell>
                  <TableCell>
                    <div>{team.leader_name}</div>
                    <div className="text-xs text-muted-foreground">{team.leader_email}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      <Users className="w-3 h-3 mr-1" />
                      {team.member_count}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={
                      team.status === 'submitted' ? 'bg-success' :
                      team.status === 'winner' ? 'bg-yellow-500' :
                      team.status === 'judged' ? 'bg-blue-600' :
                      'bg-blue-500'
                    }>
                      {team.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm">
                    {new Date(team.registration_date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {team.total_score ? (
                      <span className="font-semibold text-yellow-500">{team.total_score}/100</span>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onViewDetails(team.team_id)}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                      {(team.status === 'submitted' || team.status === 'judged' || team.status === 'winner') && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onEditScore(team)}
                          disabled={isFinalized}
                          className={`bg-yellow-500/10 hover:bg-yellow-500/20 border-yellow-500/50 ${isFinalized ? 'opacity-50 cursor-not-allowed' : ''}`}
                          title={isFinalized ? 'Leaderboard is finalized. Scores cannot be edited.' : 'Edit team score'}
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          Score
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

// Team Details Modal Component
const TeamDetailsModal = ({ 
  team, 
  submission,
  loading,
  onClose 
}: { 
  team: Team; 
  submission: Submission | null;
  loading?: boolean;
  onClose: () => void;
}) => {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="glass-card max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl">{team.team_name}</CardTitle>
              <CardDescription>Team Code: {team.team_code}</CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              ✕
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Team Info */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Team Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Team Leader</p>
                <p className="font-medium">{team.leader_name}</p>
                <p className="text-sm text-muted-foreground">{team.leader_email}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <Badge className={
                  team.status === 'submitted' ? 'bg-success' :
                  team.status === 'winner' ? 'bg-yellow-500' :
                  team.status === 'judged' ? 'bg-blue-600' :
                  'bg-blue-500'
                }>
                  {team.status}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Registration Date</p>
                <p>{new Date(team.registration_date).toLocaleString()}</p>
              </div>
              {team.total_score && (
                <div>
                  <p className="text-sm text-muted-foreground">Total Score</p>
                  <p className="text-2xl font-bold text-yellow-500">{team.total_score}</p>
                </div>
              )}
            </div>
            {team.description && (
              <div className="mt-4">
                <p className="text-sm text-muted-foreground">Description</p>
                <p>{team.description}</p>
              </div>
            )}
          </div>

          {/* Team Members */}
          {team.members && team.members.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Team Members ({team.members.length})</h3>
              <div className="space-y-2">
                {team.members.map((member) => (
                  <div key={member.member_id} className="flex items-center justify-between p-3 glass-card rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium">
                        {member.full_name}
                        {member.is_leader && (
                          <Badge variant="outline" className="ml-2 text-yellow-500 border-yellow-500">Leader</Badge>
                        )}
                      </p>
                      <p className="text-sm text-muted-foreground">{member.email}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Project Submission */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Project Submission</h3>
            {loading ? (
              <p className="text-center text-muted-foreground py-4">Loading...</p>
            ) : submission ? (
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Project Title</p>
                  <p className="font-semibold text-lg">{submission.submission_title}</p>
                </div>
                {submission.description && (
                  <div>
                    <p className="text-sm text-muted-foreground">Project Description</p>
                    <p>{submission.description}</p>
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {submission.project_zip_url && (
                    <a 
                      href={submission.project_zip_url} 
                      download
                      className="flex items-center gap-2 p-3 glass-card rounded-lg hover:bg-accent transition-colors"
                    >
                      <FileText className="w-4 h-4 text-blue-500" />
                      <span>Download Project ZIP</span>
                    </a>
                  )}
                  {submission.github_url && (
                    <a 
                      href={submission.github_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 p-3 glass-card rounded-lg hover:bg-accent transition-colors"
                    >
                      <FileText className="w-4 h-4 text-blue-500" />
                      <span>GitHub Repository</span>
                    </a>
                  )}
                  {submission.demo_url && (
                    <a 
                      href={submission.demo_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 p-3 glass-card rounded-lg hover:bg-accent transition-colors"
                    >
                      <FileText className="w-4 h-4 text-green-500" />
                      <span>Live Demo</span>
                    </a>
                  )}
                  {submission.video_url && (
                    <a 
                      href={submission.video_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 p-3 glass-card rounded-lg hover:bg-accent transition-colors"
                    >
                      <FileText className="w-4 h-4 text-red-500" />
                      <span>Demo Video</span>
                    </a>
                  )}
                  {submission.documentation_url && (
                    <a 
                      href={submission.documentation_url} 
                      download
                      className="flex items-center gap-2 p-3 glass-card rounded-lg hover:bg-accent transition-colors"
                    >
                      <FileText className="w-4 h-4 text-purple-500" />
                      <span>Download Report</span>
                    </a>
                  )}
                </div>
                <div className="pt-2 border-t border-border/50">
                  <p className="text-xs text-muted-foreground">
                    Submitted on {new Date(submission.submitted_at).toLocaleString()}
                  </p>
                </div>
              </div>
            ) : (
              <div className="glass-card p-4 rounded-lg text-center">
                <p className="text-muted-foreground">No submission yet</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HackathonDetailsAdmin;
