import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { teamAPI } from "@/lib/api";
import { toast } from "sonner";
import { X, Plus, Trash2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface TeamRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  hackathon: any;
  onSuccess?: () => void;
}

const TeamRegistrationModal = ({ isOpen, onClose, hackathon, onSuccess }: TeamRegistrationModalProps) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    team_name: "",
    description: "",
  });
  
  const [teamMembers, setTeamMembers] = useState<Array<{name: string, email: string}>>([]);
  const [currentMember, setCurrentMember] = useState({ name: "", email: "" });

  // Calculate how many more members can be added
  const currentTeamSize = teamMembers.length + 1; // +1 for leader
  const minSize = hackathon?.min_team_size || 2;
  const maxSize = hackathon?.max_team_size || 5;
  const canAddMore = currentTeamSize < maxSize;
  const isValidSize = currentTeamSize >= minSize && currentTeamSize <= maxSize;

  useEffect(() => {
    if (isOpen) {
      // Reset form when modal opens
      setFormData({ team_name: "", description: "" });
      setTeamMembers([]);
      setCurrentMember({ name: "", email: "" });
    }
  }, [isOpen]);

  const handleAddMember = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!currentMember.name.trim()) {
      toast.error("Please enter member name");
      return;
    }
    
    if (!currentMember.email.trim()) {
      toast.error("Please enter an email address");
      return;
    }

    if (!emailRegex.test(currentMember.email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    if (currentMember.email.toLowerCase() === user?.email?.toLowerCase()) {
      toast.error("You cannot add yourself as a team member");
      return;
    }

    if (teamMembers.some(m => m.email.toLowerCase() === currentMember.email.toLowerCase())) {
      toast.error("This email is already added");
      return;
    }

    if (!canAddMore) {
      toast.error(`Maximum team size is ${maxSize} members`);
      return;
    }

    setTeamMembers([...teamMembers, { name: currentMember.name, email: currentMember.email.toLowerCase() }]);
    setCurrentMember({ name: "", email: "" });
  };

  const handleRemoveMember = (index: number) => {
    setTeamMembers(teamMembers.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.team_name.trim()) {
      toast.error("Team name is required");
      return;
    }

    if (!isValidSize) {
      toast.error(`Team must have between ${minSize} and ${maxSize} members (including you)`);
      return;
    }

    try {
      setLoading(true);

      // Extract emails and names from teamMembers array
      const member_emails = teamMembers.map(m => m.email);
      const member_names = teamMembers.map(m => m.name);

      const teamData = {
        team_name: formData.team_name,
        hackathon_id: hackathon.hackathon_id,
        description: formData.description,
        member_emails,
        member_names,
      };

      await teamAPI.create(teamData);

      toast.success("Team registered successfully!");
      onClose();
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      console.error("Team registration error:", error);
      console.error("Error response:", error.response);
      console.error("Error data:", error.response?.data);
      
      const errorMessage = error.response?.data?.message || error.message || "Failed to register team";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Register Team for {hackathon?.title}</DialogTitle>
          <DialogDescription>
            Create your team for this hackathon. Team size: {minSize}-{maxSize} members
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          {/* Team Name */}
          <div className="space-y-2">
            <Label htmlFor="team_name">Team Name *</Label>
            <Input
              id="team_name"
              placeholder="Enter your team name"
              value={formData.team_name}
              onChange={(e) => setFormData({ ...formData, team_name: e.target.value })}
              required
            />
          </div>

          {/* Team Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Team Description (Optional)</Label>
            <Textarea
              id="description"
              placeholder="Tell us about your team..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
            />
          </div>

          {/* Team Leader Info */}
          <div className="glass-card p-4 rounded-lg">
            <h3 className="font-semibold mb-3">Team Leader (You)</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Name:</span>
                <span className="font-medium">{user?.full_name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Email:</span>
                <span className="font-medium">{user?.email}</span>
              </div>
            </div>
          </div>

          {/* Team Members */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Team Members {teamMembers.length > 0 && `(${teamMembers.length})`}</Label>
              <span className="text-xs text-muted-foreground">
                Current: {currentTeamSize}/{maxSize} | Min: {minSize}
              </span>
            </div>

            {/* Add Member Name and Email */}
            <div className="flex gap-2">
              <Input
                placeholder="Member name"
                value={currentMember.name}
                onChange={(e) => setCurrentMember({ ...currentMember, name: e.target.value })}
                disabled={!canAddMore}
                className="flex-1"
              />
              <Input
                placeholder="Member email"
                value={currentMember.email}
                onChange={(e) => setCurrentMember({ ...currentMember, email: e.target.value })}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddMember();
                  }
                }}
                disabled={!canAddMore}
                className="flex-1"
              />
              <Button
                type="button"
                onClick={handleAddMember}
                disabled={!canAddMore}
                variant="outline"
                size="icon"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            {/* Member List */}
            {teamMembers.length > 0 && (
              <div className="space-y-2 glass-card p-3 rounded-lg">
                {teamMembers.map((member, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 bg-background/50 rounded"
                  >
                    <div className="flex flex-col flex-1">
                      <span className="text-sm font-medium">{member.name}</span>
                      <span className="text-xs text-muted-foreground">{member.email}</span>
                    </div>
                    <Button
                      type="button"
                      onClick={() => handleRemoveMember(index)}
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {!isValidSize && (
              <p className="text-sm text-destructive">
                {currentTeamSize < minSize
                  ? `You need at least ${minSize - currentTeamSize} more member(s)`
                  : `You can only have up to ${maxSize} members`}
              </p>
            )}
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-primary hover:bg-primary-glow"
              disabled={loading || !isValidSize}
            >
              {loading ? "Registering..." : "Register Team"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TeamRegistrationModal;
