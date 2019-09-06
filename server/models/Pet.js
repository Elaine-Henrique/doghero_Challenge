const mongoose = require('mongoose');

const { Schema } = mongoose;

const petSchema = new Schema({
  name: { type: String, required: true },
  size: { type: String, required: true },
  info: { type: String },
  image: {
    type: String,
    default: 'https://res.cloudinary.com/dbjyysrv0/image/upload/v1567565837/happy.png',
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
},
{
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
});

const Pet = mongoose.model('Pet', petSchema);
module.exports = Pet;
