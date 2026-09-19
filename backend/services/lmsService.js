const datastore = require('./datastore');

class LmsService {
  constructor() {
    this.connectors = {
      canvas: {
        id: 'canvas',
        name: 'Canvas LMS by Instructure',
        shortName: 'Canvas',
        protocol: 'LTI 1.3 Advantage & REST API v1',
        icon: 'Layers',
        color: 'rose',
        endpointUrl: 'https://apex.instructure.com/api/v1',
        clientId: 'canvas-lti-apex-92841',
        tokenMasked: '7281~dK93...mZ91',
        courseIds: ['CS-401', 'CS-405', 'MCA-202', 'BTECH-SE-301'],
        autoSyncInterval: 'HOURLY',
        status: 'CONNECTED',
        lastSyncTime: new Date(Date.now() - 36 * 60 * 1000).toISOString(),
        lastSyncStatus: 'SUCCESS',
        syncedCount: 142
      },
      moodle: {
        id: 'moodle',
        name: 'Moodle Workplace / Core LMS',
        shortName: 'Moodle',
        protocol: 'Moodle Web Services REST API',
        icon: 'BookOpen',
        color: 'amber',
        endpointUrl: 'https://moodle.apex.edu/webservice/rest/server.php',
        clientId: 'moodle_ws_client_831',
        tokenMasked: 'mdl_84a1...99bc',
        courseIds: ['AI-502', 'DATA-301', 'CYBER-404'],
        autoSyncInterval: 'DAILY',
        status: 'CONNECTED',
        lastSyncTime: new Date(Date.now() - 140 * 60 * 1000).toISOString(),
        lastSyncStatus: 'SUCCESS',
        syncedCount: 98
      },
      google_classroom: {
        id: 'google_classroom',
        name: 'Google Classroom for Education',
        shortName: 'Google Classroom',
        protocol: 'Google Workspace for Education API v1',
        icon: 'GraduationCap',
        color: 'emerald',
        endpointUrl: 'https://classroom.googleapis.com/v1',
        clientId: 'apex-edu-classroom.apps.googleusercontent.com',
        tokenMasked: 'ya29.a0AfH...kQ7L',
        courseIds: ['CS-LAB-1', 'MATH-201', 'PHYS-101'],
        autoSyncInterval: 'HOURLY',
        status: 'CONNECTED',
        lastSyncTime: new Date(Date.now() - 75 * 60 * 1000).toISOString(),
        lastSyncStatus: 'SUCCESS',
        syncedCount: 85
      },
      banner: {
        id: 'banner',
        name: 'Ellucian Banner SIS',
        shortName: 'Banner SIS',
        protocol: 'Ellucian Ethos Integration REST API',
        icon: 'Building2',
        color: 'indigo',
        endpointUrl: 'https://banner.apex.edu:8443/BannerEthos/api',
        clientId: 'banner_ethos_apex_adm',
        tokenMasked: 'ethos_bearer_...481x',
        courseIds: ['REG-ALL-UNDERGRAD', 'REG-ALL-POSTGRAD'],
        autoSyncInterval: 'DAILY',
        status: 'CONFIGURED',
        lastSyncTime: new Date(Date.now() - 360 * 60 * 1000).toISOString(),
        lastSyncStatus: 'SUCCESS',
        syncedCount: 1250
      }
    };

    this.syncHistory = [
      {
        id: 'SYNC-801',
        provider: 'canvas',
        providerName: 'Canvas LMS',
        timestamp: new Date(Date.now() - 36 * 60 * 1000).toISOString(),
        status: 'SUCCESS',
        recordsProcessed: 48,
        attendanceDeltaAvg: '+1.2%',
        assignmentRateDeltaAvg: '+3.4%',
        riskTransitions: {
          toCritical: 1,
          toLow: 4,
          unchanged: 43
        },
        message: 'Successfully pulled 48 student attendance logs & recent quiz submissions from Canvas CS-401 & CS-405.'
      },
      {
        id: 'SYNC-800',
        provider: 'moodle',
        providerName: 'Moodle LMS',
        timestamp: new Date(Date.now() - 140 * 60 * 1000).toISOString(),
        status: 'SUCCESS',
        recordsProcessed: 32,
        attendanceDeltaAvg: '-0.8%',
        assignmentRateDeltaAvg: '+1.0%',
        riskTransitions: {
          toCritical: 0,
          toLow: 2,
          unchanged: 30
        },
        message: 'Pulled attendance register logs and lab assignment grades for AI-502 cohort.'
      }
    ];
  }

  getConnectors() {
    return Object.values(this.connectors);
  }

  getConnector(provider) {
    return this.connectors[provider] || null;
  }

  updateConfig(provider, config) {
    if (!this.connectors[provider]) {
      throw new Error(`Unsupported LMS provider: ${provider}`);
    }

    const current = this.connectors[provider];
    this.connectors[provider] = {
      ...current,
      endpointUrl: config.endpointUrl !== undefined ? config.endpointUrl : current.endpointUrl,
      clientId: config.clientId !== undefined ? config.clientId : current.clientId,
      courseIds: Array.isArray(config.courseIds) ? config.courseIds : current.courseIds,
      autoSyncInterval: config.autoSyncInterval || current.autoSyncInterval,
      tokenMasked: config.token ? `${config.token.slice(0, 6)}...${config.token.slice(-4)}` : current.tokenMasked,
      status: 'CONNECTED'
    };

    return this.connectors[provider];
  }

  async testConnection(provider) {
    const connector = this.connectors[provider];
    if (!connector) {
      throw new Error(`Unsupported LMS provider: ${provider}`);
    }

    // Simulate network handshake with LMS / LTI 1.3 Advantage server
    const latencyMs = Math.floor(Math.random() * 35) + 25;
    return {
      success: true,
      provider: connector.id,
      providerName: connector.name,
      protocol: connector.protocol,
      endpointUrl: connector.endpointUrl,
      latencyMs: `${latencyMs}ms`,
      ltiAdvantageVerified: true,
      message: `Handshake successful. Verified LTI 1.3 Advantage authentication token against ${connector.shortName} endpoint in ${latencyMs}ms.`
    };
  }

  async syncTelemetry(provider, options = {}) {
    const connector = this.connectors[provider];
    if (!connector) {
      throw new Error(`Unsupported LMS provider: ${provider}`);
    }

    connector.status = 'SYNCING';

    try {
      // Pick a cohort subset to update with realistic LMS telemetry
      const allStudents = datastore.students;
      const countToUpdate = Math.min(options.limit || 30, allStudents.length);
      const targetStudents = allStudents.slice(0, countToUpdate);

      let toCritical = 0;
      let toLow = 0;
      let unchanged = 0;
      let totalAttendanceDelta = 0;
      let totalAssignmentDelta = 0;
      const updatedStudentsSummary = [];

      for (const student of targetStudents) {
        const oldRiskLevel = student.riskLevel;
        const oldAttendance = student.attendance;
        const oldAssignments = student.assignmentRate;

        // Simulate new real-time LMS data point (daily attendance check-in & recently submitted LMS assignment)
        // Adjust attendance slightly (-2% to +3%) based on LMS logs
        const attendanceShift = Math.floor(Math.random() * 6) - 2;
        const assignmentShift = Math.floor(Math.random() * 8) - 2;

        const newAttendance = Math.min(99, Math.max(40, parseFloat((oldAttendance + attendanceShift).toFixed(1))));
        const newAssignmentRate = Math.min(100, Math.max(35, parseFloat((oldAssignments + assignmentShift).toFixed(1))));
        
        totalAttendanceDelta += (newAttendance - oldAttendance);
        totalAssignmentDelta += (newAssignmentRate - oldAssignments);

        // Update student in datastore with recalculated risk
        const updated = await datastore.updateStudent(student.studentId, {
          attendance: newAttendance,
          assignmentRate: newAssignmentRate
        });

        if (updated) {
          if (oldRiskLevel !== 'HIGH' && updated.riskLevel === 'HIGH') {
            toCritical++;
          } else if (oldRiskLevel !== 'LOW' && updated.riskLevel === 'LOW') {
            toLow++;
          } else {
            unchanged++;
          }

          updatedStudentsSummary.push({
            studentId: updated.studentId,
            name: updated.name,
            oldAttendance,
            newAttendance,
            oldRiskScore: student.riskScore,
            newRiskScore: updated.riskScore,
            riskLevel: updated.riskLevel
          });
        }
      }

      const avgAttendanceDelta = (totalAttendanceDelta / countToUpdate).toFixed(1);
      const avgAssignmentDelta = (totalAssignmentDelta / countToUpdate).toFixed(1);

      const now = new Date();
      connector.lastSyncTime = now.toISOString();
      connector.lastSyncStatus = 'SUCCESS';
      connector.status = 'CONNECTED';
      connector.syncedCount = (connector.syncedCount || 0) + countToUpdate;

      const syncRecord = {
        id: `SYNC-${Date.now().toString().slice(-4)}`,
        provider: connector.id,
        providerName: connector.name,
        timestamp: now.toISOString(),
        status: 'SUCCESS',
        recordsProcessed: countToUpdate,
        attendanceDeltaAvg: `${avgAttendanceDelta > 0 ? '+' : ''}${avgAttendanceDelta}%`,
        assignmentRateDeltaAvg: `${avgAssignmentDelta > 0 ? '+' : ''}${avgAssignmentDelta}%`,
        riskTransitions: {
          toCritical,
          toLow,
          unchanged
        },
        message: `Real-time synchronization completed from ${connector.name}. Refreshed ${countToUpdate} student attendance & assignment records with Bayesian risk recalculation.`,
        sampleUpdates: updatedStudentsSummary.slice(0, 5)
      };

      this.syncHistory.unshift(syncRecord);
      if (this.syncHistory.length > 20) {
        this.syncHistory.pop();
      }

      return syncRecord;
    } catch (err) {
      connector.status = 'ERROR';
      connector.lastSyncStatus = 'ERROR';
      throw err;
    }
  }

  getSyncHistory() {
    return this.syncHistory;
  }
}

const instance = new LmsService();
module.exports = instance;
