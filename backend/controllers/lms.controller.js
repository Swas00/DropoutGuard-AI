const lmsService = require('../services/lmsService');

exports.getConnectors = async (req, res) => {
  try {
    const connectors = lmsService.getConnectors();
    return res.json({
      success: true,
      connectors
    });
  } catch (err) {
    console.error('getConnectors error:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve LMS connectors.'
    });
  }
};

exports.updateConfig = async (req, res) => {
  try {
    const { provider } = req.params;
    const config = req.body;
    const updated = lmsService.updateConfig(provider, config);
    return res.json({
      success: true,
      message: `Connector ${updated.name} updated successfully.`,
      connector: updated
    });
  } catch (err) {
    console.error('updateConfig error:', err);
    return res.status(400).json({
      success: false,
      message: err.message || 'Failed to update LMS connector.'
    });
  }
};

exports.testConnection = async (req, res) => {
  try {
    const { provider } = req.params;
    const result = await lmsService.testConnection(provider);
    return res.json({
      success: true,
      result
    });
  } catch (err) {
    console.error('testConnection error:', err);
    return res.status(500).json({
      success: false,
      message: err.message || 'LMS connection test failed.'
    });
  }
};

exports.syncTelemetry = async (req, res) => {
  try {
    const { provider } = req.params;
    const { limit } = req.body || {};
    const result = await lmsService.syncTelemetry(provider, { limit: limit || 35 });
    return res.json({
      success: true,
      message: result.message,
      result
    });
  } catch (err) {
    console.error('syncTelemetry error:', err);
    return res.status(500).json({
      success: false,
      message: err.message || 'LMS telemetry sync failed.'
    });
  }
};

exports.getSyncHistory = async (req, res) => {
  try {
    const history = lmsService.getSyncHistory();
    return res.json({
      success: true,
      history
    });
  } catch (err) {
    console.error('getSyncHistory error:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve LMS sync history.'
    });
  }
};
