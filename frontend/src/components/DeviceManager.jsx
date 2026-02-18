import React, { useState } from "react";

const DeviceManager = ({ devices, currentDevice, onDeviceSelect, onCreateDevice }) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    deviceId: "",
    name: "",
    location: "",
    type: "LED Bulb"
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCreate = async () => {
    if (!formData.deviceId || !formData.name || !formData.location) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      await onCreateDevice(formData);
      setFormData({ deviceId: "", name: "", location: "", type: "LED Bulb" });
      setShowCreateForm(false);
    } catch (error) {
      console.error("Failed to create device:", error);
      alert("Failed to create device");
    }
  };

  return (
    <div className="space-y-4">
      {/* Device Tabs */}
      <div className="flex flex-wrap gap-2 justify-between items-center">
        <div className="flex flex-wrap gap-2">
          {devices.map((device) => (
            <button
              key={device.deviceId}
              onClick={() => onDeviceSelect(device.deviceId)}
              className={`px-4 py-2 rounded-lg font-semibold transition-all text-sm md:text-base ${
                currentDevice === device.deviceId
                  ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg glow-cyan"
                  : "panel hover:border-cyan-500 text-slate-300 hover:text-cyan-300"
              }`}
            >
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-current"></span>
                {device.name}
              </span>
            </button>
          ))}
        </div>

        {/* Create Device Button */}
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="px-3 py-2 md:px-4 md:py-2 bg-gradient-to-r from-green-600 to-emerald-500 text-white rounded-lg font-semibold hover:shadow-lg glow-green transition-all text-sm md:text-base"
        >
          + Add Device
        </button>
      </div>

      {/* Create Device Form */}
      {showCreateForm && (
        <div className="panel panel-green p-6 rounded-2xl space-y-4">
          <h3 className="text-lg font-bold text-green-300">Create New Device</h3>
          
          <div className="space-y-3">
            <input
              type="text"
              name="deviceId"
              placeholder="Device ID (e.g., esp32-003)"
              value={formData.deviceId}
              onChange={handleInputChange}
              className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:border-green-500 focus:outline-none"
            />
            
            <input
              type="text"
              name="name"
              placeholder="Device Name (e.g., Smart Bulb #3)"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:border-green-500 focus:outline-none"
            />
            
            <input
              type="text"
              name="location"
              placeholder="Location (e.g., Kitchen)"
              value={formData.location}
              onChange={handleInputChange}
              className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:border-green-500 focus:outline-none"
            />
            
            <select
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:border-green-500 focus:outline-none"
            >
              <option>LED Bulb</option>
              <option>Smart Plug</option>
              <option>Refrigerator</option>
              <option>Air Conditioner</option>
              <option>Water Heater</option>
              <option>Other</option>
            </select>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleCreate}
              className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-all"
            >
              Create
            </button>
            <button
              onClick={() => setShowCreateForm(false)}
              className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Device Info Card */}
      {devices.find((d) => d.deviceId === currentDevice) && (
        <div className="panel p-4 rounded-xl border border-cyan-500/30 bg-cyan-500/5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(
              devices.find((d) => d.deviceId === currentDevice) || {}
            )
              .filter(([key]) => !["deviceId", "thresholds", "secretKey"].includes(key))
              .map(([key, value]) => (
                <div key={key}>
                  <p className="text-xs uppercase text-slate-500 tracking-widest">{key}</p>
                  <p className="text-sm font-semibold text-cyan-300 mt-1">{value}</p>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DeviceManager;
