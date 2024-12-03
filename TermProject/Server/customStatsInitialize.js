const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'Database', 'customStats.sqlite');

const customStatsDB = new sqlite3.Database(dbPath, (err) => {
    if(err) {
        console.log("Error opening database: ", err);
    } else{
        console.log("Connected to Custom Stats Database");
        initializeDatabase();
    }
});

function initializeDatabase() {
    customStatsDB.serialize(() => {
        console.log("Initializing database...");

        customStatsDB.run(`
          CREATE TABLE IF NOT EXISTS teams (
            id INTEGER PRIMARY KEY,
            name VARCHAR(255),
            abbreviation VARCHAR(10),
            display_name VARCHAR(255),
            location VARCHAR(255)
          )
        `, (err) => {
          if (err) {
            console.error('Error creating teams table:', err.message);
          } else {
            console.log('teams table checked/created.');
          }
        });

        customStatsDB.run(`
          CREATE TABLE IF NOT EXISTS players (
            id INTEGER PRIMARY KEY,
            first_name VARCHAR(255),
            last_name VARCHAR(255),
            full_name VARCHAR(255),
            team_id INTEGER,
            FOREIGN KEY (team_id) REFERENCES teams(id)
          )
        `, (err) => {
          if (err) {
            console.error('Error creating players table:', err.message);
          } else {
            console.log('players table checked/created.');
          }
        });

        customStatsDB.run(`
          CREATE TABLE IF NOT EXISTS stats_categories (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name VARCHAR(255) UNIQUE,
            description TEXT
          )
        `, (err) => {
          if (err) {
            console.error('Error creating stats_categories table:', err.message);
          } else {
            console.log('stats_categories table checked/created.');
          }
        });

        customStatsDB.run(`
          CREATE TABLE IF NOT EXISTS custom_stats (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            player_id INTEGER,
            category_id INTEGER,
            game_date DATE,
            stat_description TEXT,
            FOREIGN KEY (player_id) REFERENCES players(id),
            FOREIGN KEY (category_id) REFERENCES stats_categories(id)
          )
        `, (err) => {
          if (err) {
            console.error('Error creating custom_stats table:', err.message);
          } else {
            console.log('custom_stats table checked/created.');
          }
        });

        customStatsDB.run(`
          CREATE TABLE IF NOT EXISTS composite_stats (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            player_id INTEGER,
            stat_group TEXT,
            stat_value DECIMAL(10, 2),
            FOREIGN KEY (player_id) REFERENCES players(id)
          )
        `, (err) => {
          if (err) {
            console.error('Error creating composite_stats table:', err.message);
          } else {
            console.log('composite_stats table checked/created.');
          }
        });
    
        console.log("Database initialization complete.");
      });
};


module.exports = customStatsDB;