import React, { useState, useEffect } from "react";
import {
  Power,
  Thermometer,
  Gauge,
  AlertTriangle,
  Settings,
  Activity,
  Save,
  ChevronDown,
  Zap
} from "lucide-react";
import { fetchLatest } from "../services/data";

const ToggleSwitch = ({ isOn, onToggle, disabled }) => (
  <button
    onClick={onToggle}
    disabled={disabled}
    className={`relative w-14 h-7 rounded-full transition-colors ${
      isOn 
        ? "bg-blue-600" 
        : "bg-gray-300"
    } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
  >
    <div
      className={`absolute top-0.5 w-6 h-6 rounded-full bg-white shadow transition-all flex items-center justify-center ${
        isOn ? "left-7" : "left-0.5"
      }`}
    >
      {isOn ? (
        <Power className="w-3 h-3 text-blue-600" />
      ) : (
        <Power className="w-3 h-3 text-gray-400" />
      )}
    </div>
  </button>
);

const DeviceControlPanel = ({ devices = [] }) => {
  const [selectedDeviceId, setSelectedDeviceId] = useState(devices[0]?.deviceId || "");
  const [deviceStates, setDeviceStates] = useState({});
  const [latestReadings, setLatestReadings] = useState({});
  const [showSettings, setShowSettings] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [thresholds, setThresholds] = useState({
    powerWarning: 3000,
    powerCritical: 4500,
    tempWarning: 45,
    tempCritical: 60,
    voltageMin: 200,
    voltageMax: 250,
    currentMax: 20
  });

  const selectedDevice = devices.find(d => d.deviceId === selectedDeviceId) || devices[0];
  const isOn = deviceStates[selectedDeviceId] ?? true;
  const reading = latestReadings[selectedDeviceId] || {};

  useEffect(() => {
    if (devices.length > 0 && !selectedDeviceId) {
      setSelectedDeviceId(devices[0].deviceId);
    }
  }, [devices]);

  useEffect(() => {
    const loadReadings = async () => {
      for (const device of devices) {
        try {
          const data = await fetchLatest(device.deviceId);
          setLatestReadings(prev => ({ ...prev, [device.deviceId]: data }));
        } catch (e) {
          console.log("Error fetching readings", e);
        }
      }
    };
    if (devices.length) loadReadings();
    const interval = setInterval(loadReadings, 5000);
    return () => clearInterval(interval);
  }, [devices]);

  const handleToggle = () => {
    setDeviceStates(prev => ({ ...prev, [selectedDeviceId]: !isOn }));
  };

  const currentPower = reading?.power || 0;
  const currentTemp = reading?.temperature || 0;
  const currentVoltage = reading?.voltage || 0;
  const currentCurrent = reading?.current || 0;

  const getPowerStatus = () => {
    if (currentPower >= thresholds.powerCritical) return "critical";
    if (currentPower >= thresholds.powerWarning) return "warning";
    return "normal";
  };

  const getTempStatus = () => {
    if (currentTemp >= thresholds.tempCritical) return "critical";
    if (currentTemp >= thresholds.tempWarning) return "warning";
    return "normal";
  };

  const statusColors = {
    normal: "text-green-700 bg-green-50 border-green-200",
    warning: "text-yellow-700 bg-yellow-50 border-yellow-200",
    critical: "text-red-700 bg-red-50 border-red-200"
  };

  if (!devices.length) {
    return (
      <div className="bg-white p-8 rounded-lg border border-gray-200 text-center">
        <Zap className="w-12 h-12 mx-auto text-gray-300 mb-4" />
        <p className="text-gray-700 font-medium">No Devices Found</p>
        <p className="text-gray-500 text-sm mt-2">Add a device from the Devices page to control it here</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header with device selector */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Settings className="w-5 h-5 text-gray-500" />
          Control Panel
        </h3>
        <div className="flex gap-2">
          {/* Device Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg flex items-center gap-2 text-gray-700 hover:bg-gray-50"
            >
              <Zap className="w-4 h-4 text-blue-600" />
              {selectedDevice?.name || "Select Device"}
              <ChevronDown className={`w-4 h-4 transition-transform ${showDropdown ? "rotate-180" : ""}`} />
            </button>
            {showDropdown && (
              <div className="absolute top-full mt-2 w-full bg-white rounded-lg border border-gray-200 shadow-lg overflow-hidden z-50">
                {devices.map(device => (
                  <button
                    key={device.deviceId}
                    onClick={() => { setSelectedDeviceId(device.deviceId); setShowDropdown(false); }}
                    className={`w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2 ${
                      device.deviceId === selectedDeviceId ? "bg-blue-50 text-blue-700" : "text-gray-700"
                    }`}
                  >
                    <Zap className="w-3 h-3" />
                    {device.name}
                  </button>
                ))}
              </div>
            )}
          </div>
          {/* Settings Button */}
          <button
            onClick={() => setShowSettings(!showSettings)}
            className={`p-2 rounded-lg border transition ${
              showSettings ? "bg-blue-50 border-blue-200 text-blue-600" : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
            }`}
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Control Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Power Control Card */}
        <div className={`bg-white p-6 rounded-lg border ${isOn ? "border-blue-200" : "border-gray-200"}`}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide flex items-center gap-1">
                <Power className="w-3 h-3" /> Power Control
              </p>
              <h4 className="text-xl font-semibold text-gray-900 mt-1">
                {selectedDevice?.name || "Device"}
              </h4>
              <p className="text-sm text-gray-500">{selectedDevice?.type || "Smart Device"}</p>
            </div>
            <ToggleSwitch isOn={isOn} onToggle={handleToggle} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Power Reading */}
            <div className={`p-4 rounded-lg border ${statusColors[getPowerStatus()]}`}>
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-4 h-4" />
                <span className="text-xs uppercase tracking-wide">Power</span>
              </div>
              <p className="text-xl font-bold">
                {currentPower.toFixed(0)} W
              </p>
            </div>

            {/* Temperature Reading */}
            <div className={`p-4 rounded-lg border ${statusColors[getTempStatus()]}`}>
              <div className="flex items-center gap-2 mb-2">
                <Thermometer className="w-4 h-4" />
                <span className="text-xs uppercase tracking-wide">Temp</span>
              </div>
              <p className="text-xl font-bold">
                {currentTemp.toFixed(1)} °C
              </p>
            </div>
          </div>

          {/* Status */}
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Device Status</span>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${
                  isOn ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${isOn ? "bg-green-500" : "bg-gray-400"}`} />
                {isOn ? "ACTIVE" : "IDLE"}
              </span>
            </div>
          </div>
        </div>

        {/* Live Readings Card */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-4 flex items-center gap-1">
            <Activity className="w-3 h-3" /> Live Readings
          </p>
          
          <div className="space-y-4">
            {/* Voltage */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                  <Activity className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Voltage</p>
                  <p className="text-lg font-semibold text-gray-900">{currentVoltage.toFixed(1)} V</p>
                </div>
              </div>
            </div>

            {/* Current */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-orange-50 text-orange-600">
                  <Gauge className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Current</p>
                  <p className="text-lg font-semibold text-gray-900">{currentCurrent.toFixed(2)} A</p>
                </div>
              </div>
            </div>

            {/* Power Factor */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-50 text-purple-600">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Power Factor</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {currentVoltage && currentCurrent ? Math.min(1, currentPower / (currentVoltage * currentCurrent)).toFixed(2) : "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Alerts Section */}
          {(getPowerStatus() !== "normal" || getTempStatus() !== "normal") && (
            <div className="mt-4 p-4 rounded-lg bg-red-50 border border-red-200">
              <div className="flex items-center gap-2 text-red-700 mb-2">
                <AlertTriangle className="w-4 h-4" />
                <span className="text-sm font-semibold">Alert</span>
              </div>
              <ul className="space-y-1 text-sm text-red-600">
                {getPowerStatus() !== "normal" && <li>Power: {currentPower.toFixed(0)}W exceeds threshold</li>}
                {getTempStatus() !== "normal" && <li>Temperature: {currentTemp.toFixed(1)}°C exceeds threshold</li>}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Threshold Settings Panel */}
      {showSettings && (
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4 flex items-center gap-2">
            <Settings className="w-4 h-4" /> Threshold Configuration
          </h4>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="text-xs text-gray-500 block mb-1">Power Warning (W)</label>
              <input 
                type="number" 
                value={thresholds.powerWarning} 
                onChange={(e) => setThresholds(p => ({...p, powerWarning: +e.target.value}))}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none" 
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 block mb-1">Power Critical (W)</label>
              <input 
                type="number" 
                value={thresholds.powerCritical} 
                onChange={(e) => setThresholds(p => ({...p, powerCritical: +e.target.value}))}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none" 
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 block mb-1">Temp Warning (°C)</label>
              <input 
                type="number" 
                value={thresholds.tempWarning} 
                onChange={(e) => setThresholds(p => ({...p, tempWarning: +e.target.value}))}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 focus:outline-none" 
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 block mb-1">Temp Critical (°C)</label>
              <input 
                type="number" 
                value={thresholds.tempCritical} 
                onChange={(e) => setThresholds(p => ({...p, tempCritical: +e.target.value}))}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none" 
              />
            </div>
          </div>

          <button
            onClick={async () => { 
              setIsSaving(true); 
              await new Promise(r => setTimeout(r, 1000)); 
              setIsSaving(false); 
              setShowSettings(false); 
            }}
            disabled={isSaving}
            className="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg flex items-center gap-2 transition disabled:opacity-50"
          >
            {isSaving ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Thresholds
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default DeviceControlPanel;
