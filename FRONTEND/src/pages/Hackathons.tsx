import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Search, Users, Calendar, X, MapPin } from "lucide-react";
import { hackathonAPI } from "@/lib/api";

interface Hackathon {
  hackathon_id: number;
  title: string;
  category: string;
  description: string;
  prize_pool?: number | string;
  status: string;
  registration_start_date?: string;
  registration_end_date: string;
  submission_deadline: string;
  is_online: boolean;
  location?: string;
  min_team_size?: number;
  max_team_size?: number;
}

const Hackathons = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [hackathons, setHackathons] = useState<Hackathon[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filter states
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [registrationFilter, setRegistrationFilter] = useState<string>("all");
  const [modeFilter, setModeFilter] = useState<string>("all");
  const [teamSizeFilter, setTeamSizeFilter] = useState<string>("all");

  useEffect(() => {
    fetchHackathons();
  }, []);

  const fetchHackathons = async () => {
    try {
      setLoading(true);
      const response = await hackathonAPI.getAll();
      const hackathonsData = response.data.data || response.data || [];
      setHackathons(hackathonsData);
    } catch (error) {
      console.error('Failed to fetch hackathons:', error);
      setHackathons([]);
    } finally {
      setLoading(false);
    }
  };

  const calculateDaysLeft = (deadline: string) => {
    const now = new Date();
    const end = new Date(deadline);
    const diffTime = end.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return "Ended";
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "1 day left";
    return `${diffDays} days left`;
  };

  const isRegistrationOpen = (hackathon: Hackathon) => {
    const now = new Date();
    const start = hackathon.registration_start_date ? new Date(hackathon.registration_start_date) : null;
    const end = hackathon.registration_end_date ? new Date(hackathon.registration_end_date) : null;
    return start && end ? (now >= start && now <= end) : false;
  };

  const clearFilters = () => {
    setCategoryFilter("all");
    setRegistrationFilter("all");
    setModeFilter("all");
    setTeamSizeFilter("all");
    setSearchQuery("");
  };

  const hasActiveFilters = categoryFilter !== "all" || 
                          registrationFilter !== "all" || 
                          modeFilter !== "all" || 
                          teamSizeFilter !== "all" || 
                          searchQuery !== "";

  // Get unique categories from hackathons
  const uniqueCategories = Array.from(new Set(hackathons.map(h => h.category)));

  const filteredHackathons = hackathons.filter((hackathon) => {
    // Search filter
    const matchesSearch = searchQuery === "" || 
      hackathon.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hackathon.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hackathon.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Category filter
    const matchesCategory = categoryFilter === "all" || hackathon.category === categoryFilter;
    
    // Registration status filter
    const isRegOpen = isRegistrationOpen(hackathon);
    const matchesRegistration = registrationFilter === "all" || 
      (registrationFilter === "open" && isRegOpen) ||
      (registrationFilter === "closed" && !isRegOpen);
    
    // Mode filter (online/offline)
    const matchesMode = modeFilter === "all" || 
      (modeFilter === "online" && hackathon.is_online) ||
      (modeFilter === "offline" && !hackathon.is_online);
    
    // Team size filter
    const matchesTeamSize = teamSizeFilter === "all" ||
      (teamSizeFilter === "solo" && hackathon.min_team_size === 1) ||
      (teamSizeFilter === "small" && hackathon.max_team_size && hackathon.max_team_size <= 3) ||
      (teamSizeFilter === "medium" && hackathon.max_team_size && hackathon.max_team_size > 3 && hackathon.max_team_size <= 6) ||
      (teamSizeFilter === "large" && hackathon.max_team_size && hackathon.max_team_size > 6);
    
    return matchesSearch && matchesCategory && matchesRegistration && matchesMode && matchesTeamSize;
  });

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="pt-24 pb-12 px-4">
        <div className="container mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">All Hackathons</h1>
          <p className="text-muted-foreground mb-8">
            Explore and join exciting competitions
          </p>
          
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                placeholder="Search hackathons..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-secondary border-border"
              />
            </div>
          </div>

          {/* Filter Section */}
          <div className="mb-8">
            <div className="glass-card p-4 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold">Filters</h3>
                {hasActiveFilters && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={clearFilters}
                    className="text-xs"
                  >
                    <X className="w-3 h-3 mr-1" />
                    Clear All
                  </Button>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Category Filter */}
                <div>
                  <label className="text-xs text-muted-foreground mb-2 block">Category</label>
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="bg-secondary border-border">
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {uniqueCategories.map(category => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Registration Status Filter */}
                <div>
                  <label className="text-xs text-muted-foreground mb-2 block">Registration</label>
                  <Select value={registrationFilter} onValueChange={setRegistrationFilter}>
                    <SelectTrigger className="bg-secondary border-border">
                      <SelectValue placeholder="All" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="open">Open for Registration</SelectItem>
                      <SelectItem value="closed">Registration Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Mode Filter (Online/Offline) */}
                <div>
                  <label className="text-xs text-muted-foreground mb-2 block">Mode</label>
                  <Select value={modeFilter} onValueChange={setModeFilter}>
                    <SelectTrigger className="bg-secondary border-border">
                      <SelectValue placeholder="All" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="online">Online</SelectItem>
                      <SelectItem value="offline">Offline</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Team Size Filter */}
                <div>
                  <label className="text-xs text-muted-foreground mb-2 block">Team Size</label>
                  <Select value={teamSizeFilter} onValueChange={setTeamSizeFilter}>
                    <SelectTrigger className="bg-secondary border-border">
                      <SelectValue placeholder="All" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Sizes</SelectItem>
                      <SelectItem value="solo">Solo (1)</SelectItem>
                      <SelectItem value="small">Small (2-3)</SelectItem>
                      <SelectItem value="medium">Medium (4-6)</SelectItem>
                      <SelectItem value="large">Large (7+)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Active Filters Display */}
              {hasActiveFilters && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {searchQuery && (
                    <Badge variant="secondary" className="bg-primary/20">
                      Search: {searchQuery}
                      <X 
                        className="w-3 h-3 ml-1 cursor-pointer" 
                        onClick={() => setSearchQuery("")}
                      />
                    </Badge>
                  )}
                  {categoryFilter !== "all" && (
                    <Badge variant="secondary" className="bg-primary/20">
                      {categoryFilter}
                      <X 
                        className="w-3 h-3 ml-1 cursor-pointer" 
                        onClick={() => setCategoryFilter("all")}
                      />
                    </Badge>
                  )}
                  {registrationFilter !== "all" && (
                    <Badge variant="secondary" className="bg-primary/20">
                      {registrationFilter === "open" ? "Open Registration" : "Closed Registration"}
                      <X 
                        className="w-3 h-3 ml-1 cursor-pointer" 
                        onClick={() => setRegistrationFilter("all")}
                      />
                    </Badge>
                  )}
                  {modeFilter !== "all" && (
                    <Badge variant="secondary" className="bg-primary/20">
                      {modeFilter === "online" ? "Online" : "Offline"}
                      <X 
                        className="w-3 h-3 ml-1 cursor-pointer" 
                        onClick={() => setModeFilter("all")}
                      />
                    </Badge>
                  )}
                  {teamSizeFilter !== "all" && (
                    <Badge variant="secondary" className="bg-primary/20">
                      {teamSizeFilter === "solo" ? "Solo" : 
                       teamSizeFilter === "small" ? "Small Team" :
                       teamSizeFilter === "medium" ? "Medium Team" : "Large Team"}
                      <X 
                        className="w-3 h-3 ml-1 cursor-pointer" 
                        onClick={() => setTeamSizeFilter("all")}
                      />
                    </Badge>
                  )}
                </div>
              )}
            </div>

            {/* Results Count */}
            <div className="mt-4 text-sm text-muted-foreground">
              Showing {filteredHackathons.length} of {hackathons.length} hackathon{hackathons.length !== 1 ? 's' : ''}
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              <div className="col-span-full text-center py-12">
                <p className="text-muted-foreground">Loading hackathons...</p>
              </div>
            ) : filteredHackathons.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <p className="text-muted-foreground">
                  {searchQuery ? "No hackathons found matching your search." : "No hackathons available at the moment."}
                </p>
              </div>
            ) : (
              filteredHackathons.map((hackathon) => {
                const regOpen = isRegistrationOpen(hackathon);
                const now = new Date();
                const end = hackathon.registration_end_date ? new Date(hackathon.registration_end_date) : null;
                
                // Determine friendly status label
                let statusLabel = hackathon.status;
                if (regOpen) {
                  statusLabel = 'Open for registration';
                } else if (end && now > end) {
                  const submissionEnd = hackathon.submission_deadline ? new Date(hackathon.submission_deadline) : null;
                  if (submissionEnd && now <= submissionEnd) {
                    statusLabel = 'Registration closed';
                  } else {
                    statusLabel = 'Ended';
                  }
                }

                return (
                <Card key={hackathon.hackathon_id} className="glass-card glass-card-hover p-6">
                  <div className="flex flex-col h-full">
                    <div className="flex items-start justify-between mb-4">
                      <Badge
                        variant="secondary"
                        className={
                          regOpen ? "bg-success/20 text-success border-success/30" :
                          hackathon.status === "ongoing" ? "bg-primary/20 text-primary border-primary/30" :
                          hackathon.status === "completed" ? "bg-muted" :
                          "bg-accent/20 text-accent border-accent/30"
                        }
                      >
                        {statusLabel}
                      </Badge>
                    
                    {hackathon.prize_pool && (
                      <span className="text-2xl font-bold text-primary">
                        {typeof hackathon.prize_pool === 'number' 
                          ? `$${hackathon.prize_pool.toLocaleString()}` 
                          : hackathon.prize_pool.toString().replace(/₹/g, '').startsWith('$') 
                            ? hackathon.prize_pool.toString().replace(/₹/g, '') 
                            : `$${hackathon.prize_pool.toString().replace(/₹/g, '')}`}
                      </span>
                    )}
                  </div>
                  
                  <h3 className="text-xl font-bold mb-2">{hackathon.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{hackathon.description}</p>
                  
                  <div className="flex gap-2 mb-4">
                    <Badge variant="outline">
                      {hackathon.category}
                    </Badge>
                    {hackathon.is_online && (
                      <Badge variant="outline" className="bg-primary/10">
                        Online
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{calculateDaysLeft(hackathon.submission_deadline)}</span>
                    </div>
                    {hackathon.min_team_size && hackathon.max_team_size && (
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>{hackathon.min_team_size}-{hackathon.max_team_size} members</span>
                      </div>
                    )}
                  </div>
                  
                  {!hackathon.is_online && hackathon.location && (
                    <div className="flex items-center gap-2 mb-4 text-sm">
                      <MapPin className="w-4 h-4 text-primary" />
                      <span className="text-muted-foreground">{hackathon.location}</span>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-auto">
                    <Button className="w-full bg-primary hover:bg-primary-glow text-primary-foreground" asChild>
                      <Link to={`/hackathon/${hackathon.hackathon_id}`}>View Details</Link>
                    </Button>
                    <Button variant="outline" className="w-full glass-card" asChild>
                      <Link to={`/hackathon/${hackathon.hackathon_id}/leaderboard`}>Leaderboard</Link>
                    </Button>
                  </div>
                  </div>
                </Card>
                );
              })
            )}
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Hackathons;
