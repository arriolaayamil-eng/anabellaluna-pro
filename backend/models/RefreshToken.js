const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  userId:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  tokenHash:  { type: String, required: true, unique: true },
  familyId:   { type: String, required: true, index: true }, // UUID generado al primer login
  expiresAt:  { type: Date, required: true },
  revokedAt:  { type: Date, default: null },
  device:     { type: String, default: 'unknown' },
}, { timestamps: true });

schema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // TTL auto-cleanup

module.exports = mongoose.model('RefreshToken', schema);
