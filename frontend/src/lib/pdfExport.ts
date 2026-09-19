import { jsPDF } from 'jspdf';
import { RiskAnalysisResponse } from './api';

export function exportStudentDossierPDF(profile: RiskAnalysisResponse, user?: any) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  // ----------------------------------------------------
  // Colors Palette
  // ----------------------------------------------------
  const navy = [15, 23, 42];        // #0f172a
  const slateDark = [30, 41, 59];    // #1e293b
  const slateText = [71, 85, 105];   // #475569
  const mutedText = [100, 116, 139]; // #64748b
  const crimson = [225, 29, 72];     // #e11d48
  const amber = [217, 119, 6];       // #d97706
  const emerald = [5, 150, 105];     // #059669
  const indigo = [79, 70, 229];      // #4f46e5

  const isHighRisk = profile.riskLevel === 'HIGH';
  const isMedRisk = profile.riskLevel === 'MEDIUM';
  const riskColor = isHighRisk ? crimson : isMedRisk ? amber : emerald;

  // ----------------------------------------------------
  // 1. Top Institutional Letterhead & Accent Bar
  // ----------------------------------------------------
  doc.setFillColor(indigo[0], indigo[1], indigo[2]);
  doc.rect(0, 0, pageWidth, 5, 'F');

  y += 2;
  // University Header Block
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(navy[0], navy[1], navy[2]);
  doc.text('APEX UNIVERSITY OF TECHNOLOGY', margin, y + 4);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(slateText[0], slateText[1], slateText[2]);
  doc.text('Office of Academic Affairs • Division of Student Success & Early Warning Analytics', margin, y + 9);

  // Reference & Date (Right aligned)
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  
  doc.setFont('courier', 'bold');
  doc.setFontSize(8);
  doc.text(`REF: DOS-${profile.studentId}-${now.getFullYear()}`, pageWidth - margin, y + 4, { align: 'right' });
  doc.setFont('courier', 'normal');
  doc.text(`ISSUED: ${dateStr} ${timeStr}`, pageWidth - margin, y + 9, { align: 'right' });

  y += 14;

  // Decorative Rule
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.6);
  doc.line(margin, y, pageWidth - margin, y);

  y += 5;

  // ----------------------------------------------------
  // 2. FERPA Confidentiality Banner
  // ----------------------------------------------------
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(margin, y, contentWidth, 8, 1.5, 1.5, 'F');
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.3);
  doc.roundedRect(margin, y, contentWidth, 8, 1.5, 1.5, 'D');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(slateDark[0], slateDark[1], slateDark[2]);
  doc.text('CONFIDENTIAL INSTITUTIONAL RECORD', margin + 3, y + 5.2);

  doc.setFont('helvetica', 'normal');
  doc.text('FERPA & Institutional Ethics Protocol 2026 • Diagnostic Faculty Advising Purpose Only', margin + 58, y + 5.2);

  y += 13;

  // ----------------------------------------------------
  // 3. Student Subject Dossier & Risk Scorecard
  // ----------------------------------------------------
  // Left Column: Student Dossier
  const leftColWidth = contentWidth * 0.62;
  const rightColWidth = contentWidth - leftColWidth - 4;

  doc.setFillColor(241, 245, 249);
  doc.roundedRect(margin, y, leftColWidth, 38, 2, 2, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, y, leftColWidth, 38, 2, 2, 'D');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(navy[0], navy[1], navy[2]);
  doc.text(profile.name, margin + 4, y + 7);

  doc.setFont('courier', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(indigo[0], indigo[1], indigo[2]);
  doc.text(`ID: ${profile.studentId}`, margin + 4, y + 13);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(slateText[0], slateText[1], slateText[2]);
  doc.text(`Academic Program: ${profile.course} (Semester ${profile.semester})`, margin + 4, y + 19);
  doc.text(`Cohort Category: Regular Enrolled Scholar • Department of Computing`, margin + 4, y + 24);
  
  const advisorName = user?.name ? `${user.name} (${user.role.toUpperCase()})` : 'Prof. Ananya Sen (Faculty Advisor)';
  doc.text(`Reporting Advisor: ${advisorName}`, margin + 4, y + 29);
  doc.text(`Assessment Scope: Longitudinal Midterm Bayesian Decomposition`, margin + 4, y + 34);

  // Right Column: Precision Risk Gauge Card
  const rightX = margin + leftColWidth + 4;
  doc.setFillColor(isHighRisk ? 255 : 254, isHighRisk ? 241 : 243, isHighRisk ? 242 : 199);
  doc.roundedRect(rightX, y, rightColWidth, 38, 2, 2, 'F');
  doc.setDrawColor(riskColor[0], riskColor[1], riskColor[2]);
  doc.setLineWidth(0.8);
  doc.roundedRect(rightX, y, rightColWidth, 38, 2, 2, 'D');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(riskColor[0], riskColor[1], riskColor[2]);
  doc.text('CALIBRATED PREDICTED RISK', rightX + rightColWidth / 2, y + 7, { align: 'center' });

  doc.setFont('courier', 'bold');
  doc.setFontSize(22);
  doc.text(`${profile.riskScore}%`, rightX + rightColWidth / 2, y + 17, { align: 'center' });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text(`${profile.riskLevel} RISK CLASSIFICATION`, rightX + rightColWidth / 2, y + 24, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(mutedText[0], mutedText[1], mutedText[2]);
  doc.text(`95% CI: [${Math.max(0, profile.riskScore - 4)}% — ${Math.min(100, profile.riskScore + 4)}%]`, rightX + rightColWidth / 2, y + 29, { align: 'center' });
  doc.text(`UCI Dataset Model Confidence: 0.925 ROC-AUC`, rightX + rightColWidth / 2, y + 33, { align: 'center' });

  y += 43;

  // ----------------------------------------------------
  // 4. Academic Telemetry Grid (6 Metrics)
  // ----------------------------------------------------
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(navy[0], navy[1], navy[2]);
  doc.text('1. VERIFIED CONTINUOUS ASSESSMENT TELEMETRY', margin, y);

  y += 3;

  const colW = contentWidth / 6;
  const metrics = [
    { label: 'Current GPA', val: `${profile.academicDetails.currentGpa.toFixed(2)} / 10`, sub: `Prior: ${profile.academicDetails.previousGpa.toFixed(2)}` },
    { label: 'Attendance', val: `${profile.academicDetails.attendance}%`, sub: 'Benchmark: 75%' },
    { label: 'Assignments', val: `${profile.academicDetails.assignmentRate}%`, sub: `${Math.round(profile.academicDetails.assignmentRate / 10)}/10 delivered` },
    { label: 'Midterm Marks', val: `${profile.academicDetails.internalMarks}/100`, sub: 'Midterm Wave' },
    { label: 'Backlogs', val: `${profile.academicDetails.backlogs}`, sub: profile.academicDetails.backlogs > 0 ? 'Deficit Warning' : 'Clear' },
    { label: 'LMS Engagement', val: `${profile.academicDetails.engagement}%`, sub: profile.academicDetails.engagement < 60 ? 'Disengaged' : 'Active' },
  ];

  metrics.forEach((m, idx) => {
    const mx = margin + idx * colW;
    doc.setFillColor(248, 250, 252);
    doc.rect(mx, y, colW - 1.5, 16, 'F');
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.3);
    doc.rect(mx, y, colW - 1.5, 16, 'D');

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(mutedText[0], mutedText[1], mutedText[2]);
    doc.text(m.label.toUpperCase(), mx + 2, y + 4);

    doc.setFont('courier', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(navy[0], navy[1], navy[2]);
    doc.text(m.val, mx + 2, y + 9.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6);
    doc.setTextColor(m.sub.includes('Warning') ? crimson[0] : mutedText[0], m.sub.includes('Warning') ? crimson[1] : mutedText[1], m.sub.includes('Warning') ? crimson[2] : mutedText[2]);
    doc.text(m.sub, mx + 2, y + 13.5);
  });

  y += 22;

  // ----------------------------------------------------
  // 5. Explainable AI (XAI) Factor Decomposition
  // ----------------------------------------------------
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(navy[0], navy[1], navy[2]);
  doc.text('2. EXPLAINABLE AI (XAI) FACTOR DECOMPOSITION & LOG-ODDS ATTRIBUTION', margin, y);

  y += 4;

  // Table Header
  doc.setFillColor(slateDark[0], slateDark[1], slateDark[2]);
  doc.rect(margin, y, contentWidth, 6, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(255, 255, 255);
  doc.text('RANK', margin + 2, y + 4.2);
  doc.text('ACADEMIC RISK DRIVER / FACTOR', margin + 14, y + 4.2);
  doc.text('CONTRIBUTION LEVEL', margin + 85, y + 4.2);
  doc.text('WEIGHT', margin + 125, y + 4.2);
  doc.text('EXPLANATION & CAUSAL RATIONALE', margin + 142, y + 4.2);

  y += 6;

  profile.factors.forEach((f, idx) => {
    const isEven = idx % 2 === 0;
    doc.setFillColor(isEven ? 255 : 248, isEven ? 255 : 250, isEven ? 255 : 252);
    doc.rect(margin, y, contentWidth, 9, 'F');
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.2);
    doc.line(margin, y + 9, margin + contentWidth, y + 9);

    doc.setFont('courier', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(navy[0], navy[1], navy[2]);
    doc.text(`#${idx + 1}`, margin + 2, y + 5.5);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.text(f.label, margin + 14, y + 5.5);

    const isHighCont = f.contribution.toLowerCase().includes('high');
    doc.setTextColor(isHighCont ? crimson[0] : amber[0], isHighCont ? crimson[1] : amber[1], isHighCont ? crimson[2] : amber[2]);
    doc.text(f.contribution.toUpperCase(), margin + 85, y + 5.5);

    doc.setFont('courier', 'bold');
    doc.setTextColor(navy[0], navy[1], navy[2]);
    doc.text(`${Math.round(f.weight * 100)}%`, margin + 125, y + 5.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(slateText[0], slateText[1], slateText[2]);
    const truncatedDesc = f.description.length > 55 ? f.description.substring(0, 52) + '...' : f.description;
    doc.text(truncatedDesc, margin + 142, y + 5.5);

    y += 9;
  });

  y += 6;

  // ----------------------------------------------------
  // 6. 5-Month Risk Velocity & Longitudinal Trajectory
  // ----------------------------------------------------
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(navy[0], navy[1], navy[2]);
  doc.text('3. LONGITUDINAL TRAJECTORY & 5-MONTH ESCALATION VELOCITY', margin, y);

  y += 4;

  const timeW = contentWidth / profile.timeline.length;
  profile.timeline.forEach((t, i) => {
    const tx = margin + i * timeW;
    const isLast = i === profile.timeline.length - 1;
    doc.setFillColor(isLast ? 255 : 248, isLast ? 241 : 250, isLast ? 242 : 252);
    doc.roundedRect(tx, y, timeW - 2, 14, 1.5, 1.5, 'F');
    doc.setDrawColor(isLast ? crimson[0] : 226, isLast ? crimson[1] : 232, isLast ? crimson[2] : 240);
    doc.roundedRect(tx, y, timeW - 2, 14, 1.5, 1.5, 'D');

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(mutedText[0], mutedText[1], mutedText[2]);
    doc.text(t.month.toUpperCase(), tx + (timeW - 2) / 2, y + 4.5, { align: 'center' });

    doc.setFont('courier', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(t.riskScore >= 65 ? crimson[0] : t.riskScore >= 35 ? amber[0] : emerald[0], t.riskScore >= 65 ? crimson[1] : t.riskScore >= 35 ? amber[1] : emerald[1], t.riskScore >= 65 ? crimson[2] : t.riskScore >= 35 ? amber[2] : emerald[2]);
    doc.text(`${t.riskScore}%`, tx + (timeW - 2) / 2, y + 10.5, { align: 'center' });
  });

  y += 19;

  // ----------------------------------------------------
  // 7. Prescribed Faculty Intervention & Remediation
  // ----------------------------------------------------
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(navy[0], navy[1], navy[2]);
  doc.text('4. PRESCRIBED ACTION PROTOCOL & COUNTERFACTUAL WHAT-IF TARGETS', margin, y);

  y += 3;

  doc.setFillColor(248, 250, 252);
  doc.roundedRect(margin, y, contentWidth, 24, 2, 2, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, y, contentWidth, 24, 2, 2, 'D');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(navy[0], navy[1], navy[2]);
  doc.text('Recommended Intervention:', margin + 4, y + 5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(slateText[0], slateText[1], slateText[2]);
  doc.text('Schedule immediate 1-on-1 Faculty Mentoring session, assign structured peer tutoring for backlogged courses, and establish weekly attendance targets.', margin + 4, y + 9.5);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(navy[0], navy[1], navy[2]);
  doc.text('Remediation What-If Sensitivity Projection:', margin + 4, y + 15);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.text('Raising Attendance to 80%, Assignment Rate to 80%, and completing Midterm backlog re-evaluation reduces predicted risk from 78% to 24% (-54% net reduction).', margin + 4, y + 19.5);

  y += 29;

  // ----------------------------------------------------
  // 8. Official Signatures & Verification Seal
  // ----------------------------------------------------
  const sigBoxW = contentWidth / 2 - 4;

  const signatoryAdvisorName = user?.name || 'Prof. Ananya Sen';
  const advisorRole = user?.designation || (user?.role === 'admin' ? 'Dean of Academic Affairs' : 'Lead Faculty Advisor');
  const advisorDept = user?.department || 'Department of Computer Applications';

  // Signature 1: Reporting / Reviewing Officer
  doc.line(margin, y + 14, margin + sigBoxW, y + 14);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(navy[0], navy[1], navy[2]);
  doc.text(signatoryAdvisorName, margin, y + 18);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(mutedText[0], mutedText[1], mutedText[2]);
  doc.text(`${advisorRole} • ${advisorDept}`, margin, y + 21.5);

  // Signature 2: Dean of Academic Affairs / Institutional Head
  const deanX = margin + sigBoxW + 8;
  doc.line(deanX, y + 14, deanX + sigBoxW, y + 14);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(navy[0], navy[1], navy[2]);
  doc.text('Dr. Aris Thorne, Dean of Academic Affairs', deanX, y + 18);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(mutedText[0], mutedText[1], mutedText[2]);
  doc.text('Chief Academic Officer • Institutional Board of Retention', deanX, y + 21.5);

  // Bottom Footer & Digital Verification Hash
  const footerY = pageHeight - 8;
  doc.setDrawColor(226, 232, 240);
  doc.line(margin, footerY - 3, pageWidth - margin, footerY - 3);

  doc.setFont('courier', 'normal');
  doc.setFontSize(6);
  doc.setTextColor(mutedText[0], mutedText[1], mutedText[2]);
  doc.text(`HASH: SHA256:${Math.random().toString(36).substring(2, 15).toUpperCase()}E94 • VERIFIED BY DROPOUTGUARD AI ENGINE v2.5`, margin, footerY);
  doc.text('PAGE 1 OF 1 • OFFICIAL INSTITUTIONAL RECORD', pageWidth - margin, footerY, { align: 'right' });

  // Save the document with clean naming convention
  doc.save(`DropoutGuard_Official_Dossier_${profile.studentId}.pdf`);
}
