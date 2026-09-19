const API_BASE = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:5000/api' : '/api');

export interface Student {
  studentId: string;
  name: string;
  course: string;
  semester: number;
  attendance: number;
  previousGpa: number;
  currentGpa: number;
  assignmentRate: number;
  internalMarks: number;
  backlogs: number;
  engagement: number;
  gpaTrend?: number;
  riskScore: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  timeline?: { month: string; riskScore: number }[];
  recommendations?: string[];
  suggestedActions?: string[];
}

export interface FactorContribution {
  factor: string;
  label: string;
  contribution: string;
  weight: number;
  description: string;
}

export interface RiskAnalysisResponse {
  success: boolean;
  studentId: string;
  name: string;
  course: string;
  semester: number;
  riskScore: number;
  riskProbability: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  factors: FactorContribution[];
  timeline: { month: string; riskScore: number }[];
  academicDetails: {
    currentGpa: number;
    previousGpa: number;
    gpaTrend: number;
    attendance: number;
    assignmentRate: number;
    internalMarks: number;
    backlogs: number;
    engagement: number;
  };
  disclaimer: string;
}

export interface DashboardStats {
  totalStudents: number;
  highRisk: number;
  mediumRisk: number;
  lowRisk: number;
  riskDistribution: { name: string; value: number; color: string }[];
  scatterData: { studentId: string; attendance: number; riskScore: number; currentGpa: number; riskLevel: string }[];
  departmentRisk: { department: string; fullCourseName: string; high: number; medium: number; low: number; total: number }[];
  riskTrend: { month: string; avgRisk: number; highRiskCount: number }[];
}

export interface Intervention {
  id: string;
  studentId: string;
  studentName: string;
  course: string;
  riskScore: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  recommendation: string;
  actionType: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  status: 'Pending' | 'In-Progress' | 'Completed';
  assignedFaculty: string;
  notes: string;
  createdAt: string;
}

export interface SimulationResult {
  success: boolean;
  baseline: { risk_score_pct: number; risk_level: string };
  simulated: { risk_score_pct: number; risk_level: string };
  delta_pct: number;
  reduced_risk: boolean;
  interpretation: string;
  disclaimer: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'faculty' | 'student';
  department?: string;
  institutionName?: string;
  campus?: string;
  designation?: string;
  identifier?: string;
  phone?: string;
  specialization?: string;
  officeLocation?: string;
  notificationsEnabled?: boolean;
  avatar?: string;
  createdAt?: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role?: 'admin' | 'faculty' | 'student';
  department?: string;
  institutionName?: string;
  campus?: string;
  designation?: string;
  identifier?: string;
  phone?: string;
  specialization?: string;
  officeLocation?: string;
  notificationsEnabled?: boolean;
}

export interface DemoAccount {
  role: 'admin' | 'faculty' | 'student';
  name: string;
  title: string;
  email: string;
  password: string;
  avatar: string;
  description: string;
}

function getHeaders(customHeaders: Record<string, string> = {}) {
  const token = localStorage.getItem('dropoutguard_token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...customHeaders
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

export const api = {
  // ----------------------------------------------------
  // Authentication
  // ----------------------------------------------------
  async login(credentials: { email: string; password: string }): Promise<{ success: boolean; token: string; user: User; message?: string }> {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Login failed.');
    return data;
  },

  async register(payload: RegisterPayload): Promise<{ success: boolean; token: string; user: User; message?: string }> {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Registration failed.');
    return data;
  },

  async getMe(): Promise<{ success: boolean; user: User }> {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: getHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Session expired.');
    return data;
  },

  async getDemoAccounts(): Promise<{ success: boolean; accounts: DemoAccount[] }> {
    const res = await fetch(`${API_BASE}/auth/demo-accounts`);
    return res.json();
  },

  // ----------------------------------------------------
  // Dashboard & Reporting
  // ----------------------------------------------------
  async getDashboard(): Promise<DashboardStats> {
    const res = await fetch(`${API_BASE}/dashboard`, { headers: getHeaders() });
    const data = await res.json();
    return data.data;
  },

  // ----------------------------------------------------
  // Students Query & CRUD
  // ----------------------------------------------------
  async getStudents(params: { page?: number; limit?: number; search?: string; riskLevel?: string; course?: string; semester?: string; sortBy?: string; sortOrder?: string }) {
    const query = new URLSearchParams();
    if (params.page) query.append('page', params.page.toString());
    if (params.limit) query.append('limit', params.limit.toString());
    if (params.search) query.append('search', params.search);
    if (params.riskLevel) query.append('riskLevel', params.riskLevel);
    if (params.course) query.append('course', params.course);
    if (params.semester) query.append('semester', params.semester);
    if (params.sortBy) query.append('sortBy', params.sortBy);
    if (params.sortOrder) query.append('sortOrder', params.sortOrder);

    const res = await fetch(`${API_BASE}/students?${query.toString()}`, { headers: getHeaders() });
    return res.json();
  },

  async getStudentRisk(id: string): Promise<RiskAnalysisResponse> {
    const res = await fetch(`${API_BASE}/risk/${id}`, { headers: getHeaders() });
    return res.json();
  },

  async getStudentById(id: string): Promise<Student> {
    const res = await fetch(`${API_BASE}/students/${id}`, { headers: getHeaders() });
    const data = await res.json();
    return data.student;
  },

  async createStudent(payload: Partial<Student>): Promise<{ success: boolean; message: string; student: Student }> {
    const res = await fetch(`${API_BASE}/students`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to create student.');
    return data;
  },

  async updateStudent(id: string, updates: Partial<Student>): Promise<{ success: boolean; message: string; student: Student }> {
    const res = await fetch(`${API_BASE}/students/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(updates)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to update student.');
    return data;
  },

  async deleteStudent(id: string): Promise<{ success: boolean; message: string }> {
    const res = await fetch(`${API_BASE}/students/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to delete student.');
    return data;
  },

  async bulkImportStudents(students: Partial<Student>[]): Promise<{ success: boolean; message: string; count: number; importedStudents: Student[] }> {
    const res = await fetch(`${API_BASE}/students/bulk-import`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ students })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to bulk import students.');
    return data;
  },

  // ----------------------------------------------------
  // ML Simulation & Interventions
  // ----------------------------------------------------
  async simulate(current: any, modified: any): Promise<SimulationResult> {
    const res = await fetch(`${API_BASE}/simulate`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ current, modified })
    });
    return res.json();
  },

  async getInterventions(studentId?: string): Promise<Intervention[]> {
    const url = studentId ? `${API_BASE}/interventions?studentId=${studentId}` : `${API_BASE}/interventions`;
    const res = await fetch(url, { headers: getHeaders() });
    const data = await res.json();
    return data.interventions;
  },

  async createIntervention(payload: Partial<Intervention>): Promise<Intervention> {
    const res = await fetch(`${API_BASE}/interventions`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    return data.intervention;
  },

  async updateIntervention(id: string, updates: Partial<Intervention>): Promise<Intervention> {
    const res = await fetch(`${API_BASE}/interventions/${id}`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify(updates)
    });
    const data = await res.json();
    return data.intervention;
  },

  async generateAiIntervention(studentData: any): Promise<{ success: boolean; interventionText: string; provider: string }> {
    const res = await fetch(`${API_BASE}/explain`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(studentData)
    });
    return res.json();
  },

  async getMetrics(): Promise<any> {
    const res = await fetch(`${API_BASE}/metrics`, { headers: getHeaders() });
    return res.json();
  },

  // ----------------------------------------------------
  // LMS & SIS Connector Integrations (LTI 1.3 Advantage)
  // ----------------------------------------------------
  async getLmsConnectors(): Promise<LmsConnector[]> {
    const res = await fetch(`${API_BASE}/lms/connectors`, { headers: getHeaders() });
    const data = await res.json();
    return data.connectors || [];
  },

  async updateLmsConfig(provider: string, config: any): Promise<LmsConnector> {
    const res = await fetch(`${API_BASE}/lms/connectors/${provider}/config`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(config)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to update LMS connector.');
    return data.connector;
  },

  async testLmsConnection(provider: string): Promise<any> {
    const res = await fetch(`${API_BASE}/lms/connectors/${provider}/test`, {
      method: 'POST',
      headers: getHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Connection test failed.');
    return data.result;
  },

  async triggerLmsSync(provider: string, limit: number = 35): Promise<LmsSyncResult> {
    const res = await fetch(`${API_BASE}/lms/connectors/${provider}/sync`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ limit })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'LMS telemetry sync failed.');
    return data.result;
  },

  async getLmsSyncHistory(): Promise<LmsSyncResult[]> {
    const res = await fetch(`${API_BASE}/lms/sync-history`, { headers: getHeaders() });
    const data = await res.json();
    return data.history || [];
  }
};

export interface LmsConnector {
  id: 'canvas' | 'moodle' | 'google_classroom' | 'banner';
  name: string;
  shortName: string;
  protocol: string;
  icon: string;
  color: string;
  endpointUrl: string;
  clientId: string;
  tokenMasked: string;
  courseIds: string[];
  autoSyncInterval: string;
  status: 'CONNECTED' | 'CONFIGURED' | 'SYNCING' | 'ERROR';
  lastSyncTime: string;
  lastSyncStatus: string;
  syncedCount: number;
}

export interface LmsSyncResult {
  id: string;
  provider: string;
  providerName: string;
  timestamp: string;
  status: 'SUCCESS' | 'ERROR';
  recordsProcessed: number;
  attendanceDeltaAvg: string;
  assignmentRateDeltaAvg: string;
  riskTransitions: {
    toCritical: number;
    toLow: number;
    unchanged: number;
  };
  message: string;
  sampleUpdates?: Array<{
    studentId: string;
    name: string;
    oldAttendance: number;
    newAttendance: number;
    oldRiskScore: number;
    newRiskScore: number;
    riskLevel: string;
  }>;
}

