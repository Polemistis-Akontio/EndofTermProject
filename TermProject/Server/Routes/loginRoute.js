const express = require('express');
const router = express.Router();
const { login, register, viewProfile, updateProfile, deleteProfile } = require('../Controllers/loginController');
const { authenticateToken } = require('../Controllers/authenticateToken');

router.post('/login', login);
router.post('/register', register);
router.get('/profile', authenticateToken, viewProfile);
router.put('/profile', authenticateToken, updateProfile);
router.delete('/profile', authenticateToken, deleteProfile);


module.exports = router;