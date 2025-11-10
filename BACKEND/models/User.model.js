const db = require('../config/database');

class User {
  // Find user by email
  static async findByEmail(email) {
    try {
      const [rows] = await db.query(
        'SELECT * FROM users WHERE email = ?',
        [email]
      );
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Find user by ID
  static async findById(id) {
    try {
      const [rows] = await db.query(
        'SELECT user_id, email, full_name, user_type, phone, organization, bio, profile_image, is_active, created_at FROM users WHERE user_id = ?',
        [id]
      );
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Find user by ID with password (for password verification)
  static async findByIdWithPassword(id) {
    try {
      const [rows] = await db.query(
        'SELECT * FROM users WHERE user_id = ?',
        [id]
      );
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Create new user
  static async create(data) {
    try {
      const [result] = await db.query(
        `INSERT INTO users (email, password_hash, full_name, user_type, phone, organization, bio) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          data.email,
          data.password_hash,
          data.full_name,
          data.user_type,
          data.phone || null,
          data.organization || null,
          data.bio || null
        ]
      );
      return result.insertId;
    } catch (error) {
      throw error;
    }
  }

  // Update last login
  static async updateLastLogin(userId) {
    try {
      await db.query(
        'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE user_id = ?',
        [userId]
      );
    } catch (error) {
      throw error;
    }
  }

  // Update user
  static async update(id, data) {
    try {
      const fields = [];
      const values = [];

      Object.keys(data).forEach(key => {
        if (data[key] !== undefined && key !== 'user_id' && key !== 'password_hash') {
          fields.push(`${key} = ?`);
          values.push(data[key]);
        }
      });

      if (fields.length === 0) {
        throw new Error('No fields to update');
      }

      values.push(id);
      const query = `UPDATE users SET ${fields.join(', ')} WHERE user_id = ?`;
      
      const [result] = await db.query(query, values);
      return result.affectedRows;
    } catch (error) {
      throw error;
    }
  }

  // Get users by type
  static async getByType(userType) {
    try {
      const [rows] = await db.query(
        'SELECT user_id, email, full_name, user_type, phone, organization, is_active, created_at FROM users WHERE user_type = ? AND is_active = TRUE',
        [userType]
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Update password
  static async updatePassword(userId, passwordHash) {
    try {
      const [result] = await db.query(
        'UPDATE users SET password_hash = ? WHERE user_id = ?',
        [passwordHash, userId]
      );
      return result.affectedRows;
    } catch (error) {
      throw error;
    }
  }

  // Delete user (CASCADE delete related records)
  static async delete(userId) {
    const connection = await db.getConnection();
    
    try {
      await connection.beginTransaction();

      // Delete team_members records
      await connection.query(
        'DELETE FROM team_members WHERE user_id = ?',
        [userId]
      );

      // Delete teams where user is the leader
      await connection.query(
        'DELETE FROM teams WHERE team_leader_id = ?',
        [userId]
      );

      // Delete the user
      const [result] = await connection.query(
        'DELETE FROM users WHERE user_id = ?',
        [userId]
      );

      await connection.commit();
      return result.affectedRows;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }
}

module.exports = User;
