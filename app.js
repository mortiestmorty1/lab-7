const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const flash = require('connect-flash');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Passport Config (Assuming you've set this up in config/passport.js)
require('./config/passport')(passport);

// DB Config
const db = process.env.MONGODB_URI;

// Connect to MongoDB
mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// EJS
app.set('view engine', 'ejs');

// Bodyparser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Express Session
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true,
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect Flash
app.use(flash());

// Global Vars
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

// Routes
const users = require('./routes/users');
const tasks = require('./routes/tasks');

app.use('/users', users);
app.use('/tasks', tasks);

app.get('/', (req, res) => res.render('welcome'));

// Access Control
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash('error_msg', 'Please log in to view that resource');
  res.redirect('/users/login');
}

app.get('/dashboard', ensureAuthenticated, (req, res) => res.render('dashboard', {
  user: req.user
}));

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
