const mongoose = require('mongoose');

const { Schema } = mongoose;

const walkSchema = new Schema(
  {
    day: [{ type: String }],
    time: { type: String },
    where: { type: String },
    owner: { type: Schema.Types.ObjectId, ref: 'User' },
    walker: { type: Schema.Types.ObjectId, ref: 'User' },
    pets: { type: Schema.Types.ObjectId, ref: 'Pet' },
    avaliable: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  },
);

const Walk = mongoose.model('Walk', walkSchema);
module.exports = Walk;
