const mongoose = require('mongoose');

const predictionSchema = new mongoose.Schema({
  studentId: { type: String, required: true, index: true },
  riskScore: { type: Number, required: true },
  riskLevel: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH'], required: true },
  factors: [{
    factor: { type: String, required: true },
    label: { type: String, required: true },
    contribution: { type: String, required: true },
    weight: { type: Number, default: 0 },
    description: { type: String, default: '' }
  }],
  timeline: [{
    month: { type: String, required: true },
    riskScore: { type: Number, required: true }
  }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.models.Prediction || mongoose.model('Prediction', predictionSchema);
