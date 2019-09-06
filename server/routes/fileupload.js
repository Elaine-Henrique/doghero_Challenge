const express = require('express');
const cloudinary = require('../config/cloudinary.js');

const router = express.Router();

router.post('/upload', cloudinary.single('image'), (req, res, next) => {
  if (!req.file) {
    next(new Error('No file uploaded!'));
    return;
  }
  res.json({ secure_url: req.file.secure_url });
});

module.exports = router;
