import { DashboardStats, Student, RiskAnalysisResponse, Intervention } from './api';

// ==========================================================================
// Offline-First Calibrated Institutional Telemetry (1,250 Cohort Benchmark)
// ==========================================================================

export const DEFAULT_DASHBOARD_STATS: DashboardStats = {
  totalStudents: 1250,
  highRisk: 84,
  mediumRisk: 213,
  lowRisk: 953,
  riskDistribution: [
    { name: 'Low Risk', value: 953, color: '#10b981' },
    { name: 'Medium Risk', value: 213, color: '#f59e0b' },
    { name: 'High Risk', value: 84, color: '#f43f5e' }
  ],
  scatterData: [
    { studentId: 'STU1024', attendance: 58, riskScore: 78, currentGpa: 5.8, riskLevel: 'HIGH' },
    { studentId: 'STU1002', attendance: 52, riskScore: 84, currentGpa: 5.2, riskLevel: 'HIGH' },
    { studentId: 'STU1005', attendance: 48, riskScore: 89, currentGpa: 4.9, riskLevel: 'HIGH' },
    { studentId: 'STU1011', attendance: 61, riskScore: 74, currentGpa: 6.0, riskLevel: 'HIGH' },
    { studentId: 'STU1018', attendance: 55, riskScore: 81, currentGpa: 5.5, riskLevel: 'HIGH' },
    { studentId: 'STU1029', attendance: 63, riskScore: 71, currentGpa: 6.2, riskLevel: 'HIGH' },
    { studentId: 'STU1035', attendance: 44, riskScore: 92, currentGpa: 4.6, riskLevel: 'HIGH' },
    { studentId: 'STU1042', attendance: 59, riskScore: 76, currentGpa: 5.7, riskLevel: 'HIGH' },
    { studentId: 'STU1055', attendance: 50, riskScore: 86, currentGpa: 5.1, riskLevel: 'HIGH' },
    { studentId: 'STU1063', attendance: 64, riskScore: 68, currentGpa: 6.3, riskLevel: 'HIGH' },
    
    // Medium Risk Cluster (65% - 78% attendance, 35% - 64% risk)
    { studentId: 'STU1003', attendance: 71, riskScore: 54, currentGpa: 6.8, riskLevel: 'MEDIUM' },
    { studentId: 'STU1007', attendance: 68, riskScore: 59, currentGpa: 6.5, riskLevel: 'MEDIUM' },
    { studentId: 'STU1014', attendance: 74, riskScore: 48, currentGpa: 7.1, riskLevel: 'MEDIUM' },
    { studentId: 'STU1020', attendance: 69, riskScore: 56, currentGpa: 6.7, riskLevel: 'MEDIUM' },
    { studentId: 'STU1027', attendance: 76, riskScore: 42, currentGpa: 7.3, riskLevel: 'MEDIUM' },
    { studentId: 'STU1033', attendance: 67, riskScore: 61, currentGpa: 6.4, riskLevel: 'MEDIUM' },
    { studentId: 'STU1039', attendance: 73, riskScore: 49, currentGpa: 7.0, riskLevel: 'MEDIUM' },
    { studentId: 'STU1048', attendance: 70, riskScore: 53, currentGpa: 6.9, riskLevel: 'MEDIUM' },
    { studentId: 'STU1052', attendance: 75, riskScore: 44, currentGpa: 7.2, riskLevel: 'MEDIUM' },
    { studentId: 'STU1060', attendance: 66, riskScore: 63, currentGpa: 6.3, riskLevel: 'MEDIUM' },
    { studentId: 'STU1068', attendance: 72, riskScore: 51, currentGpa: 7.0, riskLevel: 'MEDIUM' },
    { studentId: 'STU1075', attendance: 77, riskScore: 39, currentGpa: 7.4, riskLevel: 'MEDIUM' },
    { studentId: 'STU1081', attendance: 69, riskScore: 57, currentGpa: 6.6, riskLevel: 'MEDIUM' },
    { studentId: 'STU1089', attendance: 74, riskScore: 46, currentGpa: 7.1, riskLevel: 'MEDIUM' },

    // Low Risk Cluster (80% - 99% attendance, 8% - 34% risk)
    { studentId: 'STU1001', attendance: 92, riskScore: 14, currentGpa: 8.8, riskLevel: 'LOW' },
    { studentId: 'STU1004', attendance: 88, riskScore: 19, currentGpa: 8.4, riskLevel: 'LOW' },
    { studentId: 'STU1006', attendance: 95, riskScore: 11, currentGpa: 9.1, riskLevel: 'LOW' },
    { studentId: 'STU1008', attendance: 84, riskScore: 24, currentGpa: 8.0, riskLevel: 'LOW' },
    { studentId: 'STU1009', attendance: 91, riskScore: 15, currentGpa: 8.7, riskLevel: 'LOW' },
    { studentId: 'STU1010', attendance: 86, riskScore: 22, currentGpa: 8.2, riskLevel: 'LOW' },
    { studentId: 'STU1012', attendance: 96, riskScore: 9, currentGpa: 9.4, riskLevel: 'LOW' },
    { studentId: 'STU1013', attendance: 83, riskScore: 26, currentGpa: 7.9, riskLevel: 'LOW' },
    { studentId: 'STU1015', attendance: 89, riskScore: 18, currentGpa: 8.5, riskLevel: 'LOW' },
    { studentId: 'STU1016', attendance: 94, riskScore: 12, currentGpa: 9.0, riskLevel: 'LOW' },
    { studentId: 'STU1017', attendance: 87, riskScore: 20, currentGpa: 8.3, riskLevel: 'LOW' },
    { studentId: 'STU1019', attendance: 90, riskScore: 16, currentGpa: 8.6, riskLevel: 'LOW' },
    { studentId: 'STU1021', attendance: 85, riskScore: 23, currentGpa: 8.1, riskLevel: 'LOW' },
    { studentId: 'STU1022', attendance: 98, riskScore: 8, currentGpa: 9.6, riskLevel: 'LOW' },
    { studentId: 'STU1023', attendance: 82, riskScore: 28, currentGpa: 7.8, riskLevel: 'LOW' },
    { studentId: 'STU1025', attendance: 93, riskScore: 13, currentGpa: 8.9, riskLevel: 'LOW' },
    { studentId: 'STU1026', attendance: 86, riskScore: 21, currentGpa: 8.2, riskLevel: 'LOW' },
    { studentId: 'STU1028', attendance: 91, riskScore: 15, currentGpa: 8.7, riskLevel: 'LOW' },
    { studentId: 'STU1030', attendance: 88, riskScore: 19, currentGpa: 8.4, riskLevel: 'LOW' },
    { studentId: 'STU1031', attendance: 97, riskScore: 10, currentGpa: 9.3, riskLevel: 'LOW' },
    { studentId: 'STU1032', attendance: 84, riskScore: 25, currentGpa: 8.0, riskLevel: 'LOW' },
    { studentId: 'STU1034', attendance: 89, riskScore: 17, currentGpa: 8.5, riskLevel: 'LOW' },
    { studentId: 'STU1036', attendance: 92, riskScore: 14, currentGpa: 8.8, riskLevel: 'LOW' },
    { studentId: 'STU1037', attendance: 85, riskScore: 23, currentGpa: 8.1, riskLevel: 'LOW' },
    { studentId: 'STU1038', attendance: 94, riskScore: 12, currentGpa: 9.0, riskLevel: 'LOW' },
    { studentId: 'STU1040', attendance: 87, riskScore: 20, currentGpa: 8.3, riskLevel: 'LOW' },
    { studentId: 'STU1041', attendance: 90, riskScore: 16, currentGpa: 8.6, riskLevel: 'LOW' },
    { studentId: 'STU1043', attendance: 83, riskScore: 27, currentGpa: 7.9, riskLevel: 'LOW' },
    { studentId: 'STU1044', attendance: 96, riskScore: 9, currentGpa: 9.5, riskLevel: 'LOW' },
    { studentId: 'STU1045', attendance: 88, riskScore: 18, currentGpa: 8.4, riskLevel: 'LOW' },
    { studentId: 'STU1046', attendance: 91, riskScore: 15, currentGpa: 8.7, riskLevel: 'LOW' },
    { studentId: 'STU1047', attendance: 86, riskScore: 22, currentGpa: 8.2, riskLevel: 'LOW' },
    { studentId: 'STU1049', attendance: 95, riskScore: 11, currentGpa: 9.2, riskLevel: 'LOW' },
    { studentId: 'STU1050', attendance: 82, riskScore: 29, currentGpa: 7.8, riskLevel: 'LOW' },
    { studentId: 'STU1051', attendance: 89, riskScore: 17, currentGpa: 8.5, riskLevel: 'LOW' }
  ],
  departmentRisk: [
    { department: 'Computer Science', fullCourseName: 'B.Tech Computer Science', high: 22, medium: 48, low: 230, total: 300 },
    { department: 'Information Tech', fullCourseName: 'B.Tech Information Technology', high: 16, medium: 39, low: 185, total: 240 },
    { department: 'Electronics & Comm', fullCourseName: 'B.Tech Electronics & Communication', high: 18, medium: 42, low: 180, total: 240 },
    { department: 'Mechanical Eng', fullCourseName: 'B.Tech Mechanical Engineering', high: 14, medium: 36, low: 150, total: 200 },
    { department: 'Civil Engineering', fullCourseName: 'B.Tech Civil Engineering', high: 8, medium: 26, low: 106, total: 140 },
    { department: 'Electrical Eng', fullCourseName: 'B.Tech Electrical Engineering', high: 6, medium: 22, low: 102, total: 130 }
  ],
  riskTrend: [
    { month: 'Jan', avgRisk: 22, highRiskCount: 38 },
    { month: 'Feb', avgRisk: 26, highRiskCount: 49 },
    { month: 'Mar', avgRisk: 31, highRiskCount: 62 },
    { month: 'Apr', avgRisk: 34, highRiskCount: 75 },
    { month: 'May', avgRisk: 36, highRiskCount: 84 }
  ]
};

export const DEFAULT_STUDENTS: Student[] = [
  {
    studentId: 'STU1024',
    name: 'Kavya Sharma',
    course: 'B.Tech Computer Science',
    semester: 4,
    attendance: 58,
    previousGpa: 6.7,
    currentGpa: 5.8,
    assignmentRate: 50,
    internalMarks: 61,
    backlogs: 2,
    engagement: 55,
    gpaTrend: -0.9,
    riskScore: 78,
    riskLevel: 'HIGH',
    timeline: [
      { month: 'Jan', riskScore: 21 },
      { month: 'Feb', riskScore: 28 },
      { month: 'Mar', riskScore: 44 },
      { month: 'Apr', riskScore: 61 },
      { month: 'May', riskScore: 78 }
    ],
    recommendations: [
      'Immediate faculty mentoring, academic counselling, and weekly progress monitoring.',
      'Backlog clearance roadmap & supplementary exam preparation plan.',
      'Assignment deadline reminders and academic coursework support.'
    ],
    suggestedActions: [
      'Conduct multi-stakeholder mentor meeting; establish weekly attendance & homework log.',
      'Assign faculty specialist for targeted backlog review sessions.'
    ]
  },
  {
    studentId: 'STU1005',
    name: 'Rohan Deshmukh',
    course: 'B.Tech Information Technology',
    semester: 3,
    attendance: 48,
    previousGpa: 6.1,
    currentGpa: 4.9,
    assignmentRate: 45,
    internalMarks: 54,
    backlogs: 3,
    engagement: 42,
    gpaTrend: -1.2,
    riskScore: 89,
    riskLevel: 'HIGH'
  },
  {
    studentId: 'STU1002',
    name: 'Aditya Mehta',
    course: 'B.Tech Mechanical Engineering',
    semester: 5,
    attendance: 52,
    previousGpa: 6.4,
    currentGpa: 5.2,
    assignmentRate: 52,
    internalMarks: 58,
    backlogs: 2,
    engagement: 49,
    gpaTrend: -1.2,
    riskScore: 84,
    riskLevel: 'HIGH'
  },
  {
    studentId: 'STU1018',
    name: 'Neha Chawla',
    course: 'B.Tech Electronics & Communication',
    semester: 4,
    attendance: 55,
    previousGpa: 6.5,
    currentGpa: 5.5,
    assignmentRate: 58,
    internalMarks: 62,
    backlogs: 2,
    engagement: 53,
    gpaTrend: -1.0,
    riskScore: 81,
    riskLevel: 'HIGH'
  },
  {
    studentId: 'STU1042',
    name: 'Vikram Rajput',
    course: 'B.Tech Civil Engineering',
    semester: 6,
    attendance: 59,
    previousGpa: 6.6,
    currentGpa: 5.7,
    assignmentRate: 56,
    internalMarks: 64,
    backlogs: 1,
    engagement: 56,
    gpaTrend: -0.9,
    riskScore: 76,
    riskLevel: 'HIGH'
  },
  {
    studentId: 'STU1011',
    name: 'Ishaan Verma',
    course: 'B.Tech Computer Science',
    semester: 2,
    attendance: 61,
    previousGpa: 6.8,
    currentGpa: 6.0,
    assignmentRate: 60,
    internalMarks: 66,
    backlogs: 1,
    engagement: 60,
    gpaTrend: -0.8,
    riskScore: 74,
    riskLevel: 'HIGH'
  },
  {
    studentId: 'STU1003',
    name: 'Ananya Pillai',
    course: 'B.Tech Computer Science',
    semester: 4,
    attendance: 71,
    previousGpa: 7.4,
    currentGpa: 6.8,
    assignmentRate: 72,
    internalMarks: 70,
    backlogs: 1,
    engagement: 68,
    gpaTrend: -0.6,
    riskScore: 54,
    riskLevel: 'MEDIUM'
  },
  {
    studentId: 'STU1007',
    name: 'Deepak Nair',
    course: 'B.Tech Electrical Engineering',
    semester: 3,
    attendance: 68,
    previousGpa: 7.2,
    currentGpa: 6.5,
    assignmentRate: 68,
    internalMarks: 67,
    backlogs: 1,
    engagement: 64,
    gpaTrend: -0.7,
    riskScore: 59,
    riskLevel: 'MEDIUM'
  },
  {
    studentId: 'STU1014',
    name: 'Meera Sengupta',
    course: 'B.Tech Information Technology',
    semester: 5,
    attendance: 74,
    previousGpa: 7.5,
    currentGpa: 7.1,
    assignmentRate: 75,
    internalMarks: 73,
    backlogs: 0,
    engagement: 72,
    gpaTrend: -0.4,
    riskScore: 48,
    riskLevel: 'MEDIUM'
  },
  {
    studentId: 'STU1020',
    name: 'Karan Bedi',
    course: 'B.Tech Mechanical Engineering',
    semester: 4,
    attendance: 69,
    previousGpa: 7.3,
    currentGpa: 6.7,
    assignmentRate: 70,
    internalMarks: 69,
    backlogs: 1,
    engagement: 66,
    gpaTrend: -0.6,
    riskScore: 56,
    riskLevel: 'MEDIUM'
  },
  {
    studentId: 'STU1001',
    name: 'Aarav Sharma',
    course: 'B.Tech Computer Science',
    semester: 4,
    attendance: 92,
    previousGpa: 8.6,
    currentGpa: 8.8,
    assignmentRate: 94,
    internalMarks: 89,
    backlogs: 0,
    engagement: 90,
    gpaTrend: 0.2,
    riskScore: 14,
    riskLevel: 'LOW'
  },
  {
    studentId: 'STU1004',
    name: 'Priya Sundaram',
    course: 'B.Tech Electronics & Communication',
    semester: 4,
    attendance: 88,
    previousGpa: 8.3,
    currentGpa: 8.4,
    assignmentRate: 90,
    internalMarks: 85,
    backlogs: 0,
    engagement: 88,
    gpaTrend: 0.1,
    riskScore: 19,
    riskLevel: 'LOW'
  },
  {
    studentId: 'STU1006',
    name: 'Tanvi Joshi',
    course: 'B.Tech Information Technology',
    semester: 6,
    attendance: 95,
    previousGpa: 9.0,
    currentGpa: 9.1,
    assignmentRate: 96,
    internalMarks: 92,
    backlogs: 0,
    engagement: 94,
    gpaTrend: 0.1,
    riskScore: 11,
    riskLevel: 'LOW'
  },
  {
    studentId: 'STU1008',
    name: 'Varun Grover',
    course: 'B.Tech Civil Engineering',
    semester: 3,
    attendance: 84,
    previousGpa: 7.9,
    currentGpa: 8.0,
    assignmentRate: 85,
    internalMarks: 80,
    backlogs: 0,
    engagement: 82,
    gpaTrend: 0.1,
    riskScore: 24,
    riskLevel: 'LOW'
  },
  {
    studentId: 'STU1009',
    name: 'Rhea Nambiar',
    course: 'B.Tech Computer Science',
    semester: 2,
    attendance: 91,
    previousGpa: 8.5,
    currentGpa: 8.7,
    assignmentRate: 92,
    internalMarks: 88,
    backlogs: 0,
    engagement: 90,
    gpaTrend: 0.2,
    riskScore: 15,
    riskLevel: 'LOW'
  }
];

export const DEFAULT_BENCHMARK_RISK: RiskAnalysisResponse = {
  success: true,
  studentId: 'STU1024',
  name: 'Kavya Sharma',
  course: 'B.Tech Computer Science',
  semester: 4,
  riskScore: 78,
  riskProbability: 0.78,
  riskLevel: 'HIGH',
  factors: [
    {
      factor: 'backlogs',
      label: 'Multiple course backlogs',
      contribution: 'High contribution',
      weight: 0.405,
      description: '2 un-cleared academic course backlogs (Ranked #1 predictor in UCI institutional dataset).'
    },
    {
      factor: 'gpa_trend',
      label: 'Declining GPA',
      contribution: 'High contribution',
      weight: 0.228,
      description: 'GPA declined by 0.9 points (from 6.7 to 5.8) over consecutive semesters.'
    },
    {
      factor: 'attendance',
      label: 'Low attendance',
      contribution: 'High contribution',
      weight: 0.094,
      description: 'Current attendance is 58%, well below the university mandatory 75% threshold.'
    },
    {
      factor: 'assignment_rate',
      label: 'Missed assignments',
      contribution: 'Medium contribution',
      weight: 0.045,
      description: 'Assignment completion rate is 50%, indicating accumulated coursework arrears.'
    },
    {
      factor: 'engagement',
      label: 'Reduced LMS & Classroom engagement',
      contribution: 'Medium contribution',
      weight: 0.041,
      description: 'Activity score is 55%, showing emerging symptoms of academic disengagement.'
    }
  ],
  timeline: [
    { month: 'Jan', riskScore: 21 },
    { month: 'Feb', riskScore: 28 },
    { month: 'Mar', riskScore: 44 },
    { month: 'Apr', riskScore: 61 },
    { month: 'May', riskScore: 78 }
  ],
  academicDetails: {
    currentGpa: 5.8,
    previousGpa: 6.7,
    gpaTrend: -0.9,
    attendance: 58,
    assignmentRate: 50,
    internalMarks: 61,
    backlogs: 2,
    engagement: 55
  },
  disclaimer: 'This risk assessment is calculated using an explainable ensemble model trained on 4,424 student records. It is designed to assist academic advisors in early intervention and must be used alongside holistic human judgment.'
};

export function getMockStudentRisk(id: string): RiskAnalysisResponse {
  if (id.toUpperCase() === 'STU1024') {
    return DEFAULT_BENCHMARK_RISK;
  }
  const found = DEFAULT_STUDENTS.find(s => s.studentId.toUpperCase() === id.toUpperCase());
  if (found) {
    const isHigh = found.riskScore >= 65;
    const isMed = found.riskScore >= 35;
    return {
      success: true,
      studentId: found.studentId,
      name: found.name,
      course: found.course,
      semester: found.semester,
      riskScore: found.riskScore,
      riskProbability: found.riskScore / 100,
      riskLevel: found.riskLevel,
      factors: [
        {
          factor: 'attendance',
          label: found.attendance < 75 ? 'Low attendance' : 'Nominal attendance',
          contribution: found.attendance < 65 ? 'High contribution' : found.attendance < 75 ? 'Medium contribution' : 'Low contribution',
          weight: 0.18,
          description: `Current attendance is ${found.attendance}%.`
        },
        {
          factor: 'backlogs',
          label: found.backlogs > 0 ? `${found.backlogs} Course Backlogs` : 'Zero Backlogs',
          contribution: found.backlogs >= 2 ? 'High contribution' : found.backlogs === 1 ? 'Medium contribution' : 'Low contribution',
          weight: 0.40,
          description: `${found.backlogs} active backlog courses.`
        },
        {
          factor: 'gpa_trend',
          label: (found.gpaTrend || 0) < 0 ? 'Declining GPA' : 'Stable GPA',
          contribution: (found.gpaTrend || 0) < -0.4 ? 'High contribution' : 'Low contribution',
          weight: 0.22,
          description: `Current GPA: ${found.currentGpa}, Previous GPA: ${found.previousGpa}.`
        }
      ],
      timeline: [
        { month: 'Jan', riskScore: Math.max(10, Math.round(found.riskScore * 0.4)) },
        { month: 'Feb', riskScore: Math.max(12, Math.round(found.riskScore * 0.55)) },
        { month: 'Mar', riskScore: Math.max(15, Math.round(found.riskScore * 0.7)) },
        { month: 'Apr', riskScore: Math.max(18, Math.round(found.riskScore * 0.88)) },
        { month: 'May', riskScore: found.riskScore }
      ],
      academicDetails: {
        currentGpa: found.currentGpa,
        previousGpa: found.previousGpa,
        gpaTrend: found.gpaTrend || 0,
        attendance: found.attendance,
        assignmentRate: found.assignmentRate,
        internalMarks: found.internalMarks,
        backlogs: found.backlogs,
        engagement: found.engagement
      },
      disclaimer: DEFAULT_BENCHMARK_RISK.disclaimer
    };
  }

  // Fallback synthetic risk analysis
  return {
    ...DEFAULT_BENCHMARK_RISK,
    studentId: id,
    name: `Student ${id}`
  };
}

export const DEFAULT_INTERVENTIONS: Intervention[] = [
  {
    id: 'INT-001',
    studentId: 'STU1024',
    studentName: 'Kavya Sharma',
    course: 'B.Tech Computer Science',
    riskScore: 78,
    riskLevel: 'HIGH',
    recommendation: 'Schedule faculty mentoring, recommend academic support for weak subjects, and monitor attendance/assignment completion weekly.',
    actionType: 'Faculty Counselling & Tutoring',
    priority: 'HIGH',
    status: 'In-Progress',
    assignedFaculty: 'Prof. Ananya Sen (Dept of Computer Applications)',
    notes: 'Initial meeting held on May 12th. Student agreed to bi-weekly review and tutorial sessions.',
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString()
  },
  {
    id: 'INT-002',
    studentId: 'STU1005',
    studentName: 'Rohan Deshmukh',
    course: 'B.Tech Information Technology',
    riskScore: 89,
    riskLevel: 'HIGH',
    recommendation: 'Immediate remedial tutoring in Data Structures; attendance contract required.',
    actionType: 'Attendance Contract & Academic Tutoring',
    priority: 'HIGH',
    status: 'Pending',
    assignedFaculty: 'Prof. Rajesh Kumar (Dept of IT)',
    notes: 'Critical attendance alert triggered. Parent notification sent.',
    createdAt: new Date(Date.now() - 1 * 86400000).toISOString()
  },
  {
    id: 'INT-003',
    studentId: 'STU1002',
    studentName: 'Aditya Mehta',
    course: 'B.Tech Mechanical Engineering',
    riskScore: 84,
    riskLevel: 'HIGH',
    recommendation: 'Supplementary examination prep and peer study group assignment.',
    actionType: 'Peer Mentoring',
    priority: 'HIGH',
    status: 'In-Progress',
    assignedFaculty: 'Dr. Suresh Varma (Dept of Mechanical)',
    notes: 'Enrolled in engineering mathematics support workshop.',
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString()
  },
  {
    id: 'INT-004',
    studentId: 'STU1003',
    studentName: 'Ananya Pillai',
    course: 'B.Tech Computer Science',
    riskScore: 54,
    riskLevel: 'MEDIUM',
    recommendation: 'Assignment submission check-in and lab session attendance reinforcement.',
    actionType: 'Advisory Review',
    priority: 'MEDIUM',
    status: 'Completed',
    assignedFaculty: 'Prof. Ananya Sen',
    notes: 'Assignments submitted. Risk probability reduced by 12%.',
    createdAt: new Date(Date.now() - 5 * 86400000).toISOString()
  }
];

export function getFilteredMockStudents(params: {
  page?: number;
  limit?: number;
  search?: string;
  riskLevel?: string;
  course?: string;
  semester?: string;
  sortBy?: string;
  sortOrder?: string;
}) {
  const {
    page = 1,
    limit = 15,
    search = '',
    riskLevel = 'ALL',
    course = 'ALL',
    semester = 'ALL',
    sortBy = 'riskScore',
    sortOrder = 'desc'
  } = params;

  let filtered = [...DEFAULT_STUDENTS];

  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(
      s => s.studentId.toLowerCase().includes(q) || s.name.toLowerCase().includes(q)
    );
  }

  if (riskLevel && riskLevel !== 'ALL') {
    filtered = filtered.filter(s => s.riskLevel.toUpperCase() === riskLevel.toUpperCase());
  }

  if (course && course !== 'ALL') {
    filtered = filtered.filter(s => s.course.toLowerCase().includes(course.toLowerCase()));
  }

  if (semester && semester !== 'ALL') {
    filtered = filtered.filter(s => s.semester.toString() === semester.toString());
  }

  filtered.sort((a: any, b: any) => {
    let valA = a[sortBy] ?? 0;
    let valB = b[sortBy] ?? 0;
    if (typeof valA === 'string') {
      valA = valA.toLowerCase();
      valB = valB.toLowerCase();
    }
    if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
    if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  const total = filtered.length;
  const startIndex = (page - 1) * limit;
  const paginated = filtered.slice(startIndex, startIndex + limit);

  return {
    total,
    page,
    limit,
    totalPages: Math.max(1, Math.ceil(total / limit)),
    students: paginated
  };
}

export const DEFAULT_LMS_CONNECTORS: any[] = [
  {
    id: 'canvas',
    name: 'Instructure Canvas LMS',
    shortName: 'Canvas LMS',
    protocol: 'LTI 1.3 Advantage (IMS Global)',
    icon: 'Layers',
    color: '#e11d48',
    endpointUrl: 'https://canvas.apex.edu/api/v1',
    clientId: 'apex-lti-canvas-prod-2026',
    tokenMasked: 'canvas_sec_••••••••••••••••92a4',
    courseIds: ['CS-301', 'CS-302', 'IT-204', 'EC-401', 'ME-305'],
    autoSyncInterval: 'Every 6 Hours',
    status: 'CONNECTED',
    lastSyncTime: new Date(Date.now() - 2 * 3600000).toISOString(),
    lastSyncStatus: 'SUCCESS (32 records updated)',
    syncedCount: 850
  },
  {
    id: 'moodle',
    name: 'Moodle Academic Workspace',
    shortName: 'Moodle LMS',
    protocol: 'REST WebServices v2 (Token Auth)',
    icon: 'BookOpen',
    color: '#f59e0b',
    endpointUrl: 'https://moodle.apex.edu/webservice/rest/server.php',
    clientId: 'moodle-ws-client-01',
    tokenMasked: 'mdl_tkn_••••••••••••••••4f81',
    courseIds: ['CS-101', 'EE-201', 'CE-302'],
    autoSyncInterval: 'Daily at 02:00 UTC',
    status: 'CONNECTED',
    lastSyncTime: new Date(Date.now() - 14 * 3600000).toISOString(),
    lastSyncStatus: 'SUCCESS (18 records updated)',
    syncedCount: 240
  },
  {
    id: 'google_classroom',
    name: 'Google Classroom for Higher Ed',
    shortName: 'Classroom',
    protocol: 'Google Workspace Education OAuth 2.0',
    icon: 'GraduationCap',
    color: '#10b981',
    endpointUrl: 'https://classroom.googleapis.com/v1',
    clientId: '984712039481-apexedu.apps.googleusercontent.com',
    tokenMasked: 'ya29.a0AfH••••••••••••••••c19b',
    courseIds: ['HUM-102', 'MATH-201'],
    autoSyncInterval: 'Daily at 04:00 UTC',
    status: 'CONNECTED',
    lastSyncTime: new Date(Date.now() - 8 * 3600000).toISOString(),
    lastSyncStatus: 'SUCCESS (12 records updated)',
    syncedCount: 160
  },
  {
    id: 'banner',
    name: 'Ellucian Banner SIS',
    shortName: 'Banner SIS',
    protocol: 'Ellucian Ethos API / JDBC Adapter',
    icon: 'Building2',
    color: '#6366f1',
    endpointUrl: 'https://banner.apex.edu:8443/api/ethos',
    clientId: 'banner-ethos-apex-sys',
    tokenMasked: 'ethos_key_••••••••••••••••77dd',
    courseIds: ['ALL_ACTIVE_SECTIONS'],
    autoSyncInterval: 'Real-time Webhook Stream',
    status: 'CONNECTED',
    lastSyncTime: new Date(Date.now() - 45 * 60000).toISOString(),
    lastSyncStatus: 'SUCCESS (Full Registry Sync)',
    syncedCount: 1250
  }
];

export const DEFAULT_LMS_HISTORY: any[] = [
  {
    id: 'SYNC-001',
    provider: 'canvas',
    providerName: 'Instructure Canvas LMS',
    timestamp: new Date(Date.now() - 2 * 3600000).toISOString(),
    status: 'SUCCESS',
    recordsProcessed: 32,
    attendanceDeltaAvg: '+1.4%',
    assignmentRateDeltaAvg: '+2.8%',
    riskTransitions: { toCritical: 0, toLow: 3, unchanged: 29 },
    message: 'Telemetry ingest complete. 3 students improved from Medium to Low risk.'
  },
  {
    id: 'SYNC-002',
    provider: 'banner',
    providerName: 'Ellucian Banner SIS',
    timestamp: new Date(Date.now() - 24 * 3600000).toISOString(),
    status: 'SUCCESS',
    recordsProcessed: 1250,
    attendanceDeltaAvg: '0.0%',
    assignmentRateDeltaAvg: '+0.4%',
    riskTransitions: { toCritical: 1, toLow: 2, unchanged: 1247 },
    message: 'Scheduled nightly census sync completed without schema errors.'
  }
];

