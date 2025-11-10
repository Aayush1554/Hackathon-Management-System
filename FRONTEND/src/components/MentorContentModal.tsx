import { useState, useEffect } from 'react';
import { teamAPI } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Calendar, User, Mail, Phone, Building } from 'lucide-react';
import ChatInterface from './ChatInterface';

interface Meeting {
  meeting_id: number;
  meeting_title: string;
  meeting_link: string;
  meeting_date: string;
  description: string;
}

interface Communication {
  communication_id: number;
  sender_type: 'mentor' | 'team';
  message_text: string;
  file_url: string | null;
  file_name: string | null;
  created_at: string;
}

interface Mentor {
  user_id: number;
  full_name: string;
  email: string;
  phone?: string;
  organization?: string;
}

interface MentorContentModalProps {
  open: boolean;
  onClose: () => void;
  teamId: number;
}

function MentorContentModal({ open, onClose, teamId }: MentorContentModalProps) {
  const { user } = useAuth();
  const [mentor, setMentor] = useState<Mentor | null>(null);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [communications, setCommunications] = useState<Communication[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (open && teamId) {
      loadMentorData();
    }
  }, [open, teamId]);

  const loadMentorData = async () => {
    try {
      setLoading(true);
      const mentorResponse = await teamAPI.getMentor(teamId);
      const mentorData = mentorResponse.data.data;
      setMentor(mentorData);

      if (mentorData?.user_id) {
        // Load meetings and communications in parallel once we have mentor ID
        const [meetingsResponse, commResponse] = await Promise.all([
          teamAPI.getMeetings(teamId),
          teamAPI.getCommunicationsWithMentor(teamId, mentorData.user_id)
        ]);
        
        setMeetings(meetingsResponse.data.data || []);
        setCommunications(commResponse.data.data || []);
      } else {
        setMeetings([]);
        setCommunications([]);
      }
    } catch (error: any) {
      console.error('Error loading mentor data:', error);
      if (error.response?.status !== 404) {
        toast({
          title: 'Error',
          description: 'Failed to load mentor data',
          variant: 'destructive',
        });
      }
      setMentor(null);
      setMeetings([]);
      setCommunications([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (messageText: string, file: File | null) => {
    if (!mentor) throw new Error("No mentor assigned");

    const formData = new FormData();
    formData.append('team_id', teamId.toString());
    formData.append('mentor_id', mentor.user_id.toString());
    if (messageText) {
      formData.append('message_text', messageText);
    }
    if (file) {
      formData.append('communication_file', file);
    }

    await teamAPI.sendCommunicationToMentor(teamId, formData);
    
    // Reload communications to show the new message
    await loadCommunications();
  };

  const loadCommunications = async () => {
    if (mentor?.user_id) {
      try {
        const commResponse = await teamAPI.getCommunicationsWithMentor(
          teamId,
          mentor.user_id
        );
        setCommunications(commResponse.data.data || []);
      } catch (error: any) {
        // Silently fail during auto-refresh to avoid spamming error toasts
        console.error('Error loading communications:', error);
        // Only show toast if it's a critical error (not 404 or network issues during polling)
        if (error.response?.status && error.response.status !== 404 && error.response.status < 500) {
          toast({
            title: 'Error',
            description: 'Failed to refresh messages',
            variant: 'destructive',
          });
        }
      }
    }
  };

  const handleReaction = async (communicationId: number, emoji: string) => {
    try {
      await teamAPI.addReaction(communicationId, emoji);
      // Refresh messages to show updated reactions
      await loadCommunications();
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
      await teamAPI.deleteMessageForMe(communicationId);
      await loadCommunications();
    } catch (error: any) {
      throw error; // Let ChatInterface handle the error display
    }
  };

  const handleDeleteForEveryone = async (communicationId: number) => {
    try {
      await teamAPI.deleteMessageForEveryone(communicationId);
      await loadCommunications();
    } catch (error: any) {
      throw error; // Let ChatInterface handle the error display
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="glass-card max-w-5xl h-[90vh] flex flex-col overflow-hidden">
        <DialogHeader className="flex-shrink-0 pb-2">
          <DialogTitle className="text-xl">
            Mentor & Communication
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Loading...</p>
          </div>
        ) : !mentor ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No mentor assigned yet</p>
          </div>
        ) : (
          <Tabs defaultValue="chat" className="w-full flex flex-col flex-1 min-h-0 overflow-hidden">
            <TabsList className="grid w-full grid-cols-3 flex-shrink-0 h-10">
              <TabsTrigger value="chat" className="text-sm">Chat</TabsTrigger>
              <TabsTrigger value="meetings" className="text-sm">Meetings</TabsTrigger>
              <TabsTrigger value="info" className="text-sm">Mentor Info</TabsTrigger>
            </TabsList>

            <TabsContent value="chat" className="mt-2 flex-1 min-h-0 overflow-hidden">
              <ChatInterface
                messages={communications}
                onSendMessage={handleSendMessage}
                onReactToMessage={handleReaction}
                onDeleteForMe={handleDeleteForMe}
                onDeleteForEveryone={handleDeleteForEveryone}
                currentUserType="team"
                currentUserId={user?.user_id}
                otherPartyName={mentor.full_name}
                isLoading={loading}
                onRefresh={loadCommunications}
                pollingInterval={3000}
              />
            </TabsContent>

            <TabsContent value="meetings" className="mt-2 space-y-4 overflow-y-auto flex-1 min-h-0 scrollbar-thin">
              {meetings.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                  <p className="text-muted-foreground">No meetings scheduled yet</p>
                </div>
              ) : (
                meetings.map((meeting) => (
                  <Card key={meeting.meeting_id}>
                    <CardHeader>
                      <CardTitle className="text-lg">{meeting.meeting_title}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(meeting.meeting_date).toLocaleString()}</span>
                      </div>
                      {meeting.description && (
                        <p className="text-sm text-muted-foreground">{meeting.description}</p>
                      )}
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => window.open(meeting.meeting_link, '_blank')}
                      >
                        Join Meeting
                      </Button>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>

            <TabsContent value="info" className="mt-2 overflow-y-auto flex-1 min-h-0 scrollbar-thin">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Mentor Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Name</p>
                    <p className="font-semibold">{mentor.full_name}</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <p className="text-sm">{mentor.email}</p>
                    </div>
                  </div>
                  {mentor.phone && (
                    <div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-muted-foreground" />
                        <p className="text-sm">{mentor.phone}</p>
                      </div>
                    </div>
                  )}
                  {mentor.organization && (
                    <div>
                      <div className="flex items-center gap-2">
                        <Building className="w-4 h-4 text-muted-foreground" />
                        <p className="text-sm">{mentor.organization}</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  );
}

export { MentorContentModal };
export default MentorContentModal;
