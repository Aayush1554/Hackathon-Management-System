const db = require('../config/database');

class Hackathon {
  // Get all hackathons
  static async getAll(filters = {}) {
    try {
      let query = 'SELECT * FROM hackathons WHERE 1=1';
      const params = [];

      if (filters.status) {
        query += ' AND status = ?';
        params.push(filters.status);
      }

      if (filters.category) {
        query += ' AND category = ?';
        params.push(filters.category);
      }

      query += ' ORDER BY created_at DESC';

      const [rows] = await db.query(query, params);
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Get hackathon by ID
  static async getById(id) {
    try {
      const [rows] = await db.query(
        'SELECT * FROM hackathons WHERE hackathon_id = ?',
        [id]
      );
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Get hackathon by slug
  static async getBySlug(slug) {
    try {
      const [rows] = await db.query(
        'SELECT * FROM hackathons WHERE slug = ?',
        [slug]
      );
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Create new hackathon
  static async create(data) {
    try {
      const [result] = await db.query(
        `INSERT INTO hackathons (
          title, slug, category, description, detailed_description,
          prize_pool, first_prize, second_prize, third_prize,
          status, registration_start_date, registration_end_date,
          team_formation_start_date, team_formation_end_date,
          development_start_date, development_end_date, submission_deadline,
          judging_start_date, judging_end_date, winner_announcement_date,
          min_team_size, max_team_size, max_teams,
          rules, judging_criteria, tags, location, is_online,
          created_by
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          data.title,
          data.slug,
          data.category,
          data.description,
          data.detailed_description || null,
          data.prize_pool,
          data.first_prize || null,
          data.second_prize || null,
          data.third_prize || null,
          data.status || 'draft',
          data.registration_start_date,
          data.registration_end_date,
          data.team_formation_start_date || null,
          data.team_formation_end_date || null,
          data.development_start_date,
          data.development_end_date,
          data.submission_deadline,
          data.judging_start_date || null,
          data.judging_end_date || null,
          data.winner_announcement_date || null,
          data.min_team_size || 2,
          data.max_team_size || 5,
          data.max_teams || null,
          data.rules || null,
          data.judging_criteria || null,
          data.tags || null,
          data.location || null,
          data.is_online !== undefined ? data.is_online : true,
          data.created_by
        ]
      );
      return result.insertId;
    } catch (error) {
      throw error;
    }
  }

  // Update hackathon
  static async update(id, data) {
    try {
      const fields = [];
      const values = [];

      Object.keys(data).forEach(key => {
        if (data[key] !== undefined && key !== 'hackathon_id') {
          fields.push(`${key} = ?`);
          values.push(data[key]);
        }
      });

      if (fields.length === 0) {
        throw new Error('No fields to update');
      }

      values.push(id);
      const query = `UPDATE hackathons SET ${fields.join(', ')} WHERE hackathon_id = ?`;
      
      const [result] = await db.query(query, values);
      return result.affectedRows;
    } catch (error) {
      throw error;
    }
  }

  // Delete hackathon
  static async delete(id) {
    try {
      const [result] = await db.query(
        'DELETE FROM hackathons WHERE hackathon_id = ?',
        [id]
      );
      return result.affectedRows;
    } catch (error) {
      throw error;
    }
  }

  // Get hackathon statistics
  static async getStats(id) {
    try {
      const [stats] = await db.query(
        `SELECT 
          (SELECT COUNT(*) FROM teams WHERE hackathon_id = ?) as total_teams,
          (SELECT COUNT(*) FROM teams WHERE hackathon_id = ? AND status = 'submitted') as submitted_teams,
          (SELECT COUNT(DISTINCT user_id) FROM team_members tm 
           JOIN teams t ON tm.team_id = t.team_id 
           WHERE t.hackathon_id = ?) as total_participants
        `,
        [id, id, id]
      );
      return stats[0];
    } catch (error) {
      throw error;
    }
  }

  // Update team score
  static async updateTeamScore(teamId, score) {
    try {
      const [result] = await db.query(
        'UPDATE teams SET total_score = ? WHERE team_id = ?',
        [score, teamId]
      );
      return result.affectedRows;
    } catch (error) {
      throw error;
    }
  }

  // Get leaderboard for a hackathon
  static async getLeaderboard(hackathonId) {
    try {
      const [rows] = await db.query(
        `SELECT 
          t.team_id,
          t.team_name,
          t.total_score,
          t.project_title,
          t.submission_date,
          u.full_name as leader_name,
          COUNT(DISTINCT tm.user_id) as member_count,
          RANK() OVER (ORDER BY t.total_score DESC) as rank
        FROM teams t
        LEFT JOIN users u ON t.team_leader_id = u.user_id
        LEFT JOIN team_members tm ON t.team_id = tm.team_id
        WHERE t.hackathon_id = ? 
          AND t.total_score IS NOT NULL 
          AND t.total_score > 0
        GROUP BY t.team_id
        ORDER BY t.total_score DESC, t.submission_date ASC`,
        [hackathonId]
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Finalize leaderboard
  static async finalizeLeaderboard(hackathonId) {
    try {
      const [result] = await db.query(
        `UPDATE hackathons 
         SET leaderboard_finalized = TRUE, 
             leaderboard_finalized_at = NOW() 
         WHERE hackathon_id = ?`,
        [hackathonId]
      );
      return result.affectedRows;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Hackathon;
