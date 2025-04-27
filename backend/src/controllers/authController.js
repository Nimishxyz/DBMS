const db = require('../config/database');

exports.login = async (req, res) => {
  const { username, password } = req.body;
  try {
    // Updated to retrieve cardNo
    await db.execute('CALL user_login(?, ?, @success, @user_id, @card_no)', [username, password]);
    const [[result]] = await db.execute('SELECT @success as success, @user_id as userId, @card_no as cardNo');
    
    if (result.success) {
      res.json({ 
        success: true, 
        userId: result.userId,
        cardNo: result.cardNo,
        message: 'Login successful' 
      });
    } else {
      res.status(401).json({ 
        success: false, 
        message: 'Invalid credentials' 
      });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error during login' 
    });
  }
};

exports.signup = async (req, res) => {
  // Include branchName in the body
  const { name, address, username, password, phone, branchName } = req.body;
  try {
    await db.execute('CALL user_signup(?, ?, ?, ?, ?, ?, @success, @message)', 
      [name, address, username, password, phone, branchName]);
    const [[result]] = await db.execute('SELECT @success as success, @message as message');
    
    if (result.success) {
      res.status(201).json({
        success: true,
        message: result.message
      });
    } else {
      res.status(400).json({
        success: false,
        message: result.message
      });
    }
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during registration'
    });
  }
};