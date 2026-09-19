const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const apiRoutes = require('./routes/api.routes');
const datastore = require('./services/datastore');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logger
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString().split('T')[1].slice(0, 8)}] ${req.method} ${req.url}`);
  next();
});

const fs = require('fs');

// Mount API routes first
app.use('/api', apiRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    database: datastore.isMongoConnected ? 'MongoDB' : 'In-Memory (1,250 records)',
    recordsLoaded: datastore.students.length
  });
});

// Serve static frontend in production if built (enables 1-click single-port deployment on Render/Railway/VPS)
const frontendDist = path.join(__dirname, '../frontend/dist');
if (fs.existsSync(frontendDist)) {
  console.log(`[Production] Serving static frontend from: ${frontendDist}`);
  app.use(express.static(frontendDist));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/health')) {
      return next();
    }
    res.sendFile(path.join(frontendDist, 'index.html'));
  });
} else {
  // API Root endpoint when frontend is not co-located
  app.get('/', (req, res) => {
    res.json({
      project: 'DropoutGuard AI Backend API',
      version: '1.0.0',
      status: 'online',
      endpoints: {
        dashboard: '/api/dashboard',
        students: '/api/students',
        risk: '/api/risk/:id',
        simulate: '/api/simulate',
        interventions: '/api/interventions',
        metrics: '/api/metrics'
      }
    });
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

// Start Server
async function startServer() {
  await datastore.init();
  app.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(`  DROPOUTGUARD AI BACKEND RUNNING ON PORT ${PORT} `);
    console.log(`  http://localhost:${PORT}`);
    console.log(`  Data storage: ${datastore.isMongoConnected ? 'MongoDB Connected' : 'In-Memory Store (1,250 Records)'}`);
    console.log(`====================================================`);
  });
}

startServer();
