const db = require('../config/database');

exports.getAllBooks = async (req, res) => {
  try {
    const [books] = await db.execute('CALL get_all_books()');
    res.json(books[0]);
  } catch (error) {
    console.error('Error fetching books:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch books. Please try again later.'
    });
  }
};

exports.addBook = async (req, res) => {
  const { isbn, title, author, available_copies, branch_name, lost_cost } = req.body;
  
  if (!isbn || !title || !author || !branch_name || available_copies === undefined) {
    return res.status(400).json({
      success: false,
      message: 'Please provide all required fields: isbn, title, author, available_copies, and branch_name'
    });
  }

  try {
    await db.execute('CALL add_book(?, ?, ?, ?, ?, ?, @success, @message, @book_id)',
      [isbn, title, author, available_copies, branch_name, lost_cost]);
    const [[result]] = await db.execute('SELECT @success as success, @message as message, @book_id as bookId');
    
    if (result.success) {
      res.status(201).json({
        success: true,
        message: result.message,
        bookId: result.bookId
      });
    } else {
      res.status(400).json({
        success: false,
        message: result.message
      });
    }
  } catch (error) {
    console.error('Error adding book:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add book. Please try again later.'
    });
  }
};

exports.updateBook = async (req, res) => {
  const { id } = req.params;
  const { isbn, title, author, available_copies, branch_name } = req.body;
  
  try {
    await db.execute('CALL update_book(?, ?, ?, ?, ?, ?, @success, @message)',
      [id, isbn, title, author, available_copies, branch_name]);
    const [[result]] = await db.execute('SELECT @success as success, @message as message');
    
    if (result.success) {
      res.json({
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
    console.error('Error updating book:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update book. Please try again later.'
    });
  }
};

exports.deleteBook = async (req, res) => {
  const { id } = req.params;
  
  try {
    await db.execute('CALL delete_book(?, @success, @message)', [id]);
    const [[result]] = await db.execute('SELECT @success as success, @message as message');
    
    if (result.success) {
      res.json({
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
    console.error('Error deleting book:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete book. Please try again later.'
    });
  }
};

exports.requestBook = async (req, res) => {
  const { userId, bookId } = req.body;
  try {
    // Fetch user's branchName automatically
    const [[user]] = await db.execute('SELECT branch_name FROM `user` WHERE user_id = ?', [userId]);
    const branchName = user?.branch_name;
    if (!branchName) {
      return res.status(400).json({ success: false, message: 'User branch not found.' });
    }
    await db.execute('CALL request_book(?, ?, ?, @success, @message)',
      [userId, bookId, branchName]);
    const [[result]] = await db.execute('SELECT @success as success, @message as message');
    if (result.success) {
      res.json({ success: true, message: result.message });
    } else {
      res.status(400).json({ success: false, message: result.message });
    }
  } catch (error) {
    console.error('Error requesting book:', error);
    res.status(500).json({ success: false, message: 'Server error while requesting book' });
  }
};

exports.returnBook = async (req, res) => {
  const { issueId, bookId } = req.body;
  try {
    await db.execute('CALL return_book(?, ?, @success, @message, @fine_amount)',
      [issueId, bookId]);
    const [[result]] = await db.execute(
      'SELECT @success as success, @message as message, @fine_amount as fineAmount'
    );
    
    res.json({
      success: result.success,
      message: result.message,
      fineAmount: result.fineAmount
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

exports.checkFines = async (req, res) => {
  const { userId } = req.params;
  try {
    await db.execute('CALL check_fines(?, @total_fine)', [userId]);
    const [[result]] = await db.execute('SELECT @total_fine as totalFine');
    res.json({ success: true, fines: result.totalFine });
  } catch (error) {
    console.error('Error checking fines:', error);
    res.status(500).json({ success: false, message: 'Server error while checking fines' });
  }
};

exports.getFinePayments = async (req, res) => {
  const { userId } = req.params;
  try {
    const [payments] = await db.execute('CALL get_fine_payments(?)', [userId]);
    res.json({ success: true, payments: payments[0] });
  } catch (error) {
    console.error('Error getting fine payments:', error);
    res.status(500).json({ success: false, message: 'Server error while fetching payment history' });
  }
};

exports.getBorrowedBooks = async (req, res) => {
  const { userId } = req.params;
  try {
    const [books] = await db.execute('CALL get_borrowed_books(?)', [userId]);
    res.json(books[0]);
  } catch (error) {
    console.error('Error fetching borrowed books:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch borrowed books'
    });
  }
};

exports.payFines = async (req, res) => {
  const { userId, amount } = req.body;
  if (!amount || isNaN(amount) || amount <= 0) {
    return res.status(400).json({ success: false, message: 'Invalid payment amount' });
  }
  try {
    await db.execute('CALL pay_fines(?, ?, @success, @message)', [userId, amount]);
    const [[result]] = await db.execute('SELECT @success as success, @message as message');
    if (!result.success) {
      return res.status(400).json({ success: false, message: result.message });
    }
    res.json({ success: true, message: result.message });
  } catch (error) {
    console.error('Error paying fines:', error);
    res.status(500).json({ success: false, message: 'Server error while paying fines' });
  }
};