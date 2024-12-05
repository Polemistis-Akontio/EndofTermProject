require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../loginDBInitialize');

const normalizeEmail = (email) => email?.trim().toLowerCase();

const login = (req, res) => {
  let { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }
  email = normalizeEmail(email);
  const query = `SELECT * FROM login WHERE email = ?`;
  db.get(query, [email], (err, user) => {
    if (err) {
      return res.status(500).json({ error: 'Database error', details: err.message });
    }
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err || !isMatch) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      const token = jwt.sign({ id: user.id, is_admin: user.is_admin }, process.env.JWT_SECRET, {expiresIn: '12h'});
      return res.status(200).json({ message: 'Login successful', token });
    });
  });
};

const register = (req, res) => {
  let { email, password, is_admin } = req.body;
  console.log(req.body);

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  email = normalizeEmail(email);

  // Check if the email is already in use
  const query = `SELECT * FROM login WHERE email = ?`;
  db.get(query, [email], (err, existingUser) => {
    if (err) {
      return res.status(500).json({ error: 'Database error', details: err.message });
    }

    if (existingUser) {
      return res.status(400).json({ error: 'Email is already in use' }); // Email already exists
    }

    // If the email is not in use, hash the password and proceed with registration
    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) {
        return res.status(500).json({ error: 'Error hashing password', details: err.message });
      }

      // Insert the new user into the database
      const insertQuery = `INSERT INTO login (email, password, is_admin) VALUES (?, ?, ?)`;
      db.run(insertQuery, [email, hashedPassword, is_admin || 0], function (err) {
        if (err) {
          return res.status(500).json({ error: 'Database error', details: err.message });
        }

        // Generate JWT token for the newly registered user
        const token = jwt.sign(
          { id: this.lastID, is_admin: is_admin || 0 }, 
          process.env.JWT_SECRET, 
          { expiresIn: '12h' }
        );

        return res.status(201).json({
          message: 'User registered successfully',
          token: token
        });
      });
    });
  });
};


const viewProfile = (req, res) => {
  const { id } = req.user;
  const query = `SELECT id, email, is_admin FROM login WHERE id = ?`;
  db.get(query, [id], (err, user) => {
    if (err) {
      return res.status(500).json({ error: 'Database error', details: err.message });
    }
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.status(200).json({ user });
  });
};

const updateProfile = (req, res) => {
  const { id } = req.user;
  let { email, password } = req.body;

  if (!email && !password) {
    return res.status(400).json({ error: 'Nothing to update' });
  }

  email = email ? normalizeEmail(email) : null;

  if (password) {
    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) {
        return res.status(500).json({ error: 'Error hashing password', details: err.message });
      }

      const query = `UPDATE login SET email = ?, password = ? WHERE id = ?`;
      db.run(query, [email, hashedPassword, id], function (err) {
        if (err) {
          return res.status(500).json({ error: 'Database error', details: err.message });
        }
        return res.status(200).json({ message: 'Profile updated successfully' });
      });
    });
  } else {
    const query = `UPDATE login SET email = ? WHERE id = ?`;
    db.run(query, [email, id], function (err) {
      if (err) {
        return res.status(500).json({ error: 'Database error', details: err.message });
      }
      return res.status(200).json({ message: 'Profile updated successfully' });
    });
  }
};

const deleteProfile = (req, res) => {
  const { id } = req.user;

  const query = `DELETE FROM login WHERE id = ?`;
  db.run(query, [id], function (err) {
    if (err) {
      return res.status(500).json({ error: 'Database error', details: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.status(200).json({ message: 'Profile deleted successfully' });
  });
};

module.exports = { login, register, viewProfile, updateProfile, deleteProfile };