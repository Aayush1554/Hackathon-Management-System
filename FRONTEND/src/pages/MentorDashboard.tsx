import { useState, useEffect } from 'react';
import { mentorAPI } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/contexts/AuthContext';
import { useAutoRefresh } from '@/hooks/use-auto-refresh';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Calendar, MessageSquare, Users, Upload, Video } from 'lucide-react';
import ChatInterface from '@/components/ChatInterface';

interface Team {
  team_id: number;
  team_name: string;
  hackathon_id: number;
  hackathon_name: string;
  team_leader_name: string;
  member_count: number;
}

interface Hackathon {
  hackathon_id: number;
  title: string;
  assigned_teams_count?: number;
}

interface Communication {
  communication_id: number;
  sender_type: 'mentor' | 'team';
  message_text: string;
  file_url: string | null;
  file_name: string | null;
  created_at: string;
}

const MentorDashboard = () => {
  const { user } = useAuth();
  const [teams, setTeams] = useState<Team[]>([]);
  const [hackathons, setHackathons] = useState<Hackathon[]>([]);
  const [selectedHackathon, setSelectedHackathon] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [showMeetingModal, setShowMeetingModal] = useState(false);
  const [showCommunicationModal, setShowCommunicationModal] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [communications, setCommunications] = useState<Communication[]>([]);
  const { toast } = useToast();

  const [meetingForm, setMeetingForm] = useState({
    team_id: 0,
    meeting_title: '',
    meeting_link: '',
    meeting_date: '',
    description: '',
  });

  const [communicationForm, setCommunicationForm] = useState({
    team_id: 0,
    message_text: '',
    file: null as File | null,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      const [teamsResponse, hackathonsResponse] = await Promise.all([
        mentorAPI.getMyTeams(),
        mentorAPI.getMyHackathons(),
      ]);
      setTeams(teamsResponse.data.data || []);
      setHackathons(hackathonsResponse.data.data || []);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to load data',
        variant: 'destructive',
      });
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  // Auto-refresh every 1 second for real-time updates (silent refresh)
  useAutoRefresh({
    enabled: true,
    interval: 1000, // 1 second
    onRefresh: () => loadData(false) // false = no loading spinner
  });

  const filteredTeams = selectedHackathon
    ? teams.filter((team) => team.hackathon_id === selectedHackathon)
    : teams;

  const handleScheduleMeeting = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await mentorAPI.scheduleMeeting(meetingForm);
      toast({
        title: 'Success',
        description: 'Meeting scheduled successfully',
      });
      setShowMeetingModal(false);
      setMeetingForm({
        team_id: 0,
        meeting_title: '',
        meeting_link: '',
        meeting_date: '',
        description: '',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to schedule meeting',
        variant: 'destructive',
      });
    }
  };

  const handleSendCommunication = async (messageText: string, file: File | null) => {
    const formData = new FormData();
    formData.append('team_id', communicationForm.team_id.toString());
    if (messageText) {
      formData.append('message_text', messageText);
    }
    if (file) {
      formData.append('communication_file', file);
    }

    await mentorAPI.sendCommunication(formData);
    
    // Reload communications
    if (selectedTeam) {
      await loadCommunications(selectedTeam.team_id);
    }
  };

  const loadCommunications = async (teamId: number) => {
    try {
      const response = await mentorAPI.getCommunications(teamId);
      setCommunications(response.data.data || []);
    } catch (error: any) {
      // Silently log errors during auto-refresh to avoid toast spam
      console.error('Failed to load communications:', error);
      // Only show toast for critical errors (not during background polling)
      if (error.response?.status && error.response.status !== 404 && error.response.status < 500) {
        toast({
          title: 'Error',
          description: 'Failed to load communications',
          variant: 'destructive',
        });
      }
    }
  };

  const openMeetingModal = (team: Team) => {
    setMeetingForm({ ...meetingForm, team_id: team.team_id });
    setShowMeetingModal(true);
  };

  const openCommunicationModal = (team: Team) => {
    setSelectedTeam(team);
    setCommunicationForm({ ...communicationForm, team_id: team.team_id });
    loadCommunications(team.team_id);
    setShowCommunicationModal(true);
  };

  const refreshCommunications = async () => {
    if (selectedTeam) {
      try {
        await loadCommunications(selectedTeam.team_id);
      } catch (error) {
        // Error already handled in loadCommunications
        console.error('Refresh communications error:', error);
      }
    }
  };

  const handleReaction = async (communicationId: number, emoji: string) => {
    try {
      await mentorAPI.addReaction(communicationId, emoji);
      // Refresh messages to show updated reactions
      await refreshCommunications();
    } catch (error) {
      console.error('Reaction error:', error);
      toast({
        title: 'Error',
        description: 'Failed to add reaction',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteForMe = async (communicationId: number) => {
    try {
      await mentorAPI.deleteMessageForMe(communicationId);
      await refreshCommunications();
    } catch (error: any) {
      throw error; // Let ChatInterface handle the error display
    }
  };

  const handleDeleteForEveryone = async (communicationId: number) => {
    try {
      await mentorAPI.deleteMessageForEveryone(communicationId);
      await refreshCommunications();
    } catch (error: any) {
      throw error; // Let ChatInterface handle the error display
    }
  };


  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="pt-24 pb-12 px-4">
        <div className="container mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-2">Mentor Dashboard</h1>
            <p className="text-muted-foreground">Manage your assigned teams and schedule meetings</p>
          </div>

          <div className="glass-card p-6 mb-6">
            <div className="mb-6">
              <Label>Filter by Hackathon</Label>
              <Select
                value={selectedHackathon?.toString() || 'all'}
                onValueChange={(value) =>
                  setSelectedHackathon(value === 'all' ? null : parseInt(value))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Hackathons" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Hackathons</SelectItem>
                  {hackathons.map((hackathon) => (
                    <SelectItem
                      key={hackathon.hackathon_id}
                      value={hackathon.hackathon_id.toString()}
                    >
                      {hackathon.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Loading teams...</p>
              </div>
            ) : filteredTeams.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No teams assigned yet</p>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredTeams.map((team) => (
                  <Card key={team.team_id} className="glass-card">
                    <CardHeader>
                      <CardTitle className="text-lg">
                        {team.team_name}
                      </CardTitle>
                      <CardDescription>
                        <Badge variant="outline" className="mb-2">
                          {team.hackathon_name}
                        </Badge>
                        <p className="text-sm mt-2">
                          Leader: {team.team_leader_name}
                        </p>
                        <p className="text-sm flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {team.member_count} members
                        </p>
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col gap-2">
                        <Button
                          size="sm"
                          onClick={() => openMeetingModal(team)}
                          className="bg-primary hover:bg-primary/90"
                        >
                          <Calendar className="mr-2 h-4 w-4" />
                          Schedule Meeting
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openCommunicationModal(team)}
                        >
                          <MessageSquare className="mr-2 h-4 w-4" />
                          Send Message
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Schedule Meeting Modal */}
      <Dialog open={showMeetingModal} onOpenChange={setShowMeetingModal}>
        <DialogContent className="glass-card">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Video className="h-5 w-5" />
              Schedule Meeting
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleScheduleMeeting}>
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="meeting-title">Meeting Title</Label>
                <Input
                  id="meeting-title"
                  value={meetingForm.meeting_title}
                  onChange={(e) =>
                    setMeetingForm({ ...meetingForm, meeting_title: e.target.value })
                  }
                  placeholder="e.g., Sprint Review Meeting"
                  required
                />
              </div>
              <div>
                <Label htmlFor="meeting-link">Google Meet Link</Label>
                <Input
                  id="meeting-link"
                  value={meetingForm.meeting_link}
                  onChange={(e) =>
                    setMeetingForm({ ...meetingForm, meeting_link: e.target.value })
                  }
                  placeholder="https://meet.google.com/..."
                  required
                />
              </div>
              <div>
                <Label htmlFor="meeting-date">Date & Time</Label>
                <Input
                  id="meeting-date"
                  type="datetime-local"
                  value={meetingForm.meeting_date}
                  onChange={(e) =>
                    setMeetingForm({ ...meetingForm, meeting_date: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={meetingForm.description}
                  onChange={(e) =>
                    setMeetingForm({ ...meetingForm, description: e.target.value })
                  }
                  placeholder="Meeting agenda or notes..."
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowMeetingModal(false)}
              >
                Cancel
              </Button>
              <Button type="submit" className="bg-success hover:bg-success/90">
                Schedule Meeting
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Communication Modal */}
      <Dialog open={showCommunicationModal} onOpenChange={setShowCommunicationModal}>
        <DialogContent className="glass-card max-w-5xl h-[90vh] flex flex-col overflow-hidden p-0">
          <DialogHeader className="flex-shrink-0 px-6 pt-6 pb-2">
            <DialogTitle className="text-xl flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Chat with {selectedTeam?.team_name}
            </DialogTitle>
          </DialogHeader>

          <div className="flex-1 min-h-0 px-6 pb-6">
            <ChatInterface
              messages={communications}
              onSendMessage={handleSendCommunication}
              onReactToMessage={handleReaction}
              onDeleteForMe={handleDeleteForMe}
              onDeleteForEveryone={handleDeleteForEveryone}
              currentUserType="mentor"
              currentUserId={user?.user_id}
              otherPartyName={selectedTeam?.team_name || ''}
              isLoading={false}
              onRefresh={refreshCommunications}
              pollingInterval={3000}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MentorDashboard;

