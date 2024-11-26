const express = require('express');
const router = express.Router();

// Define your routes
router.get('/api/login', (req, res) => {
    res.send('Welcome to the Server!');
});

const app = express();
app.use('/', router);

module.exports = app;