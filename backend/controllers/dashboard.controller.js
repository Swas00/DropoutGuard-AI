const datastore = require('../services/datastore');

exports.getDashboardData = async (req, res) => {
  try {
    const stats = datastore.getDashboardStats();
    return res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error in getDashboardData:', error);
    return res.status(500).json({ success: false, message: 'Server error retrieving dashboard statistics.' });
  }
};
