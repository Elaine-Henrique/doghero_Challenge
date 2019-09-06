require('dotenv').config();

const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
const DatabaseConnection = require('./db/connection');
require('./passport/passport.js');

// Start Express
const app = express();

// Database Connection
DatabaseConnection();

// Session
app.use(session({
  secret: 'some secret goes here',
  resave: true,
  saveUninitialized: true,
  cookie: { maxAge: 3600000 },
}));

// Passport
app.use(passport.initialize());
app.use(passport.session());

// CORS
app.use(cors({
  credentials: true,
  origin: ['http://localhost:3000'],
}));

// Routes Response Listener
app.use(morgan('combined'));

// Body Parser Init
app.use(bodyParser.json());

// Requiring Endpoints
const authRoutes = require('./routes/auth');
const fileUpload = require('./routes/fileupload');
const users = require('./routes/user');
const pets = require('./routes/pet');
const walks = require('./routes/fileupload');

app.use('/api', authRoutes);
app.use('/api', fileUpload);
app.use('/api', users);
app.use('/api', pets);
app.use('/api', walks);


module.exports = app;
