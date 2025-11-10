-- Add leaderboard finalization flag to hackathons table
ALTER TABLE hackathons 
ADD COLUMN leaderboard_finalized BOOLEAN DEFAULT FALSE AFTER status,
ADD COLUMN leaderboard_finalized_at TIMESTAMP NULL AFTER leaderboard_finalized;

-- Index for quick queries
CREATE INDEX idx_leaderboard_finalized ON hackathons(leaderboard_finalized);
