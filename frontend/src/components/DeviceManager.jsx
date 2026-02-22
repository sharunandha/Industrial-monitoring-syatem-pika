import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, 
  Settings, 
  Zap, 
  Thermometer, 
  MapPin, 
  Server,
  ChevronDown,
  X,
  Check,
  AlertTriangle
} from "lucide-react";

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

const DeviceManager = ({ devices, currentDevice, onDeviceSelect, onCreateDevice }) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    deviceId: "",
    name: "",
    location: "",
    type: "LED Bulb",
    channelId: "",
    readKey: "",
    writeKey: "",
    ratedPower: 100,
    tariffRate: 0.18,
    emissionFactor: 0.82,
    peakDemandLimit: 5000,
    temperatureWarning: 60
  });

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value
    }));
  };

  const handleCreate = async () => {
    if (!formData.name || !formData.location) {
      return;
    }

    setIsSubmitting(true);
    try {
      const devicePayload = {
        ...formData,
        deviceId: formData.deviceId || `device-${Date.now()}`
      };
      await onCreateDevice(devicePayload);
      setFormData({
        deviceId: "",
        name: "",
        location: "",
        type: "LED Bulb",
        channelId: "",
        readKey: "",
        writeKey: "",
        ratedPower: 100,
        tariffRate: 0.18,
        emissionFactor: 0.82,
        peakDemandLimit: 5000,
        temperatureWarning: 60
      });
      setShowCreateForm(false);
    } catch (error) {
      console.error("Failed to create device:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentDeviceData = devices.find((d) => d.deviceId === currentDevice);

  return (
    <div className="space-y-4">
      {/* Device Tabs with Animation */}
      <div className="flex flex-wrap gap-2 justify-between items-center">
        <motion.div 
          className="flex flex-wrap gap-2"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {devices.map((device, index) => (
            <motion.button
              key={device.deviceId}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => onDeviceSelect(device.deviceId)}
              className={`px-4 py-2 rounded-lg font-semibold transition-all text-sm md:text-base relative overflow-hidden ${
                currentDevice === device.deviceId
                  ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg"
                  : "panel hover:border-cyan-500 text-stone-300 hover:text-cyan-300"
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {currentDevice === device.deviceId && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-blue-400/20"
                  animate={{ x: ["-100%", "100%"] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                />
              )}
              <span className="flex items-center gap-2 relative z-10">
                <motion.span 
                  className={`w-2 h-2 rounded-full ${
                    device.status === "active" ? "bg-green-400" : 
                    device.status === "error" ? "bg-red-400" : "bg-yellow-400"
                  }`}
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <Server className="w-4 h-4" />
                {device.name}
              </span>
            </motion.button>
          ))}
        </motion.div>

        <motion.button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all flex items-center gap-2"
          whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(16, 185, 129, 0.4)" }}
          whileTap={{ scale: 0.95 }}
        >
          <Plus className="w-5 h-5" />
          Add Device
        </motion.button>
      </div>

      {/* Create Device Form */}
      <AnimatePresence>
        {showCreateForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="panel p-6 rounded-2xl border border-green-500/30 bg-gradient-to-br from-green-500/10 to-emerald-500/5">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-green-300 flex items-center gap-2">
                  <Plus className="w-6 h-6" />
                  Create New Device
                </h3>
                <button 
                  onClick={() => setShowCreateForm(false)}
                  className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-stone-400" />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Basic Info */}
                <div className="space-y-4">
                  <h4 className="text-sm font-semibold text-stone-400 uppercase tracking-wider flex items-center gap-2">
                    <Server className="w-4 h-4" />
                    Basic Information
                  </h4>
                  
                  <input
                    type="text"
                    name="deviceId"
                    placeholder="Device ID (auto-generated if empty)"
                    value={formData.deviceId}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:border-green-500 focus:outline-none transition-all"
                  />
                  
                  <input
                    type="text"
                    name="name"
                    placeholder="Device Name *"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:border-green-500 focus:outline-none transition-all"
                    required
                  />
                  
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                    <input
                      type="text"
                      name="location"
                      placeholder="Location *"
                      value={formData.location}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:border-green-500 focus:outline-none transition-all"
                      required
                    />
                  </div>
                  
                  <div className="relative">
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-white focus:border-green-500 focus:outline-none appearance-none cursor-pointer"
                    >
                      {DEVICE_TYPES.map((type) => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
                  </div>
                </div>

                {/* ThingSpeak Integration */}
                <div className="space-y-4">
                  <h4 className="text-sm font-semibold text-stone-400 uppercase tracking-wider flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    ThingSpeak Integration
                  </h4>
                  
                  <input
                    type="text"
                    name="channelId"
                    placeholder="ThingSpeak Channel ID"
                    value={formData.channelId}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none transition-all"
                  />
                  
                  <input
                    type="text"
                    name="readKey"
                    placeholder="Read API Key"
                    value={formData.readKey}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none transition-all"
                  />
                  
                  <input
                    type="text"
                    name="writeKey"
                    placeholder="Write API Key"
                    value={formData.writeKey}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none transition-all"
                  />

                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-yellow-400" />
                    <input
                      type="number"
                      name="ratedPower"
                      placeholder="Rated Power (W)"
                      value={formData.ratedPower}
                      onChange={handleInputChange}
                      className="flex-1 px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:border-yellow-500 focus:outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Advanced Settings */}
                <div className="space-y-4">
                  <h4 className="text-sm font-semibold text-stone-400 uppercase tracking-wider flex items-center gap-2">
                    <Settings className="w-4 h-4" />
                    Advanced Settings
                  </h4>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs text-stone-400">Tariff (₹/kWh)</label>
                      <input
                        type="number"
                        name="tariffRate"
                        step="0.50"
                        value={formData.tariffRate}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 bg-white border-2 border-amber-300 rounded-lg text-stone-800 text-sm focus:border-amber-500 focus:outline-none transition-all"
                        placeholder="6.50"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-stone-400">Emission Factor</label>
                      <input
                        type="number"
                        name="emissionFactor"
                        step="0.01"
                        value={formData.emissionFactor}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white text-sm focus:border-green-500 focus:outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-stone-400 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3 text-orange-400" />
                      Peak Demand Limit (W)
                    </label>
                    <input
                      type="number"
                      name="peakDemandLimit"
                      value={formData.peakDemandLimit}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white focus:border-orange-500 focus:outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-stone-400 flex items-center gap-1">
                      <Thermometer className="w-3 h-3 text-red-400" />
                      Temperature Warning (°C)
                    </label>
                    <input
                      type="number"
                      name="temperatureWarning"
                      value={formData.temperatureWarning}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white focus:border-red-500 focus:outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-3 mt-6 pt-4 border-t border-slate-700">
                <motion.button
                  onClick={handleCreate}
                  disabled={isSubmitting || !formData.name || !formData.location}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-500 hover:to-emerald-400 text-white font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isSubmitting ? (
                    <motion.div
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                  ) : (
                    <>
                      <Check className="w-5 h-5" />
                      Create Device
                    </>
                  )}
                </motion.button>
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Current Device Info Card */}
      {currentDeviceData && (
        <motion.div 
          className="panel p-4 rounded-xl border border-cyan-500/30 bg-gradient-to-r from-cyan-500/5 to-blue-500/5"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          key={currentDevice}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <div>
              <p className="text-xs uppercase text-stone-400 tracking-widest">Type</p>
              <p className="text-sm font-semibold text-cyan-300 mt-1">{currentDeviceData.type}</p>
            </div>
            <div>
              <p className="text-xs uppercase text-stone-400 tracking-widest">Location</p>
              <p className="text-sm font-semibold text-cyan-300 mt-1">{currentDeviceData.location}</p>
            </div>
            <div>
              <p className="text-xs uppercase text-stone-400 tracking-widest">Rated Power</p>
              <p className="text-sm font-semibold text-yellow-300 mt-1">{currentDeviceData.ratedPower || 100}W</p>
            </div>
            <div>
              <p className="text-xs uppercase text-stone-400 tracking-widest">Tariff</p>
              <p className="text-sm font-semibold text-purple-300 mt-1">₹{currentDeviceData.tariffRate || 6.50}/kWh</p>
            </div>
            <div>
              <p className="text-xs uppercase text-stone-400 tracking-widest">Status</p>
              <p className={`text-sm font-semibold mt-1 flex items-center gap-1 ${
                currentDeviceData.status === "active" ? "text-green-400" : "text-red-400"
              }`}>
                <span className={`w-2 h-2 rounded-full ${
                  currentDeviceData.status === "active" ? "bg-green-400" : "bg-red-400"
                }`} />
                {currentDeviceData.status || "Active"}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase text-stone-400 tracking-widest">Control</p>
              <p className={`text-sm font-semibold mt-1 ${
                currentDeviceData.controlState === "on" ? "text-green-400" : "text-stone-400"
              }`}>
                {currentDeviceData.controlState === "on" ? "⚡ ON" : "○ OFF"}
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default DeviceManager;
