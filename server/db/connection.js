require('dotenv').config();

const mongoose = require('mongoose');

module.exports = () => {
  mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true })
    .then(() => {
      console.log('connected to mongodb');
    })
    .catch((err) => {
      throw new Error(err);
    });
};
