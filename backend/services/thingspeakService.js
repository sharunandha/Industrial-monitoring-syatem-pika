const axios = require("axios");

const baseUrl = "https://api.thingspeak.com";

// Hardcoded ThingSpeak credentials
const THINGSPEAK_CONFIG = {
  channelId: "3262654",
  readKey: "MQDH6IR59TOT5JF5",
  writeKey: "03CL3839V4KA7EXL"
};

const getConfig = () => ({
  channelId: THINGSPEAK_CONFIG.channelId,
  readKey: THINGSPEAK_CONFIG.readKey,
  writeKey: THINGSPEAK_CONFIG.writeKey
});

const ensureConfig = () => {
  const { channelId, readKey, writeKey } = getConfig();
  if (!channelId || !readKey || !writeKey) {
    throw new Error("ThingSpeak keys are not configured");
  }
  return { channelId, readKey, writeKey };
};

const writeReading = async (reading) => {
  const { writeKey } = ensureConfig();
  const payload = {
    api_key: writeKey,
    field1: reading.voltage,
    field2: reading.current,
    field3: reading.power,
    field4: reading.energy,
    field5: reading.temperature
  };

  if (reading.timestamp) {
    payload.created_at = new Date(reading.timestamp).toISOString();
  }

  const { data } = await axios.post(`${baseUrl}/update.json`, payload);
  return data;
};

const fetchLatest = async () => {
  const { channelId, readKey } = ensureConfig();
  const { data } = await axios.get(
    `${baseUrl}/channels/${channelId}/feeds/last.json`,
    { params: { api_key: readKey } }
  );
  return data;
};

const fetchFeeds = async ({ start, end, results = 8000 }) => {
  const { channelId, readKey } = ensureConfig();
  const params = {
    api_key: readKey,
    results
  };

  if (start) {
    params.start = new Date(start).toISOString();
  }
  if (end) {
    params.end = new Date(end).toISOString();
  }

  const { data } = await axios.get(
    `${baseUrl}/channels/${channelId}/feeds.json`,
    { params }
  );
  return data;
};

const fetchCsv = async ({ start, end }) => {
  const { channelId, readKey } = ensureConfig();
  const params = { api_key: readKey };
  if (start) params.start = new Date(start).toISOString();
  if (end) params.end = new Date(end).toISOString();

  const { data } = await axios.get(
    `${baseUrl}/channels/${channelId}/feeds.csv`,
    { params }
  );
  return data;
};

module.exports = { writeReading, fetchLatest, fetchFeeds, fetchCsv };
