import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Navbar from "@/components/Navbar";
import { useAutoRefresh } from "@/hooks/use-auto-refresh";
import { Plus, Edit, Trash2, X, Eye, Users } from "lucide-react";
import { hackathonAPI } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface Hackathon {
  hackathon_id: number;
  title: string;
  category: string;
  description: string;
  detailed_description?: string;
  prize_pool?: number;
  first_prize?: number;
  second_prize?: number;
  third_prize?: number;
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
  status: string;
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, isAdmin, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [hackathons, setHackathons] = useState<Hackathon[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    category: "Technology",
    description: "",
    detailed_description: "",
    prize_pool: "",
    first_prize: "",
    second_prize: "",
    third_prize: "",
    registration_start_date: "",
    registration_end_date: "",
    development_start_date: "",
    development_end_date: "",
    submission_deadline: "",
    min_team_size: "1",
    max_team_size: "5",
    rules: "",
    judging_criteria: "",
    is_online: true,
    location: "",
    status: "upcoming"
  });

  useEffect(() => {
    // Wait for auth to finish loading before checking authentication
    if (authLoading) return;
    
    if (!user || !isAdmin) {
      toast({
        title: "Access Denied",
        description: "You must be logged in as admin to access this page.",
        variant: "destructive"
      });
      navigate("/admin/login");
      return;
    }
    fetchHackathons();
  }, [user, isAdmin, navigate, authLoading]);

  const fetchHackathons = async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      const response = await hackathonAPI.getAll();
      // API returns axios response with data: { success: true, count: X, data: [...] }
      const hackathonsData = response.data.data || response.data || [];
      setHackathons(Array.isArray(hackathonsData) ? hackathonsData : []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to fetch hackathons",
        variant: "destructive"
      });
      setHackathons([]);
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  // Auto-refresh every 1 second for real-time updates (silent refresh)
  useAutoRefresh({
    enabled: true,
    interval: 1000, // 1 second
    onRefresh: () => fetchHackathons(false) // false = no loading spinner
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const payload = {
        ...formData,
        prize_pool: formData.prize_pool ? Number(formData.prize_pool) : undefined,
        first_prize: formData.first_prize ? Number(formData.first_prize) : undefined,
        second_prize: formData.second_prize ? Number(formData.second_prize) : undefined,
        third_prize: formData.third_prize ? Number(formData.third_prize) : undefined,
        min_team_size: Number(formData.min_team_size),
        max_team_size: Number(formData.max_team_size)
      };

      if (editingId) {
        await hackathonAPI.update(editingId, payload);
        toast({
          title: "Success",
          description: "Hackathon updated successfully"
        });
      } else {
        await hackathonAPI.create(payload);
        toast({
          title: "Success",
          description: "Hackathon created successfully"
        });
      }
      
      resetForm();
      fetchHackathons();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to save hackathon",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (hackathon: Hackathon) => {
    setEditingId(hackathon.hackathon_id);
    setFormData({
      title: hackathon.title,
      category: hackathon.category,
      description: hackathon.description,
      detailed_description: hackathon.detailed_description || "",
      prize_pool: hackathon.prize_pool?.toString() || "",
      first_prize: hackathon.first_prize?.toString() || "",
      second_prize: hackathon.second_prize?.toString() || "",
      third_prize: hackathon.third_prize?.toString() || "",
      registration_start_date: hackathon.registration_start_date.slice(0, 16),
      registration_end_date: hackathon.registration_end_date.slice(0, 16),
      development_start_date: hackathon.development_start_date.slice(0, 16),
      development_end_date: hackathon.development_end_date.slice(0, 16),
      submission_deadline: hackathon.submission_deadline.slice(0, 16),
      min_team_size: hackathon.min_team_size.toString(),
      max_team_size: hackathon.max_team_size.toString(),
      rules: hackathon.rules || "",
      judging_criteria: hackathon.judging_criteria || "",
      is_online: hackathon.is_online,
      location: hackathon.location || "",
      status: hackathon.status
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this hackathon?")) return;
    
    try {
      await hackathonAPI.delete(id);
      toast({
        title: "Success",
        description: "Hackathon deleted successfully"
      });
      fetchHackathons();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to delete hackathon",
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({
      title: "",
      category: "Technology",
      description: "",
      detailed_description: "",
      prize_pool: "",
      first_prize: "",
      second_prize: "",
      third_prize: "",
      registration_start_date: "",
      registration_end_date: "",
      development_start_date: "",
      development_end_date: "",
      submission_deadline: "",
      min_team_size: "1",
      max_team_size: "5",
      rules: "",
      judging_criteria: "",
      is_online: true,
      location: "",
      status: "upcoming"
    });
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
              <p className="text-muted-foreground">Manage hackathons - {user?.email}</p>
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={() => window.location.href = '/admin/mentors'} 
                variant="outline"
                className="border-blue-500 text-blue-700"
              >
                <Users className="mr-2 w-4 h-4" />
                Manage Mentors
              </Button>
              <Button onClick={() => setShowForm(true)} className="bg-success hover:bg-success/90">
                <Plus className="mr-2 w-4 h-4" />
                Add New Hackathon
              </Button>
            </div>
          </div>

          {showForm && (
            <Card className="glass-card p-6 mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">
                  {editingId ? "Edit Hackathon" : "Create New Hackathon"}
                </h2>
                <Button onClick={resetForm} variant="ghost" size="icon">
                  <X className="w-4 h-4" />
                </Button>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-background border rounded-md"
                      required
                    >
                      <option value="Technology">Technology</option>
                      <option value="AI/ML">AI/ML</option>
                      <option value="Web Development">Web Development</option>
                      <option value="Mobile Development">Mobile Development</option>
                      <option value="Blockchain">Blockchain</option>
                      <option value="IoT">IoT</option>
                      <option value="Healthcare">Healthcare</option>
                      <option value="Education">Education</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Short Description *</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="detailed_description">Detailed Description</Label>
                  <Textarea
                    id="detailed_description"
                    name="detailed_description"
                    value={formData.detailed_description}
                    onChange={handleInputChange}
                    rows={5}
                  />
                </div>

                <div className="grid md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="prize_pool">Prize Pool ($)</Label>
                    <Input
                      id="prize_pool"
                      name="prize_pool"
                      type="number"
                      value={formData.prize_pool}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="first_prize">1st Prize ($)</Label>
                    <Input
                      id="first_prize"
                      name="first_prize"
                      type="number"
                      value={formData.first_prize}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="second_prize">2nd Prize ($)</Label>
                    <Input
                      id="second_prize"
                      name="second_prize"
                      type="number"
                      value={formData.second_prize}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="third_prize">3rd Prize ($)</Label>
                    <Input
                      id="third_prize"
                      name="third_prize"
                      type="number"
                      value={formData.third_prize}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="registration_start_date">Registration Start *</Label>
                    <Input
                      id="registration_start_date"
                      name="registration_start_date"
                      type="datetime-local"
                      value={formData.registration_start_date}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="registration_end_date">Registration End *</Label>
                    <Input
                      id="registration_end_date"
                      name="registration_end_date"
                      type="datetime-local"
                      value={formData.registration_end_date}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="development_start_date">Development Start *</Label>
                    <Input
                      id="development_start_date"
                      name="development_start_date"
                      type="datetime-local"
                      value={formData.development_start_date}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="development_end_date">Development End *</Label>
                    <Input
                      id="development_end_date"
                      name="development_end_date"
                      type="datetime-local"
                      value={formData.development_end_date}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="submission_deadline">Submission Deadline *</Label>
                    <Input
                      id="submission_deadline"
                      name="submission_deadline"
                      type="datetime-local"
                      value={formData.submission_deadline}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="min_team_size">Min Team Size *</Label>
                    <Input
                      id="min_team_size"
                      name="min_team_size"
                      type="number"
                      min="1"
                      value={formData.min_team_size}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="max_team_size">Max Team Size *</Label>
                    <Input
                      id="max_team_size"
                      name="max_team_size"
                      type="number"
                      min="1"
                      value={formData.max_team_size}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="status">Status *</Label>
                    <select
                      id="status"
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-background border rounded-md"
                      required
                    >
                      <option value="upcoming">Upcoming</option>
                      <option value="ongoing">Ongoing</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="rules">Rules</Label>
                  <Textarea
                    id="rules"
                    name="rules"
                    value={formData.rules}
                    onChange={handleInputChange}
                    rows={4}
                    placeholder="Enter rules, one per line..."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="judging_criteria">Judging Criteria</Label>
                  <Textarea
                    id="judging_criteria"
                    name="judging_criteria"
                    value={formData.judging_criteria}
                    onChange={handleInputChange}
                    rows={4}
                    placeholder="Enter judging criteria..."
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    id="is_online"
                    name="is_online"
                    type="checkbox"
                    checked={formData.is_online}
                    onChange={handleInputChange}
                    className="w-4 h-4"
                  />
                  <Label htmlFor="is_online">Online Hackathon</Label>
                </div>

                {!formData.is_online && (
                  <div>
                    <Label htmlFor="location">Event Location/Address *</Label>
                    <Input
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      placeholder="e.g., New York Convention Center, 123 Main St"
                      required={!formData.is_online}
                    />
                  </div>
                )}

                <div className="flex gap-2">
                  <Button type="submit" className="bg-success hover:bg-success/90">
                    {editingId ? "Update Hackathon" : "Create Hackathon"}
                  </Button>
                  <Button type="button" onClick={resetForm} variant="outline">
                    Cancel
                  </Button>
                </div>
              </form>
            </Card>
          )}

          <Card className="glass-card p-6">
            <h2 className="text-2xl font-bold mb-6">All Hackathons</h2>
            {loading ? (
              <p className="text-center text-muted-foreground py-8">Loading...</p>
            ) : hackathons.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No hackathons found. Create your first hackathon!</p>
            ) : (
              <div className="space-y-4">
                {hackathons.map((hackathon) => (
                  <div key={hackathon.hackathon_id} className="glass-card p-4 rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-1">{hackathon.title}</h3>
                        <p className="text-sm text-muted-foreground mb-2">{hackathon.description}</p>
                        <div className="flex gap-2 flex-wrap">
                          <Badge variant="outline">{hackathon.category}</Badge>
                          <Badge 
                            variant="secondary" 
                            className={
                              hackathon.status === "ongoing" ? "bg-success/20 text-success border-success/30" :
                              hackathon.status === "upcoming" ? "bg-primary/20 text-primary border-primary/30" :
                              "bg-muted"
                            }
                          >
                            {hackathon.status}
                          </Badge>
                          {hackathon.is_online && <Badge variant="outline">Online</Badge>}
                        </div>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => navigate(`/admin/hackathon/${hackathon.hackathon_id}`)}
                          className="text-primary hover:text-primary"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View Details
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => handleEdit(hackathon)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => handleDelete(hackathon.hackathon_id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-muted-foreground">
                      <div>Team Size: {hackathon.min_team_size}-{hackathon.max_team_size}</div>
                      {hackathon.prize_pool && <div>Prize: ${hackathon.prize_pool}</div>}
                      <div>Reg: {new Date(hackathon.registration_end_date).toLocaleDateString()}</div>
                      <div>Due: {new Date(hackathon.submission_deadline).toLocaleDateString()}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
