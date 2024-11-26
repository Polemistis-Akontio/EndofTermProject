const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'Database', 'database.sqlite');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database.');
    initializeDatabase();
  }
});

// Function to initialize tables if they don't exist
function initializeDatabase() {
  db.serialize(() => {
    db.run(`
      CREATE TABLE IF NOT EXISTS teams (
        id INT PRIMARY KEY,
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

    db.run(`
      CREATE TABLE IF NOT EXISTS teamRecords (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        team_id INT,
        record_type VARCHAR(20),
        summary VARCHAR(20),
        games_played INT,
        wins INT,
        losses INT,
        ties INT,
        win_percent DECIMAL(5, 4),
        points DECIMAL(10, 2),
        points_for INT,
        points_against INT,
        point_differential INT,
        division_wins INT,
        division_losses INT,
        division_ties INT,
        division_record DECIMAL(5, 4),
        division_win_percent DECIMAL(5, 4),
        streak INT,
        games_behind DECIMAL(10, 2),
        playoff_seed INT,
        avg_points_for DECIMAL(5, 4),
        avg_points_against DECIMAL(5, 4),
        ot_losses INT,
        ot_wins INT,
        FOREIGN KEY (team_id) REFERENCES teams(id)
      )
    `, (err) => {
      if (err) {
        console.error('Error creating teamRecords table:', err.message);
      } else {
        console.log('teamRecords table checked/created.');
      }
    });

    db.run(`
      CREATE TABLE IF NOT EXISTS teamStatCategories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name VARCHAR(255) UNIQUE,
        display_name VARCHAR(255),
        short_display_name VARCHAR(255),
        abbreviation VARCHAR(50),
        summary TEXT
        )
    `, (err) => {
      if (err) {
        console.error('Error creating teamStatsCategories table:', err.message);
      } else {
        console.log('teamStatsCategories table checked/created.');
      }
    });

    db.run(`
      CREATE TABLE IF NOT EXISTS teamYearlyStats (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        category_id INT,
        team_id INT,
        year INT,
        name VARCHAR(255),
        display_name VARCHAR(255),
        short_display_name VARCHAR(50),
        description TEXT,
        abbreviation VARCHAR(50),
        value DECIMAL(10, 2),
        display_value VARCHAR(50),
        per_game_value DECIMAL(10, 2),
        per_game_display_value VARCHAR(50),
        rank INT,
        rank_display_value VARCHAR(50),
        FOREIGN KEY (category_id) REFERENCES teamStatCategories(id),
        FOREIGN KEY (team_id) REFERENCES teams(id),
        UNIQUE (team_id, year, category_id, name)
        )
    `, (err) => {
      if (err) {
        console.error('Error creating teamYearlyStats table:', err.message);
      } else {
        console.log('teamYearlyStats table checked/created.');
      }
    });

    db.run(`
      CREATE TABLE IF NOT EXISTS players (
        id INT PRIMARY KEY,
        first_name VARCHAR(255),
        last_name VARCHAR(255),
        full_name VARCHAR(255),
        short_name VARCHAR(255),
        weight DECIMAL(5, 2),
        display_weight VARCHAR(50),
        height DECIMAL(5, 2),
        display_height VARCHAR(50),
        age INT,
        date_of_birth DATE,
        jersey_number VARCHAR(10),
        position_name VARCHAR(255),
        position_abbreviation VARCHAR(10),
        position_type VARCHAR(50),
        experience INT,
        status VARCHAR(50),
        college VARCHAR(255),
        team_id INT,
        FOREIGN KEY (team_id) REFERENCES teams(id)
        )
    `, (err) => {
      if (err) {
        console.error('Error creating players table:', err.message);
      } else {
        console.log('players table checked/created.');
      }
    });

    db.run(`
      CREATE TABLE IF NOT EXISTS playerStatsCategories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name VARCHAR(255) UNIQUE,
        display_name VARCHAR(255)
        )
    `, (err) => {
      if (err) {
        console.error('Error creating playerStatsCategories table:', err.message);
      } else {
        console.log('playerStatsCategories table checked/created.');
      }
    });

    db.run(`
      CREATE TABLE IF NOT EXISTS playerStatTypes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        category_id INT,
        name VARCHAR(255) UNIQUE,
        display_name VARCHAR(255),
        short_display_name VARCHAR (255),
        description TEXT,
        abbreviation VARCHAR(50),
        FOREIGN KEY (category_id) REFERENCES playerStatsCategories(id)
        )
    `, (err) => {
      if (err) {
        console.error('Error creating playerStatTypes table:', err.message);
      } else {
        console.log('playerStatTypes table checked/created.');
      }
    });

    db.run(`
        CREATE TABLE IF NOT EXISTS playersCareerStats (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          player_id INT,
          stat_type_id INT,
          stat_value DECIMAL(10, 2),
          display_value VARCHAR(50),
          rank INT,
          rank_display_value VARCHAR(50),
          FOREIGN KEY (player_id) REFERENCES players(id),
          FOREIGN KEY (stat_type_id) REFERENCES playerStatTypes(id)
          )
      `, (err) => {
        if (err) {
          console.error('Error creating playersCareerStats table:', err.message);
        } else {
          console.log('playersCareerStats table checked/created.');
        }
      });

      db.run(`
        CREATE TABLE IF NOT EXISTS playersYearlyStats (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          player_id INT,
          year INT,
          stat_type_id INT,
          stat_value DECIMAL(10, 2),
          display_value VARCHAR(50),
          rank INT,
          rank_display_value VARCHAR(50),
          FOREIGN KEY (player_id) REFERENCES players(id),
          FOREIGN KEY (stat_type_id) REFERENCES playerStatTypes(id)
          )
      `, (err) => {
        if (err) {
          console.error('Error creating playersYearlyStats table:', err.message);
        } else {
          console.log('playersYearlyStats table checked/created.');
        }
      });
  });
}

module.exports = db;