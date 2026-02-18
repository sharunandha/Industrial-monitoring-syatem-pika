const { fetchLatest } = require("../services/thingspeakService");
const { getThresholds } = require("../services/thresholds");

const getControl = async (req, res, next) => {
  try {
    const { deviceId } = req.params;
    const feed = await fetchLatest();
    const thresholds = getThresholds();
    const power = Number(feed?.field3 || 0);
    const temperature = Number(feed?.field5 || 0);
    const relayStatus =
      power > thresholds.power || temperature > thresholds.temperature ? "OFF" : "ON";
    res.json({
      relayStatus,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getControl };
