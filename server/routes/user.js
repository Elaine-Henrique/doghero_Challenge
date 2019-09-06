const express = require('express');
const mongoose = require('mongoose');
const User = require('../models/User');

const router = express.Router();

// List All dog walkers
router.get('/walkers', (req, res) => {
  User.find({ role: 'DogWalker' })
    .then(dogs => res.json(dogs))
    .catch(err => res.json(err));
});

// GET:id - Specific user
router.get('/user/:id', (req, res) => {
  User.findById({ _id: req.params.id })
    .populate('favoriteDogWalker pets walks')
    .then((response) => {
      res.status(200).json({ response });
    })
    .catch((err) => {
      res.json(err);
    });
});

// PUT - Edit current logged user
router.put('/user/:id', (req, res) => {
  const { name, image } = req.body;
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400).json({ message: 'Specified id is not valid' });
    return;
  }
  User.findByIdAndUpdate({ _id: req.params.id }, { $set: {
    name, image }
  })
    .then(() => {
      res.json({ message: 'Successfully Updated' });
    })
    .catch((err) => {
      res.json(err);
    });
});

// PUT - Remove favorite Dog Walker
router.put('/remove-favorite/:id', (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400).json({ message: 'Specified id is not valid' });
    return;
  }
  User.findByIdAndUpdate(req.user.id, { $pull: { favoriteDogWalker: req.params.id } })
    .then(() => {
      res.json({ message: 'Successfully Updated' });
    })
    .catch(err => res.status(400).json(err));
});


// PATCH - Add favorite Dog Walker
router.patch('/add-favorite/:id', (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400).json({ message: 'Specified id is not valid' });
    return;
  }
  User.findByIdAndUpdate(req.user.id, { $push: { favoriteDogWalker: req.params.id } })
    .then(() => {
      res.json({ message: 'Successfully Updated' });
    })
    .catch(err => res.status(400).json(err));
});

// DELETE
router.delete('/user/:id', (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400).json({ message: 'Specified id is not valid' });
    return;
  }
  User.findOneAndRemove({ _id: req.params.id })
    .then(() => {
      res.json({
        message: 'Successfully Deleted',
      });
    });
});

module.exports = router;
