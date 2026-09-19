const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  role: {
    type: String,
    enum: ['admin', 'faculty', 'student'],
    default: 'faculty'
  },
  department: {
    type: String,
    default: 'Computer Science & Engineering'
  },
  // Enterprise Customization Fields
  institutionName: {
    type: String,
    default: 'Apex University of Technology'
  },
  campus: {
    type: String,
    default: 'Main Campus'
  },
  designation: {
    type: String,
    default: 'Faculty Advisor'
  },
  identifier: {
    type: String,
    default: ''
  },
  phone: {
    type: String,
    default: ''
  },
  specialization: {
    type: String,
    default: ''
  },
  officeLocation: {
    type: String,
    default: ''
  },
  notificationsEnabled: {
    type: Boolean,
    default: true
  },
  avatar: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', userSchema);
