const express = require('express');
const passport = require('passport');

const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/User');

// Bcrypt to encrypt passwords
const bcryptSalt = 10;


// POST - SIGNUP
router.post('/signup', (req, res) => {
  const { name, username, password, role, image } = req.body;
  if (!name || !username || !password) {
    res.json({ message: 'Please fill all required fields' });
    return;
  }
  if (password.length < 5) {
    res.json({ message: 'Please make your password at least 6 characters long for security purposes.' });
    return;
  }
  User.findOne({ username }, (err, found) => {
    if (err) {
      res.json({ message: 'Email check went bad.' });
      return;
    }
    if (found) {
      res.json({ message: 'Email already taken. Please choose another one.' });
      return;
    }
    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    const newUser = new User({
      name,
      username,
      password: hashPass,
      role,
      image,
      favoriteDogWalker: [],
      pets: [],
    });

    newUser.save((error) => {
      if (error) {
        res.json({ message: 'Saving user to database went wrong.' });
      }
    });
    req.login(newUser, (error) => {
      if (error) {
        res.json({ message: 'Login after signup went bad.' });
        return;
      }
      res.status(200).json(newUser);
    });
  });
});


// Login
router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, theUser, failureDetails) => {
    if (err) {
      res
        .status(500)
        .json({ message: 'Something went wrong when authenticating user' });
      return;
    }

    if (!theUser) {
      res.status(401).json(failureDetails);
      return;
    }

    // save user in session
    req.login(theUser, (err) => {
      if (err) {
        res.status(500).json({ message: 'Session save went bad.' });
        return;
      }
      res.status(200).json(theUser);
    });
  })(req, res, next);
});

// Logout
router.post('/logout', (req, res) => {
  req.logout();
  res.status(200).json({ message: 'Log out success!' });
});

// Check logged user
router.get('/loggedin', (req, res) => {
  if (req.isAuthenticated()) {
    res.status(200).json(req.user);
    return;
  }
  res.status(403).json({ message: 'Unauthorized' });
});

module.exports = router;
