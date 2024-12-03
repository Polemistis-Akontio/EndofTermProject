require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./databaseInitialize'); // Import the database connection
const loginDb = require('./loginDBInitialize'); //Import the other database connection
const customStatsDB = require('./customStatsInitialize'); //import 3rd database
const loginRoute = require('./Routes/loginRoute');
const statsRoute = require('./Routes/statsRoute');
const customStatsRoute = require('./Routes/customStatsRoute');

const app = express();
app.use(express.json());
app.use(cors());

app.use('/auth', loginRoute);
app.use('/api/stats', statsRoute);
app.use('/api/customStats', customStatsRoute);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

process.on('SIGINT', async () => {
  try {
    await Promise.all([
      new Promise((resolve, reject) =>
        db.close((err) => (err ? reject(err) : resolve('Stats Database closed.')))
      ),
      new Promise((resolve, reject) =>
        loginDb.close((err) => (err ? reject(err) : resolve('Login Database closed.')))
      ),
      new Promise((resolve, reject) =>
        customStatsDB.close((err) => (err ? reject(err) : resolve('CustomStats Database closed.')))
      ),
    ]);
    console.log('All databases closed successfully.');
    process.exit(0);
  } catch (err) {
    console.error('Error closing databases:', err.message);
    process.exit(1);
  }
});