const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'Database', 'login.sqlite');

const loginDB = new sqlite3.Database(dbPath, (err) => {
    if(err) {
        console.log("Error opening database: ", err);
    } else{
        console.log("Connected to Login Database");
        initializeDatabase();
    }
});

function initializeDatabase() {
    loginDB.serialize(() => {
        loginDB.run(`
            CREATE TABLE IF NOT EXISTS login (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email VARCHAR(255) UNIQUE,
            password VARCHAR(255),
            is_admin BOOLEAN DEFAULT 0
            )`
        , (err) => {
            if(err) {
                console.log("Error creating login table: ", err);
            } else {
                console.log('login table checked/created');
            }
        });
    });
}

module.exports = loginDB;