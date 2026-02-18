import React, { useEffect, useState } from "react";
import KPICards from "../components/KPICards";
import StatusBadge from "../components/StatusBadge";
import GaugeChart from "../charts/GaugeChart";
import LineChartCard from "../charts/LineChartCard";
import UsageBarChart from "../charts/UsageBarChart";
import Filters from "../components/Filters";
import DeviceManager from "../components/DeviceManager";
import AdvancedAnalytics from "../components/AdvancedAnalytics";
import { fetchLatest, fetchSeries, fetchPrediction, fetchAdvancedAnalytics } from "../services/data";
import { fetchDevices, createDevice } from "../services/device";
import { formatNumber, toChartSeries } from "../utils/format";

const Dashboard = () => {
  const [devices, setDevices] = useState([]);
  const [filters, setFilters] = useState({ deviceId: "", from: "", to: "" });
  const [latest, setLatest] = useState(null);
  const [summary, setSummary] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [advancedMetrics, setAdvancedMetrics] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      try {
        const list = await fetchDevices();
        setDevices(list);
        if (list.length) {
          setFilters((prev) => ({ ...prev, deviceId: list[0].deviceId }));
        }
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  useEffect(() => {
    if (!filters.deviceId) return;

    const load = async () => {
      setLoading(true);
      try {
        const [latestData, summaryData, predictionData, advancedData] = await Promise.all([
          fetchLatest(filters.deviceId),
          fetchSeries(filters.deviceId, filters.from, filters.to),
          fetchPrediction(filters.deviceId),
          fetchAdvancedAnalytics(filters.deviceId, filters.from, filters.to)
        ]);

        setLatest(latestData);
        setSummary(summaryData);
        setPrediction(predictionData);
        setAdvancedMetrics(advancedData);
      } finally {
        setLoading(false);
      }
    };

    load();
    const interval = setInterval(load, 5000);
    return () => clearInterval(interval);
  }, [filters]);

  const handleCreateDevice = async (deviceData) => {
    try {
      const newDevice = await createDevice(deviceData);
      const updatedDevices = await fetchDevices();
      setDevices(updatedDevices);
      setFilters((prev) => ({ ...prev, deviceId: newDevice.deviceId }));
    } catch (error) {
      console.error("Failed to create device:", error);
      throw error;
    }
  };

  const stats = summary?.stats || {};
  const kpis = [
    {
      label: "Total Energy",
      value: formatNumber(stats.totalEnergy, " kWh"),
      caption: "Daily Accumulation",
      tone: "text-cyan-300"
    },
    {
      label: "Peak Power",
      value: formatNumber(stats.maxPower, " W"),
      caption: "Peak Load",
      tone: "text-orange-300"
    },
    {
      label: "Average Load",
      value: formatNumber(stats.avgPower, " W"),
      caption: "Stability",
      tone: "text-emerald-300"
    },
    {
      label: "Cost Estimate",
      value: formatNumber(stats.totalEnergy * 0.18, " USD"),
      caption: "At 0.18/kWh",
      tone: "text-purple-300"
    }
  ];

  const series = toChartSeries(summary?.series, "totalEnergy");
  const tempSeries = toChartSeries(summary?.series, "avgTemperature");
  const powerSeries = (summary?.series || []).map((item) => ({
    label: item._id,
    value: Number(item.avgPower || 0)
  }));

  const status = latest?.power > (stats.maxPower || 0) ? "danger" : "ok";

  return (
    <div className="flex flex-col gap-6 pb-8">
      {/* Device Manager */}
      <DeviceManager
        devices={devices}
        currentDevice={filters.deviceId}
        onDeviceSelect={(deviceId) =>
          setFilters((prev) => ({ ...prev, deviceId }))
        }
        onCreateDevice={handleCreateDevice}
      />

      <Filters value={filters} onChange={setFilters} devices={devices} />

      {/* Live Status */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Live Status</p>
          <h3 className="text-2xl md:text-3xl text-white font-bold mt-1">
            {devices.find((d) => d.deviceId === filters.deviceId)?.name || filters.deviceId}
          </h3>
          <p className="text-sm text-slate-400 mt-1">
            {devices.find((d) => d.deviceId === filters.deviceId)?.location}
          </p>
        </div>
        <StatusBadge status={status} />
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {[
          { id: "overview", label: "Overview", icon: "📊" },
          { id: "advanced", label: "Advanced Analytics", icon: "🔬" },
          { id: "comparison", label: "Comparison", icon: "⚖️" }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition-all text-sm md:text-base ${
              activeTab === tab.id
                ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg glow-cyan"
                : "panel hover:border-cyan-500 text-slate-300 hover:text-cyan-300"
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          <KPICards items={kpis} />

          {/* Gauges */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <GaugeChart value={latest?.voltage || 0} max={480} label="Voltage" unit="V" color="cyan" />
            <GaugeChart value={latest?.current || 0} max={200} label="Current" unit="A" color="blue" />
            <GaugeChart value={latest?.power || 0} max={5000} label="Power" unit="W" color="orange" />
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <LineChartCard
              title="Power Consumption Trend"
              data={powerSeries}
              dataKey="value"
              stroke="#0ea5e9"
              showGradient
            />
            <LineChartCard
              title="Temperature Trend"
              data={tempSeries}
              dataKey="value"
              stroke="#f97316"
              showGradient
            />
          </div>

          {/* Summary Analytics */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="panel-cyan panel p-6 rounded-2xl">
              <p className="text-xs uppercase tracking-[0.35em] text-cyan-400 mb-4">Basic Analytics</p>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-400">Efficiency</span>
                  <span className="text-lg font-bold text-cyan-300">
                    {summary?.efficiency || 0}%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-400">Carbon Footprint</span>
                  <span className="text-lg font-bold text-emerald-300">
                    {formatNumber(summary?.carbonEstimate, " kg CO₂")}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-400">Forecast (1h)</span>
                  <span className="text-lg font-bold text-amber-300">
                    {formatNumber(prediction?.predictedPower, " W")}
                  </span>
                </div>
              </div>
            </div>

            <UsageBarChart data={series} />

            <div className="panel-purple panel p-6 rounded-2xl">
              <p className="text-xs uppercase tracking-[0.35em] text-purple-400 mb-4">Quick Info</p>
              <ul className="text-sm text-slate-300 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-purple-400 mt-1">•</span>
                  <span>Peak detection active</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400 mt-1">•</span>
                  <span>Temp: {Math.round(stats.avgTemp || 0)}°C avg</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400 mt-1">•</span>
                  <span>Status: {status === "danger" ? "⚠️ High Load" : "✓ Normal"}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Advanced Analytics Tab */}
      {activeTab === "advanced" && (
        <div>
          {advancedMetrics ? (
            <AdvancedAnalytics data={advancedMetrics} />
          ) : (
            <div className="panel p-8 rounded-2xl text-center text-slate-400">
              {loading ? "Loading advanced analytics..." : "No advanced metrics available"}
            </div>
          )}
        </div>
      )}

      {/* Comparison Tab */}
      {activeTab === "comparison" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {devices.slice(0, 2).map((device) => (
            <div key={device.deviceId} className="panel p-6 rounded-2xl border-l-4 border-cyan-500">
              <h4 className="text-lg font-bold text-cyan-300 mb-4">{device.name}</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-slate-400">Location:</span>
                  <span className="text-sm text-slate-200">{device.location}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-400">Type:</span>
                  <span className="text-sm text-slate-200">{device.type || "Smart Device"}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}    </div>
  );
};

export default Dashboard;