const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const passport = require('passport');
const User = require('../models/User');

passport.serializeUser((loggedInUser, cb) => {
  console.log('serialize');
  cb(null, loggedInUser.id);
});

passport.deserializeUser((userIdFromSession, cb) => {
  console.log('deserialize');
  User.findById(userIdFromSession)
    .populate('pets favoriteDogWalker')
    .then((userDocument) => {
      cb(null, userDocument);
    })
    .catch((err) => {
      cb(err);
    });
});

passport.use(new LocalStrategy((username, password, next) => {
  User.findOne({ username }, (err, foundUser) => {
    if (err) {
      next(err);
      return;
    }
    if (!foundUser) {
      next(null, false, { message: 'Incorrect username.' });
      return;
    }
    if (!bcrypt.compareSync(password, foundUser.password)) {
      next(null, false, { message: 'Incorrect password.' });
      return;
    }
    next(null, foundUser);
  });
}));
