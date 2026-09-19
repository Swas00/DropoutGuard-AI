const express = require('express');
const router = express.Router();

const authController = require('../controllers/auth.controller');
const studentController = require('../controllers/student.controller');
const dashboardController = require('../controllers/dashboard.controller');
const riskController = require('../controllers/risk.controller');
const interventionController = require('../controllers/intervention.controller');
const lmsController = require('../controllers/lms.controller');

// ----------------------------------------------------
// Authentication Endpoints
// ----------------------------------------------------
router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);
router.get('/auth/me', authController.getMe);
router.get('/auth/demo-accounts', authController.getDemoAccounts);

// ----------------------------------------------------
// Dashboard summary endpoint
// ----------------------------------------------------
router.get('/dashboard', dashboardController.getDashboardData);

// ----------------------------------------------------
// Student CRUD & Ingestion endpoints
// ----------------------------------------------------
router.get('/students', studentController.getStudents);
router.get('/students/:id', studentController.getStudentById);
router.post('/students', studentController.createStudent);
router.put('/students/:id', studentController.updateStudent);
router.delete('/students/:id', studentController.deleteStudent);
router.post('/students/bulk-import', studentController.bulkImportStudents);

// ----------------------------------------------------
// Risk analysis & simulation endpoints
// ----------------------------------------------------
router.get('/risk/:id', riskController.getRiskById);
router.post('/simulate', riskController.simulate);
router.get('/metrics', riskController.getModelMetrics);

// ----------------------------------------------------
// Intervention endpoints
// ----------------------------------------------------
router.get('/interventions', interventionController.getInterventions);
router.get('/interventions/:id', interventionController.getInterventionById);
router.post('/interventions', interventionController.createIntervention);
router.patch('/interventions/:id', interventionController.updateInterventionStatus);
router.post('/explain', interventionController.generateAiInterventionText);

// ----------------------------------------------------
// LMS & SIS Connector endpoints (LTI 1.3 Advantage)
// ----------------------------------------------------
router.get('/lms/connectors', lmsController.getConnectors);
router.post('/lms/connectors/:provider/config', lmsController.updateConfig);
router.post('/lms/connectors/:provider/test', lmsController.testConnection);
router.post('/lms/connectors/:provider/sync', lmsController.syncTelemetry);
router.get('/lms/sync-history', lmsController.getSyncHistory);

module.exports = router;
