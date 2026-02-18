const crypto = require("crypto");
const { getThresholds, setThresholds } = require("../services/thresholds");

// Initialize with default device
let devices = [
  {
    deviceId: process.env.THINGSPEAK_DEVICE_ID || "thingspeak-channel",
    name: process.env.DEVICE_NAME || "Smart Bulb #1",
    location: process.env.DEVICE_LOCATION || "Living Room",
    type: "LED Bulb",
    thresholds: getThresholds(),
    secretKey: process.env.DEVICE_SECRET_KEY || process.env.THINGSPEAK_WRITE_KEY,
    channelId: process.env.THINGSPEAK_CHANNEL_ID,
    readKey: process.env.THINGSPEAK_READ_KEY,
    writeKey: process.env.THINGSPEAK_WRITE_KEY
  }
];

// Add second device if configured
if (process.env.THINGSPEAK_CHANNEL_ID_2) {
  devices.push({
    deviceId: process.env.THINGSPEAK_DEVICE_ID_2 || "thingspeak-channel-2",
    name: "Smart Bulb #2",
    location: "Bedroom",
    type: "LED Bulb",
    thresholds: getThresholds(),
    secretKey: crypto.randomBytes(16).toString("hex"),
    channelId: process.env.THINGSPEAK_CHANNEL_ID_2,
    readKey: process.env.THINGSPEAK_READ_KEY_2,
    writeKey: process.env.THINGSPEAK_WRITE_KEY_2
  });
}

const listDevices = async (req, res, next) => {
  try {
    // Return devices without sensitive keys
    const safeDevices = devices.map((d) => ({
      deviceId: d.deviceId,
      name: d.name,
      location: d.location,
      type: d.type,
      thresholds: d.thresholds
    }));
    res.json(safeDevices);
  } catch (error) {
    next(error);
  }
};

const createDevice = async (req, res, next) => {
  try {
    const { deviceId, name, location, type, thresholds, channelId, readKey, writeKey } = req.body;
    const secretKey = crypto.randomBytes(16).toString("hex");
    const device = {
      deviceId,
      name,
      location,
      type: type || "Smart Device",
      thresholds: thresholds || getThresholds(),
      secretKey,
      channelId: channelId || process.env.THINGSPEAK_CHANNEL_ID,
      readKey: readKey || process.env.THINGSPEAK_READ_KEY,
      writeKey: writeKey || process.env.THINGSPEAK_WRITE_KEY
    };

    devices.push(device);
    
    // Return safe device info (without keys)
    const safeDevice = {
      deviceId: device.deviceId,
      name: device.name,
      location: device.location,
      type: device.type,
      thresholds: device.thresholds,
      secretKey
    };
    
    res.status(201).json(safeDevice);
  } catch (error) {
    next(error);
  }
};

const getDevice = async (req, res, next) => {
  try {
    const { deviceId } = req.params;
    const device = devices.find((item) => item.deviceId === deviceId);

    if (!device) {
      return res.status(404).json({ message: "Device not found" });
    }

    const safeDevice = {
      deviceId: device.deviceId,
      name: device.name,
      location: device.location,
      type: device.type,
      thresholds: device.thresholds,
      channelId: device.channelId
    };

    res.json(safeDevice);
  } catch (error) {
    next(error);
  }
};

const updateDevice = async (req, res, next) => {
  try {
    const { deviceId } = req.params;
    const { name, location, type, thresholds } = req.body;
    const device = devices.find((item) => item.deviceId === deviceId);

    if (!device) {
      return res.status(404).json({ message: "Device not found" });
    }

    device.name = name ?? device.name;
    device.location = location ?? device.location;
    device.type = type ?? device.type;
    if (thresholds) {
      device.thresholds = setThresholds(thresholds);
    }

    const safeDevice = {
      deviceId: device.deviceId,
      name: device.name,
      location: device.location,
      type: device.type,
      thresholds: device.thresholds
    };

    res.json(safeDevice);
  } catch (error) {
    next(error);
  }
};

const rotateKey = async (req, res, next) => {
  try {
    const { deviceId } = req.params;
    const device = devices.find((item) => item.deviceId === deviceId);
    if (!device) {
      return res.status(404).json({ message: "Device not found" });
    }

    device.secretKey = crypto.randomBytes(16).toString("hex");
    res.json({ deviceId: device.deviceId, secretKey: device.secretKey });
  } catch (error) {
    next(error);
  }
};

const deleteDevice = async (req, res, next) => {
  try {
    const { deviceId } = req.params;
    const index = devices.findIndex((item) => item.deviceId === deviceId);
    if (index === -1) {
      return res.status(404).json({ message: "Device not found" });
    }

    // Prevent deleting the last device
    if (devices.length === 1) {
      return res.status(400).json({ message: "Cannot delete the last device" });
    }

    devices.splice(index, 1);
    res.json({ message: "Device deleted successfully" });
  } catch (error) {
    next(error);
  }
};

// Helper function to get device by ID with all details
const getDeviceByIdWithKeys = (deviceId) => {
  return devices.find((item) => item.deviceId === deviceId);
};

module.exports = { 
  listDevices, 
  createDevice, 
  getDevice,
  updateDevice, 
  rotateKey, 
  deleteDevice,
  getDeviceByIdWithKeys
};
