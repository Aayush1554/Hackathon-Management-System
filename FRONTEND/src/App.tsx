import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import TeamLogin from "./pages/TeamLogin";
import MentorLogin from "./pages/MentorLogin";
import AdminLogin from "./pages/AdminLogin";
import TeamRegistration from "./pages/TeamRegistration";
import Hackathons from "./pages/Hackathons";
import HackathonDetails from "./pages/HackathonDetails";
import TeamDashboard from "./pages/TeamDashboard";
import MentorDashboard from "./pages/MentorDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Leaderboard from "./pages/Leaderboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login/team" element={<TeamLogin />} />
          <Route path="/login/mentor" element={<MentorLogin />} />
          <Route path="/login/admin" element={<AdminLogin />} />
          <Route path="/register/team" element={<TeamRegistration />} />
          <Route path="/hackathons" element={<Hackathons />} />
          <Route path="/hackathon/:id" element={<HackathonDetails />} />
          <Route path="/team/dashboard" element={<TeamDashboard />} />
          <Route path="/mentor/dashboard" element={<MentorDashboard />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
