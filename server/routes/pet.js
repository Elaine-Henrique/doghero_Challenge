const express = require('express');
const mongoose = require('mongoose');
const Pet = require('../models/Pet');
const User = require('../models/User');

const router = express.Router();

// GET - all pets from user
router.get('/pets', (req, res) => {
  Pet.find({ owner: req.user.id })
    .populate('owner')
    .then((response) => {
      res.status(200).json({ response });
    })
    .catch(err => res.json(err));
});

// GET:id - Specific Pet
router.get('/pets/:id', (req, res) => {
  Pet.findOne({ _id: req.params.id })
    .populate('owner')
    .then((response) => {
      res.status(200).json({ response });
    })
    .catch((err) => {
      throw new Error(err);
    });
});

// PUT - Edit current pet
router.put('/pets/:id', (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400).json({ message: 'Specified id is not valid' });
    return;
  }
  const { name, size, image, info } = req.body;

  User.findByIdAndUpdate(req.user.id, {
    $set: { pets: req.params.id },
  })
    .then(() => {
      Pet.findOneAndUpdate({ _id: req.params.id }, { $set: {name, size, image, info } })
        .then((response) => {
          res.json({ response });
        })
        .catch((err) => {
          res.status(400).json(err);
        });
    });
});

// DELETE
router.delete('/pets/:id', (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400).json({ message: 'Specified id is not valid' });
    return;
  }
  Pet.findOneAndRemove({ _id: req.params.id })
    .then(() => {
      res.json({
        message: 'Successfully Deleted',
      });
    });
});

// POST - Create a new pet
router.post('/pets', (req, res) => {
  const { name, size, image, info } = req.body;
  if (name === '' || size === '') {
    res.status(400).json({ message: 'Please fill name and description fields' });
    return;
  }
  const newPet = new Pet({
    name,
    size,
    image,
    info,
    owner: req.user.id,
  });

  newPet
    .save()
    .then(((pet) => {
      User.findByIdAndUpdate(req.user.id, {
        $push: { pets: pet },
      })
        .then(user => res.status(200).json(user))
        .catch(err => res.status(400).json({ message: err }));
    })
      .catch(err => res.status(400).json({ message: err })));
});

module.exports = router;
