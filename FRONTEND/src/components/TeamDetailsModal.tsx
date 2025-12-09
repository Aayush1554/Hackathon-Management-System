import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Users, Mail, Building, ExternalLink } from "lucide-react";

interface TeamMember {
  user_id: number;
  full_name: string;
  email: string;
  organization?: string;
  phone?: string;
  is_leader: boolean;
  role?: string;
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

interface TeamDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  team: {
    team_id: number;
    team_name: string;
    hackathon_title: string;
    team_code?: string;
    status: string;
  };
  members: TeamMember[];
  submission?: Submission | null;
  loading?: boolean;
}

export const TeamDetailsModal = ({ 
  isOpen, 
  onClose, 
  team, 
  members, 
  submission,
  loading = false 
}: TeamDetailsModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-card border-primary/30 max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-primary">
            {team.team_name}
          </DialogTitle>
          <div className="flex items-center gap-2 mt-2">
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
            {team.team_code && (
              <span className="text-sm font-mono text-muted-foreground">
                Code: {team.team_code}
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground">{team.hackathon_title}</p>
        </DialogHeader>

        {loading ? (
          <div className="py-8 text-center text-muted-foreground">Loading team details...</div>
        ) : (
          <div className="space-y-6 mt-4">
            {/* Team Members Section */}
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                Team Members ({members.length})
              </h3>
              <div className="space-y-3">
                {members.map((member) => (
                  <div 
                    key={member.user_id} 
                    className="glass-card p-4 rounded-lg"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold">
                            {member.full_name ? 
                              member.full_name.replace(/\s+0+\s*$/, '').replace(/\n0+$/, '').trimEnd() 
                              : member.full_name}
                          </h4>
                          {member.is_leader && (
                            <Badge variant="secondary" className="bg-primary/20 text-primary border-primary/30 text-xs">
                              Leader
                            </Badge>
                          )}
                        </div>
                        <div className="space-y-1 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Mail className="w-3.5 h-3.5" />
                            <span>{member.email}</span>
                          </div>
                          {member.organization && (
                            <div className="flex items-center gap-2">
                              <Building className="w-3.5 h-3.5" />
                              <span>{member.organization}</span>
                            </div>
                          )}
                          {member.phone && (
                            <div className="text-xs">
                              Phone: {member.phone}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Submission Section */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Project Submission</h3>
              {submission ? (
                <div className="glass-card p-4 rounded-lg space-y-3">
                  <div>
                    <h4 className="font-semibold text-primary mb-1">{submission.submission_title}</h4>
                    {submission.description && (
                      <p className="text-sm text-muted-foreground">{submission.description}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    {submission.project_zip_url && (
                      <div className="flex items-center gap-2">
                        <ExternalLink className="w-4 h-4 text-primary" />
                        <a 
                          href={submission.project_zip_url} 
                          download
                          className="text-sm text-primary hover:underline"
                        >
                          Download Project ZIP
                        </a>
                      </div>
                    )}
                    {submission.github_url && (
                      <div className="flex items-center gap-2">
                        <ExternalLink className="w-4 h-4 text-primary" />
                        <a 
                          href={submission.github_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm text-primary hover:underline"
                        >
                          GitHub Repository
                        </a>
                      </div>
                    )}
                    {submission.demo_url && (
                      <div className="flex items-center gap-2">
                        <ExternalLink className="w-4 h-4 text-primary" />
                        <a 
                          href={submission.demo_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm text-primary hover:underline"
                        >
                          Live Demo
                        </a>
                      </div>
                    )}
                    {submission.video_url && (
                      <div className="flex items-center gap-2">
                        <ExternalLink className="w-4 h-4 text-primary" />
                        <a 
                          href={submission.video_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm text-primary hover:underline"
                        >
                          Prototype Video
                        </a>
                      </div>
                    )}
                    {submission.documentation_url && (
                      <div className="flex items-center gap-2">
                        <ExternalLink className="w-4 h-4 text-primary" />
                        <a 
                          href={submission.documentation_url} 
                          download
                          className="text-sm text-primary hover:underline"
                        >
                          Download Project Report
                        </a>
                      </div>
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
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
