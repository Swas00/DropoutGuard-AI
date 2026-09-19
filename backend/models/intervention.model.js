const mongoose = require('mongoose');

const interventionSchema = new mongoose.Schema({
  studentId: { type: String, required: true, index: true },
  recommendation: { type: String, required: true },
  actionType: { type: String, default: 'Academic Tutoring' },
  priority: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH'], default: 'MEDIUM' },
  status: { type: String, enum: ['Pending', 'In-Progress', 'Completed'], default: 'Pending' },
  assignedFaculty: { type: String, default: 'Dr. Ramesh Rao (Faculty Mentor)' },
  notes: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.models.Intervention || mongoose.model('Intervention', interventionSchema);
