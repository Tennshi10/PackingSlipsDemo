const express = require('express');
const IntuitController = require('../controllers/intuitController');

const router = express.Router();
const intuitController = new IntuitController();

router.get('/intuit/data', intuitController.fetchData.bind(intuitController));
router.get('/intuit/authorize', intuitController.authorize.bind(intuitController)); // Add this line
router.get('/intuit/callback', intuitController.callback.bind(intuitController)); // Add this line
router.get('/intuit/invoices', intuitController.fetchInvoices.bind(intuitController)); // Add this line

module.exports = router;