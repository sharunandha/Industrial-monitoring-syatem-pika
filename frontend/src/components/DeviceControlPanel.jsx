import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Power,
  Thermometer,
  Gauge,
  AlertTriangle,
  Settings,
  Zap,
  Activity,
  Save,
  ChevronDown
} from "lucide-react";
import { fetchLatest } from "../services/data";

const ToggleSwitch = ({ isOn, onToggle, disabled }) => (
  <motion.button
    onClick={onToggle}
    disabled={disabled}
    className={`relative w-16 h-8 rounded-full transition-colors ${
      isOn 
        ? "bg-gradient-to-r from-yellow-400 to-amber-500 electric-pulse" 
        : "bg-stone-700"
    } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
    whileHover={!disabled ? { scale: 1.05 } : {}}
    whileTap={!disabled ? { scale: 0.95 } : {}}
  >
    <motion.div
      className="absolute top-1 w-6 h-6 rounded-full bg-white shadow-lg flex items-center justify-center"
      animate={{ left: isOn ? "calc(100% - 28px)" : "4px" }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
    >
      {isOn ? (
        <Zap className="w-3 h-3 text-yellow-500 zap-icon" />
      ) : (
        <Power className="w-3 h-3 text-stone-400" />
      )}
    </motion.div>
  </motion.button>
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
    normal: "text-green-400 bg-green-500/20 border-green-500/30",
    warning: "text-yellow-400 bg-yellow-500/20 border-yellow-500/30",
    critical: "text-red-400 bg-red-500/20 border-red-500/30"
  };

  if (!devices.length) {
    return (
      <motion.div className="panel p-8 rounded-2xl text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <Zap className="w-16 h-16 mx-auto text-yellow-400 opacity-50 mb-4 zap-icon" />
        <p className="text-yellow-400 text-lg font-bold">No Devices Found</p>
        <p className="text-stone-400 mt-2">Add a device from the Devices page to control it here</p>
      </motion.div>
    );
  }

  return (
    <motion.div className="space-y-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {/* Header with device selector */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h3 className="text-lg font-bold text-yellow-400 flex items-center gap-2 electric-text">
          <Zap className="w-6 h-6 zap-icon" />
          ⚡ Thunder Control Panel ⚡
        </h3>
        <div className="flex gap-2">
          {/* Device Dropdown */}
          <div className="relative">
            <motion.button
              onClick={() => setShowDropdown(!showDropdown)}
              className="px-4 py-2 panel rounded-lg flex items-center gap-2 text-yellow-300 thunder-border"
              whileHover={{ scale: 1.02 }}
            >
              <Zap className="w-4 h-4" />
              {selectedDevice?.name || "Select Device"}
              <ChevronDown className={`w-4 h-4 transition-transform ${showDropdown ? "rotate-180" : ""}`} />
            </motion.button>
            <AnimatePresence>
              {showDropdown && (
                <motion.div
                  className="absolute top-full mt-2 w-full panel rounded-lg overflow-hidden z-50 border border-yellow-500/30"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  {devices.map(device => (
                    <button
                      key={device.deviceId}
                      onClick={() => { setSelectedDeviceId(device.deviceId); setShowDropdown(false); }}
                      className={`w-full px-4 py-2 text-left hover:bg-yellow-500/10 flex items-center gap-2 ${
                        device.deviceId === selectedDeviceId ? "bg-yellow-500/20 text-yellow-300" : "text-stone-300"
                      }`}
                    >
                      <Zap className="w-3 h-3" />
                      {device.name}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          {/* Settings Button */}
          <motion.button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 hover:bg-stone-700 rounded-lg transition-colors"
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
          >
            <Settings className={`w-5 h-5 ${showSettings ? "text-yellow-400" : "text-stone-400"}`} />
          </motion.button>
        </div>
      </div>

      {/* Main Control Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Power Control Card */}
        <motion.div
          className={`panel p-6 rounded-2xl border-2 ${isOn ? "border-yellow-500/50 electric-pulse" : "border-stone-700"}`}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-xs text-stone-500 uppercase tracking-wider flex items-center gap-1">
                <Zap className="w-3 h-3" /> Power Control
              </p>
              <h4 className="text-2xl font-bold text-white mt-1 thunder-text">
                {selectedDevice?.name || "Device"}
              </h4>
              <p className="text-sm text-stone-400">{selectedDevice?.type || "Smart Device"}</p>
            </div>
            <ToggleSwitch isOn={isOn} onToggle={handleToggle} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Power Reading */}
            <div className={`p-4 rounded-xl border ${statusColors[getPowerStatus()]}`}>
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-4 h-4" />
                <span className="text-xs uppercase tracking-wider">Power</span>
              </div>
              <motion.p className="text-2xl font-bold" key={currentPower} initial={{ scale: 1.2 }} animate={{ scale: 1 }}>
                {currentPower.toFixed(0)} W
              </motion.p>
            </div>

            {/* Temperature Reading */}
            <div className={`p-4 rounded-xl border ${statusColors[getTempStatus()]}`}>
              <div className="flex items-center gap-2 mb-2">
                <Thermometer className="w-4 h-4" />
                <span className="text-xs uppercase tracking-wider">Temp</span>
              </div>
              <motion.p className="text-2xl font-bold" key={currentTemp} initial={{ scale: 1.2 }} animate={{ scale: 1 }}>
                {currentTemp.toFixed(1)} °C
              </motion.p>
            </div>
          </div>

          {/* Status */}
          <div className="mt-4 pt-4 border-t border-stone-700">
            <div className="flex items-center justify-between">
              <span className="text-sm text-stone-400">Device Status</span>
              <motion.span
                className={`px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1 ${
                  isOn ? "bg-yellow-500/20 text-yellow-400" : "bg-stone-700 text-stone-400"
                }`}
              >
                <motion.span
                  className={`w-2 h-2 rounded-full ${isOn ? "bg-yellow-400" : "bg-stone-500"}`}
                  animate={isOn ? { scale: [1, 1.5, 1] } : {}}
                  transition={{ duration: 1, repeat: Infinity }}
                />
                {isOn ? "⚡ CHARGED" : "IDLE"}
              </motion.span>
            </div>
          </div>
        </motion.div>

        {/* Live Readings Card */}
        <motion.div className="panel p-6 rounded-2xl" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
          <p className="text-xs text-stone-500 uppercase tracking-wider mb-4 flex items-center gap-1">
            <Activity className="w-3 h-3" /> Live Readings
          </p>
          
          <div className="space-y-4">
            {/* Voltage */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-yellow-500/20 text-yellow-400">
                  <Activity className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm text-stone-400">Voltage</p>
                  <p className="text-lg font-bold text-white">{currentVoltage.toFixed(1)} V</p>
                </div>
              </div>
            </div>

            {/* Current */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400">
                  <Gauge className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm text-stone-400">Current</p>
                  <p className="text-lg font-bold text-white">{currentCurrent.toFixed(2)} A</p>
                </div>
              </div>
            </div>

            {/* Power Factor */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-orange-500/20 text-orange-400">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm text-stone-400">Power Factor</p>
                  <p className="text-lg font-bold text-white">
                    {currentVoltage && currentCurrent ? Math.min(1, currentPower / (currentVoltage * currentCurrent)).toFixed(2) : "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Alerts Section */}
          {(getPowerStatus() !== "normal" || getTempStatus() !== "normal") && (
            <motion.div
              className="mt-4 p-4 rounded-xl bg-red-500/10 border border-red-500/30"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="flex items-center gap-2 text-red-400 mb-2">
                <AlertTriangle className="w-4 h-4" />
                <span className="text-sm font-semibold">⚠️ ALERT!</span>
              </div>
              <ul className="space-y-1 text-sm text-red-300">
                {getPowerStatus() !== "normal" && <li>⚡ Power: {currentPower.toFixed(0)}W</li>}
                {getTempStatus() !== "normal" && <li>🔥 Temperature: {currentTemp.toFixed(1)}°C</li>}
              </ul>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Threshold Settings Panel */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            className="panel p-6 rounded-2xl border border-yellow-500/30"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <h4 className="text-sm font-semibold text-yellow-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Settings className="w-4 h-4" /> ⚡ Threshold Configuration
            </h4>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="text-xs text-stone-500 block mb-1">Power Warning (W)</label>
                <input 
                  type="number" 
                  value={thresholds.powerWarning} 
                  onChange={(e) => setThresholds(p => ({...p, powerWarning: +e.target.value}))}
                  className="w-full px-4 py-2 bg-stone-900 border border-stone-700 rounded-lg text-white focus:border-yellow-500 focus:outline-none" 
                />
              </div>
              <div>
                <label className="text-xs text-stone-500 block mb-1">Power Critical (W)</label>
                <input 
                  type="number" 
                  value={thresholds.powerCritical} 
                  onChange={(e) => setThresholds(p => ({...p, powerCritical: +e.target.value}))}
                  className="w-full px-4 py-2 bg-stone-900 border border-stone-700 rounded-lg text-white focus:border-red-500 focus:outline-none" 
                />
              </div>
              <div>
                <label className="text-xs text-stone-500 block mb-1">Temp Warning (°C)</label>
                <input 
                  type="number" 
                  value={thresholds.tempWarning} 
                  onChange={(e) => setThresholds(p => ({...p, tempWarning: +e.target.value}))}
                  className="w-full px-4 py-2 bg-stone-900 border border-stone-700 rounded-lg text-white focus:border-yellow-500 focus:outline-none" 
                />
              </div>
              <div>
                <label className="text-xs text-stone-500 block mb-1">Temp Critical (°C)</label>
                <input 
                  type="number" 
                  value={thresholds.tempCritical} 
                  onChange={(e) => setThresholds(p => ({...p, tempCritical: +e.target.value}))}
                  className="w-full px-4 py-2 bg-stone-900 border border-stone-700 rounded-lg text-white focus:border-red-500 focus:outline-none" 
                />
              </div>
            </div>

            <motion.button
              onClick={async () => { 
                setIsSaving(true); 
                await new Promise(r => setTimeout(r, 1000)); 
                setIsSaving(false); 
                setShowSettings(false); 
              }}
              disabled={isSaving}
              className="mt-4 px-6 py-3 bg-gradient-to-r from-yellow-400 to-amber-500 text-stone-900 font-bold rounded-lg flex items-center gap-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isSaving ? (
                <div className="pokeball-spinner" />
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Save Thresholds
                </>
              )}
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default DeviceControlPanel;
