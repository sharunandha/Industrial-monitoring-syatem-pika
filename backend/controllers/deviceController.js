const crypto = require("crypto");
const { getThresholds, setThresholds } = require("../services/thresholds");
const devicePollingService = require("../services/devicePollingService");

// Device types for industrial applications
const DEVICE_TYPES = [
  "LED Bulb",
  "Fluorescent Bulb",
  "Motor",
  "Industrial Heater",
  "Pump",
  "HVAC System",
  "Compressor",
  "Transformer",
  "Production Machine",
  "Smart Plug",
  "Refrigerator",
  "Air Conditioner",
  "Water Heater",
  "Solar Inverter",
  "Generator",
  "Other"
];

// Initialize with default devices
let devices = [
  {
    deviceId: process.env.THINGSPEAK_DEVICE_ID || "led-bulb-1",
    name: process.env.DEVICE_NAME || "LED Bulb #1",
    location: process.env.DEVICE_LOCATION || "Production Floor",
    type: "LED Bulb",
    thresholds: getThresholds(),
    secretKey: process.env.DEVICE_SECRET_KEY || process.env.THINGSPEAK_WRITE_KEY,
    channelId: process.env.THINGSPEAK_CHANNEL_ID,
    readKey: process.env.THINGSPEAK_READ_KEY,
    writeKey: process.env.THINGSPEAK_WRITE_KEY,
    // New industrial fields
    ratedPower: Number(process.env.RATED_POWER || 100),
    tariffRate: Number(process.env.TARIFF_RATE || 0.18),
    emissionFactor: Number(process.env.CARBON_EMISSION_FACTOR || 0.82),
    status: "active",
    controlState: "on",
    peakDemandLimit: 5000,
    temperatureWarning: 60,
    createdAt: new Date().toISOString()
  }
];

// Add second device if configured
if (process.env.THINGSPEAK_CHANNEL_ID_2) {
  devices.push({
    deviceId: process.env.THINGSPEAK_DEVICE_ID_2 || "fluorescent-bulb-1",
    name: "Fluorescent Bulb #1",
    location: "Warehouse",
    type: "Fluorescent Bulb",
    thresholds: getThresholds(),
    secretKey: crypto.randomBytes(16).toString("hex"),
    channelId: process.env.THINGSPEAK_CHANNEL_ID_2,
    readKey: process.env.THINGSPEAK_READ_KEY_2,
    writeKey: process.env.THINGSPEAK_WRITE_KEY_2,
    ratedPower: 60,
    tariffRate: 0.18,
    emissionFactor: 0.82,
    status: "active",
    controlState: "on",
    peakDemandLimit: 3000,
    temperatureWarning: 55,
    createdAt: new Date().toISOString()
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
      thresholds: d.thresholds,
      ratedPower: d.ratedPower,
      tariffRate: d.tariffRate,
      emissionFactor: d.emissionFactor,
      status: d.status,
      controlState: d.controlState,
      peakDemandLimit: d.peakDemandLimit,
      temperatureWarning: d.temperatureWarning,
      createdAt: d.createdAt,
      channelId: d.channelId
    }));
    res.json(safeDevices);
  } catch (error) {
    next(error);
  }
};

const getDeviceTypes = (req, res) => {
  res.json(DEVICE_TYPES);
};

const createDevice = async (req, res, next) => {
  try {
    const { 
      deviceId, 
      name, 
      location, 
      type, 
      thresholds, 
      channelId, 
      readKey, 
      writeKey,
      ratedPower,
      tariffRate,
      emissionFactor,
      peakDemandLimit,
      temperatureWarning
    } = req.body;

    // Validate required fields
    if (!deviceId || !name) {
      return res.status(400).json({ message: "deviceId and name are required" });
    }

    // Check if device already exists
    if (devices.find(d => d.deviceId === deviceId)) {
      return res.status(400).json({ message: "Device with this ID already exists" });
    }

    const secretKey = crypto.randomBytes(16).toString("hex");
    const device = {
      deviceId,
      name,
      location: location || "Unspecified",
      type: type || "Other",
      thresholds: thresholds || getThresholds(),
      secretKey,
      channelId: channelId || null,
      readKey: readKey || null,
      writeKey: writeKey || null,
      ratedPower: Number(ratedPower) || 100,
      tariffRate: Number(tariffRate) || 0.18,
      emissionFactor: Number(emissionFactor) || 0.82,
      status: "active",
      controlState: "off",
      peakDemandLimit: Number(peakDemandLimit) || 5000,
      temperatureWarning: Number(temperatureWarning) || 60,
      createdAt: new Date().toISOString()
    };

    devices.push(device);

    // Register device for polling if ThingSpeak credentials provided
    if (device.channelId && device.readKey) {
      devicePollingService.registerDevice(device);
    }
    
    // Return safe device info (without sensitive keys)
    const safeDevice = {
      deviceId: device.deviceId,
      name: device.name,
      location: device.location,
      type: device.type,
      thresholds: device.thresholds,
      ratedPower: device.ratedPower,
      tariffRate: device.tariffRate,
      emissionFactor: device.emissionFactor,
      status: device.status,
      controlState: device.controlState,
      peakDemandLimit: device.peakDemandLimit,
      temperatureWarning: device.temperatureWarning,
      createdAt: device.createdAt,
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
  getDeviceByIdWithKeys,
  getDeviceTypes,
  DEVICE_TYPES
};
