const db = require('../config/database');

exports.getUserStats = async (req, res) => {
  const { userId } = req.params;
  try {
    await db.execute(
      'CALL get_user_stats(?, @total_borrowed, @current_borrowed, @total_fines)',
      [userId]
    );
    
    const [[stats]] = await db.execute(
      'SELECT @total_borrowed as total_borrowed, @current_borrowed as current_borrowed, @total_fines as total_fines'
    );

    res.json({
      total_borrowed: stats.total_borrowed || 0,
      current_borrowed: stats.current_borrowed || 0,
      total_fines: parseFloat(stats.total_fines) || 0
    });
  } catch (error) {
    console.error('Error fetching user stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user statistics'
    });
  }
};

exports.getUserProfile = async (req, res) => {
  const { userId } = req.params;
  try {
    const [user] = await db.execute(
      'SELECT u.user_id, u.Name as name, u.Address as address, u.username, ' +
      'u.date_signup, u.phone_no, u.branch_name, c.Card_no as card_no ' +
      'FROM `user` u ' +
      'LEFT JOIN `card` c ON u.user_id = c.user_id ' +
      'WHERE u.user_id = ?',
      [userId]
    );

    if (user.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json(user[0]);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user profile'
    });
  }
};

exports.updateUserProfile = async (req, res) => {
  const { userId } = req.params;
  const { name, address, phone_no, branch_name } = req.body;
  
  try {
    // Check if branch exists if provided
    if (branch_name) {
      const [branches] = await db.execute('SELECT 1 FROM `branch` WHERE name = ?', [branch_name]);
      if (branches.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Specified branch does not exist'
        });
      }
    }

    await db.execute(
      'UPDATE `user` SET Name = ?, Address = ?, phone_no = ?, branch_name = ? WHERE user_id = ?',
      [name, address, phone_no, branch_name, userId]
    );
    
    res.json({
      success: true,
      message: 'Profile updated successfully'
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update user profile'
    });
  }
};