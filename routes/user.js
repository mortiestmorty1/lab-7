const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const User = require('../models/user');

// Register Handle
router.post('/register', (req, res) => {
  const { email, password } = req.body;
  let errors = [];

  // Check required fields
  if (!email || !password) {
    errors.push({ msg: 'Please fill in all fields' });
  }

  if (errors.length > 0) {
    res.status(400).json({ errors, email, password });
  } else {
    // Validation passed
    User.findOne({ email: email }).then(user => {
      if (user) {
        errors.push({ msg: 'Email is already registered' });
        res.status(400).json({ errors, email, password });
      } else {
        const newUser = new User({
          email,
          password
        });

        newUser.save()
          .then(user => {
            req.flash('success_msg', 'You are now registered and can log in');
            res.redirect('/users/login');
          })
          .catch(err => console.log(err));
      }
    });
  }
});

// Login Handle
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
});

// Logout Handle
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/users/login');
});

module.exports = router;
