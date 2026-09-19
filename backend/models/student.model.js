const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  studentId: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true },
  course: { type: String, required: true },
  semester: { type: Number, required: true },
  attendance: { type: Number, required: true },
  previousGpa: { type: Number, required: true },
  currentGpa: { type: Number, required: true },
  assignmentRate: { type: Number, required: true },
  internalMarks: { type: Number, required: true },
  backlogs: { type: Number, required: true },
  engagement: { type: Number, required: true },
  riskScore: { type: Number, default: 0 },
  riskLevel: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH'], default: 'LOW' }
}, { timestamps: true });

module.exports = mongoose.models.Student || mongoose.model('Student', studentSchema);
