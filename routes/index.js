const express = require('express');
const { getUsers } = require('../controllers/controllers');

const router = express.Router();

// API endpoint to get fake data
router.get('/data', getUsers);

module.exports = router;