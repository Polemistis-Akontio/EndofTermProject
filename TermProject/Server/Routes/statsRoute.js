const express = require('express');
const router = express.Router();
const db = require('../databaseInitialize');
const { authenticateToken } = require('../Controllers/authenticateToken');
const { getTeamStatsById, getTeamStatsByIdAndYear, getPlayerStatsById, getPlayerStatsByIdAndYear,
    getAllTeamRecordsById, getAllTeamStatCategories, getAllTeams, getAllPlayerStatCategories,
    getPlayerCareerStats, getPlayersByPosition, getTeamRoster, search
 } = require('../Controllers/statsController');


router.get('/teams', authenticateToken, getAllTeams)
router.get('/teams/:team_id', authenticateToken, getTeamStatsById);
router.get('/teams/:team_id/records', authenticateToken, getAllTeamRecordsById);
router.get('/teams/:team_id/:year', authenticateToken, getTeamStatsByIdAndYear);
router.get('/player/position/:position', authenticateToken, getPlayersByPosition);
router.get('/player/:player_id', authenticateToken, getPlayerStatsById);
router.get('/player/:player_id/careerStats', authenticateToken, getPlayerCareerStats);
router.get('/player/:player_id/:year', authenticateToken, getPlayerStatsByIdAndYear);
router.get('/team_stat_categories', authenticateToken, getAllTeamStatCategories);
router.get('/player_stat_categories', authenticateToken, getAllPlayerStatCategories);
router.get('/search', authenticateToken, search);

module.exports = router;