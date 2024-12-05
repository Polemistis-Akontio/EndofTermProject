const db = require('../databaseInitialize');

// Utility function for pagination
const handlePagination = (total, itemsPerPage, page) => {
  const totalPages = Math.ceil(total / itemsPerPage);
  return {
    total,
    totalPages,
    currentPage: page,
    itemsPerPage,
  };
};


// Get team stats by ID with pagination
const getTeamStatsById = (req, res) => {
  const { team_id } = req.params;
  const { category_id, year } = req.query;  // Get category_id and year from the query parameters
  const page = parseInt(req.query.page) || 1;
  const itemsPerPage = parseInt(req.query.itemsPerPage) || 10; // Default to 10 if not provided
  const offset = (page - 1) * itemsPerPage;
  console.log(req.query);

  // Check if category_id and year are provided
  if (!category_id || !year) {
    return res.status(400).json({ error: 'Both category_id and year are required' });
  }

  const query = `
    SELECT * FROM teamYearlyStats
    WHERE team_id = ? AND category_id = ? AND year = ?
    LIMIT ? OFFSET ?;
  `;
  const countQuery = `
    SELECT COUNT(*) AS total 
    FROM teamYearlyStats 
    WHERE team_id = ? AND category_id = ? AND year = ?;
  `;

  db.all(query, [team_id, category_id, year, itemsPerPage, offset], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Database error', details: err.message });
    if (rows.length === 0) return res.status(404).json({ message: 'Team stats not found' });

    db.get(countQuery, [team_id, category_id, year], (err, countResult) => {
      if (err) return res.status(500).json({ error: 'Database error', details: err.message });

      res.status(200).json({
        teamStats: rows,
        pagination: handlePagination(countResult?.total || 0, itemsPerPage, page),
      });
    });
  });
};
// Get team stats by ID and year
const getTeamStatsByIdAndYear = (req, res) => {
  const { team_id, year } = req.params;
  const query = `
    SELECT * FROM teamYearlyStats
    WHERE team_id = ? AND year = ?;
  `;
  db.all(query, [team_id, year], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Database error', details: err.message });
    if (rows.length === 0)
      return res.status(404).json({ message: 'Team stats not found for the given year' });

    res.status(200).json({ teamStats: rows });
  });
};

// Get player stats by ID with pagination
const getPlayerStatsById = (req, res) => {
  const { player_id } = req.params;
  const page = parseInt(req.query.page) || 1;
  const itemsPerPage = parseInt(req.query.itemsPerPage) || 10;  // Default to 10 if not provided
  const offset = (page - 1) * itemsPerPage;

  const query = `
    SELECT * FROM playersCareerStats
    WHERE player_id = ?
    LIMIT ? OFFSET ?;
  `;
  const countQuery = `SELECT COUNT(*) AS total FROM playersCareerStats WHERE player_id = ?;`;

  db.all(query, [player_id, itemsPerPage, offset], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Database error', details: err.message });
    if (rows.length === 0) return res.status(404).json({ message: 'Player stats not found' });

    db.get(countQuery, [player_id], (err, countResult) => {
      if (err) return res.status(500).json({ error: 'Database error', details: err.message });
      res.status(200).json({
        playerStats: rows,
        pagination: handlePagination(countResult?.total || 0, itemsPerPage, page),
      });
    });
  });
};

// Get player stats by ID and year
const getPlayerStatsByIdAndYear = (req, res) => {
  const { player_id, year } = req.params;

  const query = `
    SELECT * FROM playersYearlyStats
    WHERE player_id = ? AND year = ?;
  `;
  db.all(query, [player_id, year], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Database error', details: err.message });
    if (rows.length === 0)
      return res.status(404).json({ message: 'Player stats not found for the given year' });

    res.status(200).json({ playerStats: rows });
  });
};

// Get all team records by ID
const getAllTeamRecordsById = (req, res) => {
  const { team_id } = req.params;

  const query = `
    SELECT * FROM teamRecords
    WHERE team_id = ?;
  `;
  db.all(query, [team_id], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Database error', details: err.message });
    if (rows.length === 0)
      return res.status(404).json({ message: 'No records found for the given team' });

    res.status(200).json({ teamRecords: rows });
  });
};

// Get all team stat categories
const getAllTeamStatCategories = (req, res) => {
  const query = `SELECT * FROM teamStatCategories;`;

  db.all(query, (err, rows) => {
    if (err) return res.status(500).json({ error: 'Database error', details: err.message });

    res.status(200).json({ statCategories: rows });
  });
};

// Get all teams with pagination
const getAllTeams = (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const itemsPerPage = parseInt(req.query.itemsPerPage) || 10;  // Default to 10 if not provided
  const offset = (page - 1) * itemsPerPage;

  const query = `
    SELECT * FROM teams
    LIMIT ? OFFSET ?;
  `;
  const countQuery = `SELECT COUNT(*) AS total FROM teams;`;

  db.all(query, [itemsPerPage, offset], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Database error', details: err.message });

    db.get(countQuery, (err, countResult) => {
      if (err) return res.status(500).json({ error: 'Database error', details: err.message });
      res.status(200).json({
        teams: rows,
        pagination: handlePagination(countResult?.total || 0, itemsPerPage, page),
      });
    });
  });
};

// Get team roster by ID with pagination
const getTeamRoster = (req, res) => {
  const { team_id } = req.params;
  const page = parseInt(req.query.page) || 1;
  const itemsPerPage = parseInt(req.query.itemsPerPage) || 10;  // Default to 10 if not provided
  const offset = (page - 1) * itemsPerPage;

  const query = `
    SELECT * FROM players
    WHERE team_id = ?
    LIMIT ? OFFSET ?;
  `;
  const countQuery = `SELECT COUNT(*) AS total FROM players WHERE team_id = ?;`;

  db.all(query, [team_id, itemsPerPage, offset], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Database error', details: err.message });
    if (rows.length === 0) return res.status(404).json({ message: 'No players found for this team' });

    db.get(countQuery, [team_id], (err, countResult) => {
      if (err) return res.status(500).json({ error: 'Database error', details: err.message });
      res.status(200).json({
        players: rows,
        pagination: handlePagination(countResult?.total || 0, itemsPerPage, page),
      });
    });
  });
};

// Get players by position with pagination
const getPlayersByPosition = (req, res) => {
  const { position } = req.params;
  const page = parseInt(req.query.page) || 1;
  const itemsPerPage = parseInt(req.query.itemsPerPage) || 10;  // Default to 10 if not provided
  const offset = (page - 1) * itemsPerPage;

  const query = `
    SELECT * FROM players
    WHERE position_name = ?
    LIMIT ? OFFSET ?;
  `;
  const countQuery = `SELECT COUNT(*) AS total FROM players WHERE position_name = ?;`;

  db.all(query, [position, itemsPerPage, offset], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Database error', details: err.message });
    if (rows.length === 0) return res.status(404).json({ message: 'No players found in this position' });

    db.get(countQuery, [position], (err, countResult) => {
      if (err) return res.status(500).json({ error: 'Database error', details: err.message });
      res.status(200).json({
        players: rows,
        pagination: handlePagination(countResult?.total || 0, itemsPerPage, page),
      });
    });
  });
};

// Get all player stat categories
const getAllPlayerStatCategories = (req, res) => {
  const query = `SELECT * FROM playerStatCategories;`;

  db.all(query, (err, rows) => {
    if (err) return res.status(500).json({ error: 'Database error', details: err.message });

    res.status(200).json({ statCategories: rows });
  });
};

// Get player career stats by ID with pagination
const getPlayerCareerStats = (req, res) => {
  const { player_id } = req.params;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  const query = `
    SELECT * FROM playersCareerStats
    WHERE player_id = ?
    LIMIT ? OFFSET ?;
  `;
  const countQuery = `SELECT COUNT(*) AS total FROM playersCareerStats WHERE player_id = ?;`;

  db.all(query, [player_id, limit, offset], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Database error', details: err.message });
    if (rows.length === 0) return res.status(404).json({ message: 'No career stats found for this player' });

    db.get(countQuery, [player_id], (err, countResult) => {
      if (err) return res.status(500).json({ error: 'Database error', details: err.message });
      res.status(200).json({
        careerStats: rows,
        pagination: handlePagination(countResult?.total || 0, limit, page),
      });
    });
  });
};

const search = (req, res) => {
  const { q, page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * limit;

  // Ensure query is provided
  if (!q) {
    return res.status(400).json({ error: 'Search query (q) is required' });
  }

  // Define search queries for each table
  const teamQuery = `
    SELECT 'team' AS type, id, name, abbreviation, location, display_name
    FROM teams
    WHERE name LIKE ? OR abbreviation LIKE ? OR location LIKE ? OR display_name LIKE ?
    LIMIT ? OFFSET ?;
  `;
  const countTeamQuery = `
    SELECT COUNT(*) AS total FROM teams
    WHERE name LIKE ? OR abbreviation LIKE ? OR location LIKE ? OR display_name LIKE ?;
  `;

  const playerQuery = `
    SELECT 'player' AS type, id, first_name, last_name, full_name, position_name, college
    FROM players
    WHERE first_name LIKE ? OR last_name LIKE ? OR full_name LIKE ? 
       OR position_name LIKE ? OR college LIKE ? OR jersey_number LIKE ?
    LIMIT ? OFFSET ?;
  `;
  const countPlayerQuery = `
    SELECT COUNT(*) AS total FROM players
    WHERE first_name LIKE ? OR last_name LIKE ? OR full_name LIKE ? 
       OR position_name LIKE ? OR college LIKE ? OR jersey_number LIKE ?;
  `;

  const teamStatQuery = `
    SELECT 'team_stat' AS type, id, name, display_name, description
    FROM teamYearlyStats
    WHERE name LIKE ? OR display_name LIKE ? OR description LIKE ?
    LIMIT ? OFFSET ?;
  `;
  const countTeamStatQuery = `
    SELECT COUNT(*) AS total FROM teamYearlyStats
    WHERE name LIKE ? OR display_name LIKE ? OR description LIKE ?;
  `;

  const playerCareerStatQuery = `
    SELECT 'player_stat' AS type, id, display_value
    FROM playersCareerStats
    WHERE display_value LIKE ?
    LIMIT ? OFFSET ?;
  `;
  const countPlayerCareerStatQuery = `
    SELECT COUNT(*) AS total FROM playersCareerStats
    WHERE display_value LIKE ?;
  `;

  const playerYearlyStatQuery = `
    SELECT 'player_stat' AS type, id, display_value
    FROM playersYearlyStats
    WHERE display_value LIKE ?
    LIMIT ? OFFSET ?;
  `;
  const countPlayerYearlyStatQuery = `
    SELECT COUNT(*) AS total FROM playersYearlyStats
    WHERE display_value LIKE ?;
  `;

  // Use LIKE with wildcards for the search term
  const searchTerm = `%${q}%`;

  // Execute the queries in parallel using db.all() and db.get() for count queries
  Promise.all([
    new Promise((resolve, reject) => {
      const params = [searchTerm, searchTerm, searchTerm, searchTerm, limit, offset];
      db.all(teamQuery, params, (err, teamResults) => {
        if (err) reject(err);
        db.get(countTeamQuery, [searchTerm, searchTerm, searchTerm, searchTerm], (err, countResult) => {
          if (err) reject(err);
          resolve({ results: teamResults, total: countResult.total });
        });
      });
    }),
    new Promise((resolve, reject) => {
      const params = [searchTerm, searchTerm, searchTerm, searchTerm, searchTerm, searchTerm, limit, offset];
      db.all(playerQuery, params, (err, playerResults) => {
        if (err) reject(err);
        db.get(countPlayerQuery, [searchTerm, searchTerm, searchTerm, searchTerm, searchTerm, searchTerm], (err, countResult) => {
          if (err) reject(err);
          resolve({ results: playerResults, total: countResult.total });
        });
      });
    }),
    new Promise((resolve, reject) => {
      const params = [searchTerm, searchTerm, searchTerm, limit, offset];
      db.all(teamStatQuery, params, (err, teamStatResults) => {
        if (err) reject(err);
        db.get(countTeamStatQuery, [searchTerm, searchTerm, searchTerm], (err, countResult) => {
          if (err) reject(err);
          resolve({ results: teamStatResults, total: countResult.total });
        });
      });
    }),
    new Promise((resolve, reject) => {
      const params = [searchTerm, limit, offset];
      db.all(playerCareerStatQuery, params, (err, playerCareerStatResults) => {
        if (err) reject(err);
        db.get(countPlayerCareerStatQuery, [searchTerm], (err, countResult) => {
          if (err) reject(err);
          resolve({ results: playerCareerStatResults, total: countResult.total });
        });
      });
    }),
    new Promise((resolve, reject) => {
      const params = [searchTerm, limit, offset];
      db.all(playerYearlyStatQuery, params, (err, playerYearlyStatResults) => {
        if (err) reject(err);
        db.get(countPlayerYearlyStatQuery, [searchTerm], (err, countResult) => {
          if (err) reject(err);
          resolve({ results: playerYearlyStatResults, total: countResult.total });
        });
      });
    })
  ])
  .then(results => {
    const combinedResults = [
      ...results[0].results, // Teams
      ...results[1].results, // Players
      ...results[2].results, // Team Stats
      ...results[3].results, // Player Career Stats
      ...results[4].results  // Player Yearly Stats
    ];

    // Total results from all queries combined
    const totalResults = results.reduce((sum, result) => sum + result.total, 0);

    // Pagination information
    const pagination = {
      currentPage: page,
      itemsPerPage: limit,
      totalResults: totalResults,
      nextPage: totalResults > page * limit ? page + 1 : null
    };

    // Return the combined results
    res.status(200).json({ results: combinedResults, pagination });
  })
  .catch(err => {
    res.status(500).json({ error: 'Database error', details: err.message });
  });
};



module.exports = {
  getTeamStatsById,
  getTeamStatsByIdAndYear,
  getPlayerStatsById,
  getPlayerStatsByIdAndYear,
  getAllTeamRecordsById,
  getAllTeamStatCategories,
  getAllTeams,
  getTeamRoster,
  getPlayersByPosition,
  getAllPlayerStatCategories,
  getPlayerCareerStats,
  search
};
