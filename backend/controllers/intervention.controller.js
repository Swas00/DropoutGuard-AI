const axios = require('axios');
const datastore = require('../services/datastore');

exports.getInterventions = async (req, res) => {
  try {
    const { studentId } = req.query;
    const interventions = datastore.getInterventions(studentId);
    return res.json({
      success: true,
      total: interventions.length,
      interventions
    });
  } catch (error) {
    console.error('Error fetching interventions:', error);
    return res.status(500).json({ success: false, message: 'Failed to retrieve interventions.' });
  }
};

exports.getInterventionById = async (req, res) => {
  try {
    const { id } = req.params;
    const interventions = datastore.getInterventions();
    const item = interventions.find(i => i.id === id || i.studentId.toUpperCase() === id.toUpperCase());

    if (!item) {
      return res.status(404).json({ success: false, message: `Intervention ${id} not found.` });
    }

    return res.json({ success: true, intervention: item });
  } catch (error) {
    console.error('Error fetching intervention:', error);
    return res.status(500).json({ success: false, message: 'Failed to retrieve intervention.' });
  }
};

exports.createIntervention = async (req, res) => {
  try {
    const { studentId, recommendation, actionType, priority, assignedFaculty, notes } = req.body;

    if (!studentId || !recommendation) {
      return res.status(400).json({ success: false, message: 'studentId and recommendation are required.' });
    }

    const student = datastore.getStudentById(studentId);
    const newRecord = datastore.addIntervention({
      studentId: studentId.toUpperCase(),
      studentName: student ? student.name : `Student ${studentId}`,
      course: student ? student.course : 'MCA',
      riskScore: student ? student.riskScore : 70,
      riskLevel: student ? student.riskLevel : 'HIGH',
      recommendation,
      actionType: actionType || 'Mentoring',
      priority: priority || 'MEDIUM',
      assignedFaculty: assignedFaculty || 'Faculty Mentor',
      notes: notes || ''
    });

    return res.status(201).json({
      success: true,
      message: 'Intervention logged successfully.',
      intervention: newRecord
    });
  } catch (error) {
    console.error('Error creating intervention:', error);
    return res.status(500).json({ success: false, message: 'Failed to create intervention.' });
  }
};

exports.updateInterventionStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes, priority, assignedFaculty } = req.body;

    const updated = datastore.updateIntervention(id, {
      ...(status && { status }),
      ...(notes !== undefined && { notes }),
      ...(priority && { priority }),
      ...(assignedFaculty && { assignedFaculty })
    });

    if (!updated) {
      return res.status(404).json({ success: false, message: `Intervention ${id} not found.` });
    }

    return res.json({
      success: true,
      message: 'Intervention updated.',
      intervention: updated
    });
  } catch (error) {
    console.error('Error updating intervention:', error);
    return res.status(500).json({ success: false, message: 'Failed to update intervention.' });
  }
};

exports.generateAiInterventionText = async (req, res) => {
  try {
    const { studentId, attendance, currentGpa, previousGpa, assignmentRate, backlogs, internalMarks, engagement } = req.body;

    // Check if Gemini API key exists
    const geminiApiKey = process.env.GEMINI_API_KEY;
    if (geminiApiKey) {
      try {
        const prompt = `You are an ethical academic advising AI system for DropoutGuard AI.
Student Data:
- Attendance: ${attendance}%
- Current GPA: ${currentGpa}
- Previous GPA: ${previousGpa}
- Assignment Completion: ${assignmentRate}%
- Active Backlogs: ${backlogs}
- Internal Exam Score: ${internalMarks}/100
- Engagement Score: ${engagement}%

Strict Instructions:
1. Generate exactly 3 practical, actionable academic interventions.
2. Focus strictly on academic and institutional support (tutoring, faculty mentoring, study schedules, coursework reminders).
3. Do NOT diagnose the student or make claims about personal, psychological, or home circumstances.
4. Keep the tone constructive, supportive, and professional.
Output plain text with 3 bullet points.`;

        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`;
        const aiResponse = await axios.post(geminiUrl, {
          contents: [{ parts: [{ text: prompt }] }]
        }, { timeout: 3500 });

        const rawText = aiResponse.data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (rawText) {
          return res.json({
            success: true,
            provider: 'Gemini AI',
            interventionText: rawText.trim()
          });
        }
      } catch (geminiError) {
        console.warn('Gemini API call skipped or timed out, using fallback generator:', geminiError.message);
      }
    }

    // High-quality deterministic generation matching Section 19 of the specification:
    // "Possible output: schedule faculty mentoring, recommend academic support for weak subjects, and monitor attendance/assignment completion weekly."
    const items = [];
    if (attendance < 65) {
      items.push("Schedule mandatory 1-on-1 faculty mentoring to establish an attendance recovery plan.");
    }
    if (currentGpa < previousGpa || internalMarks < 65) {
      items.push("Recommend specialized academic support and peer tutoring for core subjects showing performance decline.");
    }
    if (assignmentRate < 70) {
      items.push("Activate automated assignment reminder notifications and monitor weekly coursework submissions.");
    }
    if (backlogs >= 2) {
      items.push("Formulate a structured supplementary exam roadmap with departmental remedial sessions.");
    }
    if (items.length < 3) {
      items.push("Enroll in student academic success workshops focusing on time management and continuous evaluation.");
    }

    const outputText = items.slice(0, 3).map((item, idx) => `${idx + 1}. ${item}`).join('\n');

    return res.json({
      success: true,
      provider: 'Rule-Based Cognitive Engine',
      interventionText: outputText
    });
  } catch (error) {
    console.error('Error generating AI intervention:', error);
    return res.status(500).json({ success: false, message: 'Failed to generate intervention text.' });
  }
};
