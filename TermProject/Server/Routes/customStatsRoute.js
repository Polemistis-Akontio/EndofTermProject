const express = require('express');
const router = express.Router();
const db = require('../databaseInitialize');
const customStatsDB = require('../customStatsInitialize');
const { authenticateToken } = require('../Controllers/authenticateToken');
const { getAllCustomStats, createCustomStats } = require('../Controllers/customStatsController');

router.get("/", authenticateToken, getAllCustomStats);
router.post("/", authenticateToken, createCustomStats);

module.exports = router;