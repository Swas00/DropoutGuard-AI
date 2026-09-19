const datastore = require('../services/datastore');

exports.getStudents = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 25,
      search = '',
      riskLevel = 'ALL',
      course = 'ALL',
      semester = 'ALL',
      sortBy = 'riskScore',
      sortOrder = 'desc'
    } = req.query;

    const result = datastore.getAllStudents({
      page: parseInt(page),
      limit: parseInt(limit),
      search,
      riskLevel,
      course,
      semester,
      sortBy,
      sortOrder
    });

    return res.json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error('Error fetching students:', error);
    return res.status(500).json({ success: false, message: 'Server error retrieving students.' });
  }
};

exports.getStudentById = async (req, res) => {
  try {
    const { id } = req.params;
    const student = datastore.getStudentById(id);

    if (!student) {
      return res.status(404).json({ success: false, message: `Student with ID ${id} not found.` });
    }

    return res.json({
      success: true,
      student
    });
  } catch (error) {
    console.error('Error fetching student details:', error);
    return res.status(500).json({ success: false, message: 'Server error retrieving student details.' });
  }
};

exports.createStudent = async (req, res) => {
  try {
    const { name, course, semester, attendance, previousGpa, currentGpa } = req.body;
    if (!name || !course || attendance === undefined || currentGpa === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Name, course, attendance, and current GPA are required fields.'
      });
    }

    const newStudent = await datastore.addStudent(req.body);
    return res.status(201).json({
      success: true,
      message: `Student ${newStudent.name} (${newStudent.studentId}) registered successfully with ${newStudent.riskLevel} risk tier (${newStudent.riskScore}%).`,
      student: newStudent
    });
  } catch (error) {
    console.error('Error creating student:', error);
    return res.status(400).json({
      success: false,
      message: error.message || 'Error creating student record.'
    });
  }
};

exports.updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await datastore.updateStudent(id, req.body);

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: `Student with ID ${id} not found.`
      });
    }

    return res.json({
      success: true,
      message: `Student ${updated.studentId} updated successfully. Recalculated risk: ${updated.riskScore}% (${updated.riskLevel}).`,
      student: updated
    });
  } catch (error) {
    console.error('Error updating student:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error updating student.'
    });
  }
};

exports.deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await datastore.deleteStudent(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: `Student with ID ${id} not found.`
      });
    }

    return res.json({
      success: true,
      message: `Student ${id} was successfully archived/removed from institutional database.`
    });
  } catch (error) {
    console.error('Error deleting student:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error deleting student.'
    });
  }
};

exports.bulkImportStudents = async (req, res) => {
  try {
    const { students } = req.body;
    if (!students || !Array.isArray(students) || students.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Request body must contain a non-empty array of student records in "students".'
      });
    }

    const result = await datastore.bulkImportStudents(students);
    return res.status(201).json({
      success: true,
      message: `Successfully ingested and calculated risk scores for ${result.count} student telemetry profiles.`,
      ...result
    });
  } catch (error) {
    console.error('Error bulk importing students:', error);
    return res.status(400).json({
      success: false,
      message: error.message || 'Error processing bulk student ingestion.'
    });
  }
};

