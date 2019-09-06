const mongoose = require('mongoose');

const { Schema } = mongoose;

const userSchema = new Schema({
  // User and Dog Walker
  name: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
  image: {
    type: String,
    default: 'https://icon-library.net/images/default-profile-icon/default-profile-icon-24.jpg',
  },
  role: {
    type: String,
    enum: ['User', 'DogWalker'],
  },

  // User
  favoriteDogWalker: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
  }],
  pets: [{
    type: Schema.Types.ObjectId,
    ref: 'Pet',
  }],
  walks: [{
    type: Schema.Types.ObjectId,
    ref: 'Walk',
  }],
},
{
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
