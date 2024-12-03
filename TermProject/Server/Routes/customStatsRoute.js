const express = require('express');
const router = express.Router();
const db = require('../databaseInitialize');
const customStatsDB = require('../customStatsInitialize');
const { authenticateToken } = require('../Controllers/authenticateToken');
const { getAllCustomStats } = require('../Controllers/customStatsController');

router.get("/", authenticateToken, getAllCustomStats);

module.exports = router;