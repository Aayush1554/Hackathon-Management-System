import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { mentorAPI, teamAPI } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Navbar from '@/components/Navbar';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Pencil, Trash2, UserPlus, Users, ArrowLeft, Eye } from 'lucide-react';

interface Mentor {
  user_id: number;
  full_name: string;
  email: string;
  phone?: string;
  organization?: string;
  bio?: string;
}

interface Team {
  team_id: number;
  team_name: string;
  team_code: string;
  hackathon_title: string;
  leader_name: string;
  leader_email: string;
  member_count: number;
  mentor_name?: string;
  mentor_id?: number;
  submission_deadline?: string;
}

interface MentorDetails extends Mentor {
  assignedTeams?: Team[];
}

export default function MentorManagement() {
  const navigate = useNavigate();
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
  const [mentorDetails, setMentorDetails] = useState<MentorDetails | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
  });

  const [assignData, setAssignData] = useState({
    mentor_id: 0,
    team_id: 0,
  });

  useEffect(() => {
    loadMentors();
  }, []);

  const loadMentors = async () => {
    try {
      setLoading(true);
      const response = await mentorAPI.getAll();
      setMentors(response.data.data || []);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to load mentors',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const loadTeamsForAssignment = async () => {
    try {
      const response = await teamAPI.getAll();
      setTeams(response.data.data || []);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to load teams',
        variant: 'destructive',
      });
    }
  };

  const handleAddMentor = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await mentorAPI.create(formData);
      toast({
        title: 'Success',
        description: 'Mentor added successfully',
      });
      setShowAddModal(false);
      setFormData({ full_name: '', email: '', password: '' });
      loadMentors();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to add mentor',
        variant: 'destructive',
      });
    }
  };

  const handleEditMentor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMentor) return;

    try {
      await mentorAPI.update(selectedMentor.user_id, formData);
      toast({
        title: 'Success',
        description: 'Mentor updated successfully',
      });
      setShowEditModal(false);
      setSelectedMentor(null);
      setFormData({ full_name: '', email: '', password: '' });
      loadMentors();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to update mentor',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteMentor = async (mentorId: number) => {
    if (!confirm('Are you sure you want to delete this mentor?')) return;

    try {
      await mentorAPI.delete(mentorId);
      toast({
        title: 'Success',
        description: 'Mentor deleted successfully',
      });
      loadMentors();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to delete mentor',
        variant: 'destructive',
      });
    }
  };

  const handleAssignMentor = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Transform to match backend expected format (camelCase)
      await mentorAPI.assignToTeam({
        mentorId: assignData.mentor_id,
        teamId: assignData.team_id
      });
      toast({
        title: 'Success',
        description: 'Mentor assigned to team successfully',
      });
      setShowAssignModal(false);
      setAssignData({ mentor_id: 0, team_id: 0 });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to assign mentor',
        variant: 'destructive',
      });
    }
  };

  const openEditModal = (mentor: Mentor) => {
    setSelectedMentor(mentor);
    setFormData({
      full_name: mentor.full_name,
      email: mentor.email,
      password: '',
    });
    setShowEditModal(true);
  };

  const openAssignModal = () => {
    loadTeamsForAssignment();
    setShowAssignModal(true);
  };

  const openDetailsModal = async (mentor: Mentor) => {
    setShowDetailsModal(true);
    setLoadingDetails(true);
    setMentorDetails(null);
    
    try {
      const response = await mentorAPI.getById(mentor.user_id);
      setMentorDetails(response.data.data);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to load mentor details',
        variant: 'destructive',
      });
      setShowDetailsModal(false);
    } finally {
      setLoadingDetails(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="pt-24 pb-12 px-4">
        <div className="container mx-auto">
          {/* Back Button */}
          <Button 
            variant="ghost" 
            onClick={() => navigate('/admin/dashboard')}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>

          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-2">Mentor Management</h1>
              <p className="text-muted-foreground">Manage mentors and assign them to teams</p>
            </div>
            <div className="flex gap-2">
              <Button onClick={openAssignModal} variant="outline" className="glass-card">
                <Users className="mr-2 h-4 w-4" />
                Assign to Team
              </Button>
              <Button onClick={() => setShowAddModal(true)} className="bg-success hover:bg-success/90">
                <UserPlus className="mr-2 h-4 w-4" />
                Add Mentor
              </Button>
            </div>
          </div>

          <div className="glass-card p-6">
            {loading ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Loading mentors...</p>
              </div>
            ) : mentors.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No mentors found. Add your first mentor!</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mentors.map((mentor) => (
                    <TableRow key={mentor.user_id}>
                      <TableCell>{mentor.user_id}</TableCell>
                      <TableCell className="font-medium">{mentor.full_name}</TableCell>
                      <TableCell>{mentor.email}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => openDetailsModal(mentor)}
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openEditModal(mentor)}
                            title="Edit Mentor"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDeleteMentor(mentor.user_id)}
                            title="Delete Mentor"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </div>
      </div>

      {/* Add Mentor Modal */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="glass-card">
          <DialogHeader>
            <DialogTitle>Add New Mentor</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddMentor}>
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowAddModal(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-success hover:bg-success/90">
                Add Mentor
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Mentor Modal */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="glass-card">
          <DialogHeader>
            <DialogTitle>Edit Mentor</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditMentor}>
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="edit-name">Name</Label>
                <Input
                  id="edit-name"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="edit-password">New Password (leave blank to keep current)</Label>
                <Input
                  id="edit-password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Leave blank to keep current password"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowEditModal(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-success hover:bg-success/90">
                Update Mentor
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Assign Mentor Modal */}
      <Dialog open={showAssignModal} onOpenChange={setShowAssignModal}>
        <DialogContent className="glass-card">
          <DialogHeader>
            <DialogTitle>Assign Mentor to Team</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAssignMentor}>
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="assign-mentor">Select Mentor</Label>
                <Select
                  value={assignData.mentor_id > 0 ? assignData.mentor_id.toString() : ""}
                  onValueChange={(value) =>
                    setAssignData({ ...assignData, mentor_id: parseInt(value) })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a mentor" />
                  </SelectTrigger>
                  <SelectContent>
                    {mentors && mentors.length > 0 ? (
                      mentors.map((mentor) => (
                        <SelectItem key={mentor.user_id} value={mentor.user_id.toString()}>
                          {mentor.full_name} ({mentor.email})
                        </SelectItem>
                      ))
                    ) : (
                      <div className="p-2 text-sm text-gray-500">No mentors available</div>
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="assign-team">Select Team</Label>
                <Select
                  value={assignData.team_id > 0 ? assignData.team_id.toString() : ""}
                  onValueChange={(value) =>
                    setAssignData({ ...assignData, team_id: parseInt(value) })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a team" />
                  </SelectTrigger>
                  <SelectContent>
                    {teams && teams.length > 0 ? (
                      teams.map((team) => (
                        <SelectItem 
                          key={team.team_id} 
                          value={team.team_id.toString()}
                          disabled={team.mentor_name ? true : false}
                        >
                          {team.team_name} - {team.hackathon_title} ({team.team_code})
                          {team.mentor_name && (
                            <span className="text-xs text-muted-foreground ml-2">
                              [Already assigned to {team.mentor_name}]
                            </span>
                          )}
                        </SelectItem>
                      ))
                    ) : (
                      <div className="p-2 text-sm text-muted-foreground">No teams available</div>
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowAssignModal(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-success hover:bg-success/90">
                Assign Mentor
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Mentor Details Modal */}
      <Dialog open={showDetailsModal} onOpenChange={setShowDetailsModal}>
        <DialogContent className="glass-card max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Mentor Details</DialogTitle>
          </DialogHeader>
          
          {loadingDetails ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading mentor details...</p>
            </div>
          ) : mentorDetails ? (
            <div className="space-y-6 py-4">
              {/* Mentor Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Mentor Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Name</p>
                      <p className="font-medium">{mentorDetails.full_name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium">{mentorDetails.email}</p>
                    </div>
                    {mentorDetails.phone && (
                      <div>
                        <p className="text-sm text-muted-foreground">Phone</p>
                        <p className="font-medium">{mentorDetails.phone}</p>
                      </div>
                    )}
                    {mentorDetails.organization && (
                      <div>
                        <p className="text-sm text-muted-foreground">Organization</p>
                        <p className="font-medium">{mentorDetails.organization}</p>
                      </div>
                    )}
                  </div>
                  {mentorDetails.bio && (
                    <div className="mt-4">
                      <p className="text-sm text-muted-foreground">Bio</p>
                      <p className="font-medium">{mentorDetails.bio}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Assigned Teams */}
              <Card>
                <CardHeader>
                  <CardTitle>Assigned Teams</CardTitle>
                  <CardDescription>
                    {mentorDetails.assignedTeams?.length || 0} team(s) assigned
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {!mentorDetails.assignedTeams || mentorDetails.assignedTeams.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">
                      No teams assigned to this mentor yet.
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {mentorDetails.assignedTeams.map((team) => (
                        <div 
                          key={team.team_id} 
                          className="p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h4 className="font-semibold text-lg">{team.team_name}</h4>
                              <p className="text-sm text-muted-foreground">
                                {team.hackathon_title}
                              </p>
                            </div>
                            <Badge variant="secondary">{team.team_code}</Badge>
                          </div>
                          <div className="grid grid-cols-2 gap-4 mt-3 text-sm">
                            <div>
                              <p className="text-muted-foreground">Team Leader</p>
                              <p className="font-medium">{team.leader_name}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Leader Email</p>
                              <p className="font-medium">{team.leader_email}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Members</p>
                              <p className="font-medium">{team.member_count} member(s)</p>
                            </div>
                            {team.submission_deadline && (
                              <div>
                                <p className="text-muted-foreground">Deadline</p>
                                <p className="font-medium">
                                  {new Date(team.submission_deadline).toLocaleDateString()}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          ) : null}
          
          <DialogFooter>
            <Button onClick={() => setShowDetailsModal(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
