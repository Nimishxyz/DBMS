const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');

// Book management
router.get('/', bookController.getAllBooks);
router.get('/borrowed/:userId', bookController.getBorrowedBooks);
router.post('/add', bookController.addBook);
router.put('/:id', bookController.updateBook);
router.delete('/:id', bookController.deleteBook);

// Book borrowing
router.post('/request', bookController.requestBook);
router.post('/return', bookController.returnBook);

// Fines management
router.get('/fines/:userId', bookController.checkFines);
router.get('/fines/payments/:userId', bookController.getFinePayments);
router.post('/fines/pay', bookController.payFines);

module.exports = router;