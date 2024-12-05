const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const customStatsDB = require('../customStatsInitialize');

// Function to create custom stats and related entities in the database
const createCustomStats = async (req, res) => {

    const { team, player, statsCategory, customStat, compositeStat } = req.body;
    let errorMessages = [];
  
    // Check if team exists, if not insert it into the teams table
    if (team && team.name && team.abbreviation && team.location) {
      try {
        const teamExists = await new Promise((resolve, reject) => {
          customStatsDB.get('SELECT id FROM teams WHERE abbreviation = ?', [team.abbreviation], (err, row) => {
            if (err) return reject(err);
            resolve(row);
          });
        });
  
        if (!teamExists) {
          await new Promise((resolve, reject) => {
            customStatsDB.run(
              'INSERT INTO teams (name, abbreviation, location, display_name) VALUES (?, ?, ?, ?)',
              [team.name, team.abbreviation, team.location, team.display_name],
              function (err) {
                if (err) return reject(err);
                resolve(this.lastID);
              }
            );
          });
          console.log('Team inserted');
        }
      } catch (err) {
        errorMessages.push('Error inserting team: ' + err.message);
      }
    } else {
      errorMessages.push('Missing team information.');
    }
  
    // Check if player exists, if not insert it into players table
    if (player && player.first_name && player.last_name && player.team_id) {
      try {
        const playerExists = await new Promise((resolve, reject) => {
          customStatsDB.get('SELECT id FROM players WHERE full_name = ?', [player.full_name], (err, row) => {
            if (err) return reject(err);
            resolve(row);
          });
        });
  
        if (!playerExists) {
          await new Promise((resolve, reject) => {
            customStatsDB.run(
              'INSERT INTO players (first_name, last_name, full_name, team_id) VALUES (?, ?, ?, ?)',
              [player.first_name, player.last_name, player.full_name, player.team_id],
              function (err) {
                if (err) return reject(err);
                resolve(this.lastID);
              }
            );
          });
          console.log('Player inserted');
        }
      } catch (err) {
        errorMessages.push('Error inserting player: ' + err.message);
      }
    } else {
      errorMessages.push('Missing player information.');
    }
  
    // Check if stats category exists, if not insert it into stats_categories table
    if (statsCategory && statsCategory.name) {
      try {
        const categoryExists = await new Promise((resolve, reject) => {
          customStatsDB.get('SELECT id FROM stats_categories WHERE name = ?', [statsCategory.name], (err, row) => {
            if (err) return reject(err);
            resolve(row);
          });
        });
  
        if (!categoryExists) {
          await new Promise((resolve, reject) => {
            customStatsDB.run(
              'INSERT INTO stats_categories (name, description) VALUES (?, ?)',
              [statsCategory.name, statsCategory.description],
              function (err) {
                if (err) return reject(err);
                resolve(this.lastID);
              }
            );
          });
          console.log('Stats category inserted');
        }
      } catch (err) {
        errorMessages.push('Error inserting stats category: ' + err.message);
      }
    } else {
      errorMessages.push('Missing stats category information.');
    }
  
    // Check if custom stat exists, if not insert it into custom_stats table
    if (customStat && customStat.player_id && customStat.category_id && customStat.game_date && customStat.stat_description) {
      try {
        await new Promise((resolve, reject) => {
          customStatsDB.run(
            'INSERT INTO custom_stats (player_id, category_id, game_date, stat_description) VALUES (?, ?, ?, ?)',
            [customStat.player_id, customStat.category_id, customStat.game_date, customStat.stat_description],
            function (err) {
              if (err) return reject(err);
              resolve(this.lastID);
            }
          );
        });
        console.log('Custom stat inserted');
      } catch (err) {
        errorMessages.push('Error inserting custom stat: ' + err.message);
      }
    } else {
      errorMessages.push('Missing custom stat information.');
    }
  
    // Check if composite stat exists, if not insert it into composite_stats table
    if (compositeStat && compositeStat.player_id && compositeStat.stat_group && compositeStat.stat_value) {
      try {
        await new Promise((resolve, reject) => {
          customStatsDB.run(
            'INSERT INTO composite_stats (player_id, stat_group, stat_value) VALUES (?, ?, ?)',
            [compositeStat.player_id, compositeStat.stat_group, compositeStat.stat_value],
            function (err) {
              if (err) return reject(err);
              resolve(this.lastID);
            }
          );
        });
        console.log('Composite stat inserted');
      } catch (err) {
        errorMessages.push('Error inserting composite stat: ' + err.message);
      }
    } else {
      errorMessages.push('Missing composite stat information.');
    }
  
    // If there were any errors, send them in the response
    if (errorMessages.length > 0) {
      return res.status(400).json({ success: false, errors: errorMessages });
    }
  
    // If no errors, send success response
    return res.status(201).json({ success: true, message: 'Stats added successfully' });
  };

const getAllCustomStats = (req, res) => {
    // Query to fetch data from all relevant tables
    const query = `
      SELECT t.id AS team_id, t.name AS team_name, t.abbreviation, t.location, t.display_name AS team_display_name,
             p.id AS player_id, p.first_name, p.last_name, p.full_name, p.team_id AS player_team_id,
             sc.id AS category_id, sc.name AS category_name, sc.description AS category_description,
             cs.id AS custom_stat_id, cs.player_id AS custom_stat_player_id, cs.category_id AS custom_stat_category_id,
             cs.game_date, cs.stat_description AS custom_stat_description,
             cs_stat.id AS composite_stat_id, cs_stat.player_id AS composite_stat_player_id,
             cs_stat.stat_group, cs_stat.stat_value
      FROM teams t
      LEFT JOIN players p ON p.team_id = t.id
      LEFT JOIN stats_categories sc ON sc.id = p.id
      LEFT JOIN custom_stats cs ON cs.player_id = p.id
      LEFT JOIN composite_stats cs_stat ON cs_stat.player_id = p.id
    `;
    
    customStatsDB.all(query, [], (err, rows) => {
      if (err) {
        console.error('Error retrieving custom stats:', err.message);
        return res.status(500).json({ success: false, message: 'Error retrieving custom stats' });
      }
  
      // Return the fetched data as a JSON response
      res.json({ success: true, data: rows });
    });
};


module.exports = {
    getAllCustomStats, createCustomStats
};