const mongoose = require('mongoose');
const { Schema } = mongoose;

const orgSchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String },
    members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Organization', orgSchema);
