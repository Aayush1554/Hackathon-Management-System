import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Upload, Link as LinkIcon, Github, Video, FileText, Loader2 } from "lucide-react";
import { teamAPI } from "@/lib/api";

interface SubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  team: {
    team_id: number;
    team_name: string;
    hackathon_id: number;
    hackathon_title: string;
    submission_deadline?: string;
  };
  onSuccess: () => void;
}

export const SubmissionModal = ({ 
  isOpen, 
  onClose, 
  team,
  onSuccess 
}: SubmissionModalProps) => {
  const [formData, setFormData] = useState({
    submission_title: team.team_name + " Project",
    description: "",
    github_url: "",
    demo_url: "",
    video_url: "",
  });
  const [projectZip, setProjectZip] = useState<File | null>(null);
  const [projectReport, setProjectReport] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'zip' | 'report') => {
    const file = e.target.files?.[0];
    if (file) {
      if (type === 'zip') {
        if (!file.name.endsWith('.zip')) {
          setError("Please upload a ZIP file");
          return;
        }
        setProjectZip(file);
      } else {
        if (!file.name.match(/\.(pdf|doc|docx)$/i)) {
          setError("Please upload a PDF or Word document");
          return;
        }
        setProjectReport(file);
      }
      setError("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!projectZip) {
      setError("Project ZIP file is required");
      return;
    }
    if (!formData.github_url) {
      setError("GitHub deployed link is required");
      return;
    }

    // Check deadline
    if (team.submission_deadline && new Date() > new Date(team.submission_deadline)) {
      setError("Submission deadline has passed");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Create FormData for file upload
      const uploadData = new FormData();
      uploadData.append('team_id', team.team_id.toString());
      uploadData.append('hackathon_id', team.hackathon_id.toString());
      uploadData.append('submission_title', formData.submission_title);
      uploadData.append('description', formData.description);
      uploadData.append('github_url', formData.github_url);
      uploadData.append('demo_url', formData.demo_url || '');
      uploadData.append('video_url', formData.video_url || '');
      uploadData.append('project_zip', projectZip);
      if (projectReport) {
        uploadData.append('project_report', projectReport);
      }

      await teamAPI.submitProject(uploadData);

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to submit project");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-card border-primary/30 max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-primary">
            Submit Your Project
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            {team.team_name} - {team.hackathon_title}
          </p>
          {team.submission_deadline && (
            <p className="text-xs text-muted-foreground">
              Deadline: {new Date(team.submission_deadline).toLocaleString()}
            </p>
          )}
        </DialogHeader>

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Project Title */}
          <div className="space-y-2">
            <Label htmlFor="submission_title">
              Project Title <span className="text-red-500">*</span>
            </Label>
            <Input
              id="submission_title"
              name="submission_title"
              value={formData.submission_title}
              onChange={handleInputChange}
              placeholder="Enter your project title"
              required
              className="glass-card"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Project Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Brief description of your project"
              rows={3}
              className="glass-card resize-none"
            />
          </div>

          {/* Project ZIP File */}
          <div className="space-y-2">
            <Label htmlFor="project_zip">
              <Upload className="w-4 h-4 inline mr-1" />
              Project ZIP File <span className="text-red-500">*</span>
            </Label>
            <Input
              id="project_zip"
              type="file"
              accept=".zip"
              onChange={(e) => handleFileChange(e, 'zip')}
              required
              className="glass-card"
            />
            {projectZip && (
              <p className="text-xs text-muted-foreground">
                Selected: {projectZip.name} ({(projectZip.size / 1024 / 1024).toFixed(2)} MB)
              </p>
            )}
          </div>

          {/* Live Website Link */}
          <div className="space-y-2">
            <Label htmlFor="demo_url">
              <LinkIcon className="w-4 h-4 inline mr-1" />
              Live Website Link (Optional)
            </Label>
            <Input
              id="demo_url"
              name="demo_url"
              type="url"
              value={formData.demo_url}
              onChange={handleInputChange}
              placeholder="https://your-project-demo.com"
              className="glass-card"
            />
          </div>

          {/* GitHub Deployed Link */}
          <div className="space-y-2">
            <Label htmlFor="github_url">
              <Github className="w-4 h-4 inline mr-1" />
              GitHub Deployed Link <span className="text-red-500">*</span>
            </Label>
            <Input
              id="github_url"
              name="github_url"
              type="url"
              value={formData.github_url}
              onChange={handleInputChange}
              placeholder="https://github.com/username/repository"
              required
              className="glass-card"
            />
          </div>

          {/* Prototype Video Link */}
          <div className="space-y-2">
            <Label htmlFor="video_url">
              <Video className="w-4 h-4 inline mr-1" />
              Prototype Video Link - YouTube (Optional)
            </Label>
            <Input
              id="video_url"
              name="video_url"
              type="url"
              value={formData.video_url}
              onChange={handleInputChange}
              placeholder="https://www.youtube.com/watch?v=..."
              className="glass-card"
            />
          </div>

          {/* Project Report */}
          <div className="space-y-2">
            <Label htmlFor="project_report">
              <FileText className="w-4 h-4 inline mr-1" />
              Project Report (Optional - PDF/Word)
            </Label>
            <Input
              id="project_report"
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={(e) => handleFileChange(e, 'report')}
              className="glass-card"
            />
            {projectReport && (
              <p className="text-xs text-muted-foreground">
                Selected: {projectReport.name} ({(projectReport.size / 1024 / 1024).toFixed(2)} MB)
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 bg-primary hover:bg-primary-glow text-primary-foreground"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Project"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
