/**
 * Device Polling Service
 * Handles real-time data fetching from ThingSpeak for all registered devices
 * Implements per-device polling with configurable intervals
 */

const axios = require("axios");
const cron = require("node-cron");
const { EventEmitter } = require("events");

class DevicePollingService extends EventEmitter {
  constructor() {
    super();
    this.devices = new Map();
    this.pollingJobs = new Map();
    this.latestReadings = new Map();
    this.cache = new Map();
    this.cacheExpiry = 15000; // 15 seconds
    this.baseUrl = "https://api.thingspeak.com";
  }

  /**
   * Register a device for polling
   * @param {Object} device - Device configuration
   */
  registerDevice(device) {
    if (!device.channelId || !device.readKey) {
      console.warn(`Device ${device.deviceId} missing ThingSpeak credentials`);
      return false;
    }

    this.devices.set(device.deviceId, {
      ...device,
      lastFetch: null,
      status: "active",
      errorCount: 0
    });

    console.log(`Device registered for polling: ${device.deviceId}`);
    return true;
  }

  /**
   * Unregister a device from polling
   * @param {string} deviceId - Device identifier
   */
  unregisterDevice(deviceId) {
    this.devices.delete(deviceId);
    this.latestReadings.delete(deviceId);
    this.cache.delete(deviceId);
    
    const job = this.pollingJobs.get(deviceId);
    if (job) {
      job.stop();
      this.pollingJobs.delete(deviceId);
    }
    
    console.log(`Device unregistered from polling: ${deviceId}`);
  }

  /**
   * Fetch latest reading from ThingSpeak for a specific device
   * @param {string} deviceId - Device identifier
   */
  async fetchLatestReading(deviceId) {
    const device = this.devices.get(deviceId);
    if (!device) {
      throw new Error(`Device not found: ${deviceId}`);
    }

    // Check cache first
    const cached = this.cache.get(deviceId);
    if (cached && Date.now() - cached.timestamp < this.cacheExpiry) {
      return cached.data;
    }

    try {
      const { data } = await axios.get(
        `${this.baseUrl}/channels/${device.channelId}/feeds/last.json`,
        {
          params: { api_key: device.readKey },
          timeout: 10000
        }
      );

      const reading = this.mapFeedToReading(data, deviceId);
      
      // Update cache
      this.cache.set(deviceId, {
        data: reading,
        timestamp: Date.now()
      });

      // Update latest reading
      this.latestReadings.set(deviceId, reading);
      
      // Update device status
      device.lastFetch = new Date().toISOString();
      device.status = "active";
      device.errorCount = 0;

      // Emit reading event
      this.emit("reading", { deviceId, reading });

      return reading;
    } catch (error) {
      device.errorCount++;
      if (device.errorCount >= 3) {
        device.status = "error";
      }
      console.error(`Error fetching data for ${deviceId}:`, error.message);
      throw error;
    }
  }

  /**
   * Fetch historical feeds from ThingSpeak
   * @param {string} deviceId - Device identifier
   * @param {Object} options - Query options (start, end, results)
   */
  async fetchFeeds(deviceId, options = {}) {
    const device = this.devices.get(deviceId);
    if (!device) {
      throw new Error(`Device not found: ${deviceId}`);
    }

    const params = {
      api_key: device.readKey,
      results: options.results || 100
    };

    if (options.start) {
      params.start = new Date(options.start).toISOString();
    }
    if (options.end) {
      params.end = new Date(options.end).toISOString();
    }

    try {
      const { data } = await axios.get(
        `${this.baseUrl}/channels/${device.channelId}/feeds.json`,
        { params, timeout: 30000 }
      );

      const feeds = (data.feeds || [])
        .filter(feed => feed && (feed.field1 || feed.field2 || feed.field3))
        .map(feed => this.mapFeedToReading(feed, deviceId));

      return {
        channel: data.channel,
        feeds
      };
    } catch (error) {
      console.error(`Error fetching feeds for ${deviceId}:`, error.message);
      throw error;
    }
  }

  /**
   * Map ThingSpeak feed to standardized reading format
   * field1 → Voltage, field2 → Current, field3 → Power,
   * field4 → Energy, field5 → Temperature
   */
  mapFeedToReading(feed, deviceId) {
    if (!feed) return null;

    return {
      deviceId,
      voltage: this.parseField(feed.field1),
      current: this.parseField(feed.field2),
      power: this.parseField(feed.field3),
      energy: this.parseField(feed.field4),
      temperature: this.parseField(feed.field5),
      timestamp: feed.created_at || new Date().toISOString(),
      entryId: feed.entry_id
    };
  }

  /**
   * Parse field value with validation
   */
  parseField(value) {
    if (value === null || value === undefined || value === "") {
      return 0;
    }
    const parsed = Number(value);
    return isNaN(parsed) ? 0 : parsed;
  }

  /**
   * Get latest reading for a device (from cache)
   */
  getLatestReading(deviceId) {
    return this.latestReadings.get(deviceId) || null;
  }

  /**
   * Get all latest readings
   */
  getAllLatestReadings() {
    const readings = {};
    this.latestReadings.forEach((reading, deviceId) => {
      readings[deviceId] = reading;
    });
    return readings;
  }

  /**
   * Get device status
   */
  getDeviceStatus(deviceId) {
    const device = this.devices.get(deviceId);
    if (!device) return null;

    return {
      deviceId: device.deviceId,
      status: device.status,
      lastFetch: device.lastFetch,
      errorCount: device.errorCount
    };
  }

  /**
   * Start global polling for all devices
   * @param {number} intervalSeconds - Polling interval
   */
  startPolling(intervalSeconds = 15) {
    // Poll every intervalSeconds seconds
    const cronExpression = `*/${intervalSeconds} * * * * *`;
    
    this.globalPollingJob = cron.schedule(cronExpression, async () => {
      for (const [deviceId] of this.devices) {
        try {
          await this.fetchLatestReading(deviceId);
        } catch (error) {
          // Error already logged in fetchLatestReading
        }
      }
    });

    console.log(`Started global polling every ${intervalSeconds} seconds`);
  }

  /**
   * Stop all polling
   */
  stopPolling() {
    if (this.globalPollingJob) {
      this.globalPollingJob.stop();
      this.globalPollingJob = null;
    }

    this.pollingJobs.forEach(job => job.stop());
    this.pollingJobs.clear();

    console.log("Stopped all polling jobs");
  }
}

// Singleton instance
const devicePollingService = new DevicePollingService();

module.exports = devicePollingService;
