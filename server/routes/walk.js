const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();
const Walks = require('../models/Walk');
const User = require('../models/User');


// List All avaliables Walks
router.get('/walk', (req, res) => {
  Walks.find({ avaliable: 'true' })
    .populate('owner pet')
    .then(walks => res.json(walks))
    .catch(err => res.json(err));
});

// Create a Walk
router.post('/walk', (req, res) => {
  const { day, time, where, pet } = req.body;

  const newWalk = new Walks({
    day,
    time,
    where,
    avaliable: 'True',
    pet,
    owner: req.user,
  });

  newWalk
    .save()
    .then((walk) => {
      User.findByIdAndUpdate(req.user.id, { $push: { walk } })
        .then(user => res.status(200).json(user))
        .catch(err => res.status(400).json(err));

      // notice to favorite
      // User.find(req.user.id)
      //   .then(res => {res.favoriteDogWalker.map(walker =>  {
      //   })})
    })
    .catch(err => res.status(400).json(err));
});

// Route to accepted from walker
router.put('/walk/:id', (req, res) => {
  Walks.findOneAndUpdate({ _id: req.params.id }, { avaliable: 'False', walker: req.user })
    .then(res => res.status(200).json(res))
    .catch(err => res.status(400).json(err));
});

// Delete Walk
router.delete('/walk/:id', (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400).json({ message: 'Specified id is not valid' });
    return;
  }

  User.findByIdAndUpdate(req.user.id, {
    $pull: { walk: req.params.id },
  })
    .then(() => {
      Walks.findByIdAndRemove(req.params.id)
        .then(() => {
          res.json({
            message: 'Walk was removed successfully.',
          });
        })
        .catch(err => res.json(err));
    })
    .catch((err) => {
      res.json(err);
    });
});

module.exports = router;
