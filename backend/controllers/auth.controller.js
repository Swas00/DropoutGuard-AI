const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const datastore = require('../services/datastore');

const JWT_SECRET = process.env.JWT_SECRET || 'dropoutguard-secret-key-2026';

function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

function sanitizeUser(user) {
  const { password, ...safe } = user;
  return safe;
}

exports.register = async (req, res) => {
  try {
    const { 
      name, 
      email, 
      password, 
      role = 'faculty', 
      department = 'Computer Science & Engineering',
      institutionName = 'Apex University of Technology',
      campus = 'Main Campus',
      designation,
      identifier,
      phone,
      specialization,
      officeLocation,
      notificationsEnabled = true
    } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required.'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long.'
      });
    }

    const existing = datastore.findUserByEmail(email);
    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email address already exists.'
      });
    }

    const newUser = await datastore.createUser({
      name,
      email,
      password,
      role,
      department,
      institutionName,
      campus,
      designation: designation || (role === 'admin' ? 'Dean & Administrator' : role === 'student' ? 'Student Scholar' : 'Faculty Advisor'),
      identifier: identifier || `ID-${Date.now().toString().slice(-4)}`,
      phone: phone || '',
      specialization: specialization || '',
      officeLocation: officeLocation || '',
      notificationsEnabled
    });

    const token = generateToken(newUser);

    return res.status(201).json({
      success: true,
      message: 'User registered successfully.',
      token,
      user: sanitizeUser(newUser)
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error during registration.'
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required.'
      });
    }

    const user = datastore.findUserByEmail(email);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. User not found.'
      });
    }

    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. Incorrect password.'
      });
    }

    const token = generateToken(user);

    return res.json({
      success: true,
      message: 'Login successful.',
      token,
      user: sanitizeUser(user)
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error during login.'
    });
  }
};

exports.getMe = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'No authorization token provided.'
      });
    }

    const token = authHeader.split(' ')[1];
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired authorization token.'
      });
    }

    const user = datastore.findUserById(decoded.id) || datastore.findUserByEmail(decoded.email);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User profile no longer exists.'
      });
    }

    return res.json({
      success: true,
      user: sanitizeUser(user)
    });
  } catch (error) {
    console.error('getMe error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to authenticate user.'
    });
  }
};

exports.getDemoAccounts = (req, res) => {
  res.json({
    success: true,
    accounts: [
      {
        role: 'admin',
        name: 'Dr. Aris Thorne',
        title: 'Dean of Academic Affairs',
        email: 'admin@apex.edu',
        password: 'Admin@2026',
        avatar: 'AT',
        description: 'Full institutional administrative access, data CRUD, ML diagnostics.'
      },
      {
        role: 'faculty',
        name: 'Prof. Ananya Sen',
        title: 'Faculty Advisor & Mentor',
        email: 'faculty@apex.edu',
        password: 'Faculty@2026',
        avatar: 'AS',
        description: 'Advising workflows, intervention dispatch, What-If counterfactual modeling.'
      },
      {
        role: 'student',
        name: 'Aarav Sharma',
        title: 'B.Tech Student (STU1024)',
        email: 'student@apex.edu',
        password: 'Student@2026',
        avatar: 'AS',
        description: 'Student academic wellness portal, milestone tracker, advisor consultations.'
      }
    ]
  });
};
