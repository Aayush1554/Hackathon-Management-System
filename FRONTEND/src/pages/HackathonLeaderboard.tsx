import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useToast } from '@/hooks/use-toast';
import { useAutoRefresh } from '@/hooks/use-auto-refresh';
import { Trophy, Medal, Award, ArrowLeft, Users, Calendar } from 'lucide-react';
import { hackathonAPI } from '@/lib/api';
import { formatDate } from '@/lib/utils';

interface LeaderboardEntry {
  team_id: number;
  team_name: string;
  total_score: number;
  project_title: string;
  submission_date: string;
  leader_name: string;
  member_count: number;
  rank: number;
}

interface Hackathon {
  hackathon_id: number;
  title: string;
  category: string;
  description: string;
  prize_pool: string;
}

const HackathonLeaderboard = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [hackathon, setHackathon] = useState<Hackathon | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isFinalized, setIsFinalized] = useState(false);
  const [finalizedAt, setFinalizedAt] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async (showLoading = true) => {
    try {
      if (showLoading) {
        setLoading(true);
      }
      
      const [hackathonRes, leaderboardRes] = await Promise.all([
        hackathonAPI.getById(Number(id)),
        hackathonAPI.getLeaderboard(Number(id))
      ]);
      
      setHackathon(hackathonRes.data.data);
      setLeaderboard(leaderboardRes.data.data.leaderboard || []);
      setIsFinalized(leaderboardRes.data.data.is_finalized || false);
      setFinalizedAt(leaderboardRes.data.data.finalized_at);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to fetch leaderboard',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  // Auto-refresh every 1 second for real-time updates (silent refresh)
  useAutoRefresh({
    enabled: true,
    interval: 1000, // 1 second
    onRefresh: () => fetchData(false) // false = no loading screen, just silent update
  });

  const getRankBadge = (rank: number) => {
    if (rank === 1) {
      return (
        <div className="flex items-center gap-2">
          <Trophy className="w-8 h-8 text-yellow-500" />
          <span className="text-2xl font-bold gradient-text">1st</span>
        </div>
      );
    }
    if (rank === 2) {
      return (
        <div className="flex items-center gap-2">
          <Medal className="w-7 h-7 text-gray-400" />
          <span className="text-xl font-bold text-gray-400">2nd</span>
        </div>
      );
    }
    if (rank === 3) {
      return (
        <div className="flex items-center gap-2">
          <Medal className="w-7 h-7 text-amber-700" />
          <span className="text-xl font-bold text-amber-700">3rd</span>
        </div>
      );
    }
    return <span className="text-lg font-semibold text-muted-foreground">{rank}th</span>;
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-500';
    if (score >= 75) return 'text-blue-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-gray-500';
  };

  const getRankClass = (rank: number) => {
    if (rank === 1) return 'border-yellow-500 shadow-lg shadow-yellow-500/20';
    if (rank === 2) return 'border-gray-400 shadow-lg shadow-gray-400/20';
    if (rank === 3) return 'border-amber-700 shadow-lg shadow-amber-700/20';
    return '';
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="pt-24 pb-12 px-4 flex items-center justify-center">
          <p className="text-muted-foreground">Loading leaderboard...</p>
        </div>
        <Footer />
      </div>
    );
  }

  const topThree = leaderboard.slice(0, 3);
  const restOfLeaderboard = leaderboard.slice(3);

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-6xl">
          {/* Header */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-6">
              <Button 
                variant="ghost" 
                onClick={() => navigate('/hackathons')}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Hackathons
              </Button>
            </div>
            
            <Card className="glass-card p-6 mb-6">
              <div className="text-center">
                <div className="flex justify-center mb-4">
                  <Trophy className="w-16 h-16 text-yellow-500" />
                </div>
                <h1 className="text-4xl font-bold mb-2 gradient-text">
                  {hackathon?.title} Leaderboard
                </h1>
                <p className="text-muted-foreground mb-4">{hackathon?.description}</p>
                
                {isFinalized ? (
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-full mb-3">
                    <Award className="w-5 h-5 text-yellow-500" />
                    <span className="font-semibold text-yellow-500">🏆 This is the Final Standing</span>
                    {finalizedAt && (
                      <span className="text-xs text-muted-foreground">
                        • Finalized on {formatDate(finalizedAt)}
                      </span>
                    )}
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/30 rounded-full mb-3">
                    <Award className="w-5 h-5 text-blue-500" />
                    <span className="font-semibold text-blue-500">Current Leaderboard • Auto-refreshing</span>
                  </div>
                )}
                
                {!isFinalized && (
                  <p className="text-sm text-muted-foreground italic max-w-2xl mx-auto mb-4">
                    ⚠️ This is the current leaderboard. Final rankings may have different standings once the admin finalizes the results.
                  </p>
                )}
                
                {hackathon && (
                  <div className="flex items-center justify-center gap-3 mt-4">
                    <Badge variant="secondary">{hackathon.category}</Badge>
                    <Badge variant="outline">Prize Pool: {String(hackathon.prize_pool).replace(/₹/g, '')}</Badge>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Leaderboard */}
          {leaderboard.length === 0 ? (
            <Card className="glass-card p-12 text-center">
              <Trophy className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-xl font-semibold mb-2">No Submissions Yet</h3>
              <p className="text-muted-foreground">
                The leaderboard will be available once teams submit their projects and scores are assigned.
              </p>
            </Card>
          ) : (
            <>
              {/* Top 3 Podium */}
              {topThree.length >= 1 && (
                <div className="grid md:grid-cols-3 gap-6 mb-12">
                  {/* 2nd Place */}
                  {topThree[1] && (
                    <Card className={`glass-card ${getRankClass(2)} p-6 md:mt-8`}>
                      <div className="flex justify-center mb-4">
                        <Medal className="w-14 h-14 text-gray-400" />
                      </div>
                      <div className="text-center">
                        <Badge variant="secondary" className="bg-gray-400/20 text-gray-400 border-gray-400/30 mb-3">
                          2nd Place
                        </Badge>
                        <h3 className="font-bold text-xl mb-1">{topThree[1].team_name}</h3>
                        {topThree[1].project_title && (
                          <p className="text-sm text-muted-foreground mb-2">{topThree[1].project_title}</p>
                        )}
                        <p className="text-xs text-muted-foreground mb-3">Led by {topThree[1].leader_name}</p>
                        <div className="text-4xl font-bold text-gray-400">{topThree[1].total_score}</div>
                        <div className="text-xs text-muted-foreground">out of 100</div>
                      </div>
                    </Card>
                  )}

                  {/* 1st Place */}
                  {topThree[0] && (
                    <Card className={`glass-card ${getRankClass(1)} p-6`}>
                      <div className="flex justify-center mb-4">
                        <Trophy className="w-20 h-20 text-yellow-500 glow-effect" />
                      </div>
                      <div className="text-center">
                        <Badge className="bg-yellow-500/20 text-yellow-500 border-yellow-500/30 mb-3">🏆 Champion</Badge>
                        <h3 className="font-bold text-2xl mb-1">{topThree[0].team_name}</h3>
                        {topThree[0].project_title && (
                          <p className="text-sm text-muted-foreground mb-2">{topThree[0].project_title}</p>
                        )}
                        <p className="text-xs text-muted-foreground mb-3">Led by {topThree[0].leader_name}</p>
                        <div className="text-5xl font-bold gradient-text">{topThree[0].total_score}</div>
                        <div className="text-xs text-muted-foreground">out of 100</div>
                      </div>
                    </Card>
                  )}

                  {/* 3rd Place */}
                  {topThree[2] && (
                    <Card className={`glass-card ${getRankClass(3)} p-6 md:mt-8`}>
                      <div className="flex justify-center mb-4">
                        <Medal className="w-14 h-14 text-amber-700" />
                      </div>
                      <div className="text-center">
                        <Badge variant="secondary" className="bg-amber-700/20 text-amber-700 border-amber-700/30 mb-3">
                          3rd Place
                        </Badge>
                        <h3 className="font-bold text-xl mb-1">{topThree[2].team_name}</h3>
                        {topThree[2].project_title && (
                          <p className="text-sm text-muted-foreground mb-2">{topThree[2].project_title}</p>
                        )}
                        <p className="text-xs text-muted-foreground mb-3">Led by {topThree[2].leader_name}</p>
                        <div className="text-4xl font-bold text-amber-700">{topThree[2].total_score}</div>
                        <div className="text-xs text-muted-foreground">out of 100</div>
                      </div>
                    </Card>
                  )}
                </div>
              )}

              {/* Complete Rankings */}
              <Card className="glass-card p-6">
                <h2 className="text-2xl font-bold mb-6">Complete Rankings</h2>
                <div className="space-y-3">
                  {leaderboard.map((entry) => (
                    <Card 
                      key={entry.team_id} 
                      className={`glass-card ${getRankClass(entry.rank)} transition-all hover:scale-[1.01]`}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between gap-4">
                          {/* Rank */}
                          <div className="flex-shrink-0 w-20 text-center">
                            {getRankBadge(entry.rank)}
                          </div>

                          {/* Team Info */}
                          <div className="flex-1">
                            <h3 className="text-lg font-bold mb-1">{entry.team_name}</h3>
                            {entry.project_title && (
                              <p className="text-sm text-muted-foreground mb-2">{entry.project_title}</p>
                            )}
                            <div className="flex gap-3 text-xs text-muted-foreground flex-wrap">
                              <span className="flex items-center gap-1">
                                <Users className="w-3 h-3" />
                                {entry.member_count} members
                              </span>
                              <span className="flex items-center gap-1">
                                <Award className="w-3 h-3" />
                                Led by {entry.leader_name}
                              </span>
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {formatDate(entry.submission_date)}
                              </span>
                            </div>
                          </div>

                          {/* Score */}
                          <div className="flex-shrink-0 text-center min-w-[100px]">
                            <div className={`text-4xl font-bold ${getScoreColor(entry.total_score)}`}>
                              {entry.total_score}
                            </div>
                            <div className="text-xs text-muted-foreground">out of 100</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </Card>
            </>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default HackathonLeaderboard;
