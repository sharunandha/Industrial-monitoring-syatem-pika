import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LayoutDashboard, 
  BarChart3, 
  GitCompare, 
  Leaf, 
  Settings,
  Gauge,
  Activity,
  Zap,
  Bell
} from "lucide-react";
import KPICards from "../components/KPICards";
import StatusBadge from "../components/StatusBadge";
import GaugeChart from "../charts/GaugeChart";
import LineChartCard from "../charts/LineChartCard";
import UsageBarChart from "../charts/UsageBarChart";
import Filters from "../components/Filters";
import DeviceManager from "../components/DeviceManager";
import AdvancedAnalytics from "../components/AdvancedAnalytics";
import DeviceComparison from "../components/DeviceComparison";
import EnvironmentalImpact from "../components/EnvironmentalImpact";
import DeviceControlPanel from "../components/DeviceControlPanel";
import { SkeletonCard, SkeletonChart, SkeletonGauge } from "../components/AnimatedLoaders";
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
  const [alertCount, setAlertCount] = useState(0);

  const tabs = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "advanced", label: "Analytics", icon: BarChart3 },
    { id: "control", label: "Control Panel", icon: Settings },
    { id: "comparison", label: "Comparison", icon: GitCompare },
    { id: "environmental", label: "Environmental", icon: Leaf }
  ];

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      try {
        const list = await fetchDevices();
        setDevices(list);
        if (list.length) {
          setFilters((prev) => ({ ...prev, deviceId: list[0].deviceId }));
        }
      } catch (err) {
        console.error('Error fetching devices:', err);
        // 401 errors are handled by api interceptor
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

        console.log("Dashboard data loaded:", { latestData, summaryData, predictionData, advancedData });
        
        setLatest(latestData);
        setSummary(summaryData);
        setPrediction(predictionData);
        setAdvancedMetrics(advancedData);
        
        // Check for alerts
        if (latestData?.power > 4000 || latestData?.temperature > 50) {
          setAlertCount(prev => prev + 1);
        }
      } catch (err) {
        console.error("Dashboard load error:", err);
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
      value: formatNumber(stats.totalEnergy * 6.50, " INR"),
      caption: "Tamil Nadu @ ₹6.50/kWh",
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
          <p className="text-xs uppercase tracking-[0.35em] text-stone-400">Live Status</p>
          <h3 className="text-2xl md:text-3xl text-white font-bold mt-1">
            {devices.find((d) => d.deviceId === filters.deviceId)?.name || filters.deviceId}
          </h3>
          <p className="text-sm text-stone-400 mt-1">
            {devices.find((d) => d.deviceId === filters.deviceId)?.location}
          </p>
        </div>
        <StatusBadge status={status} />
      </div>

      {/* Tab Navigation */}
      <motion.div 
        className="flex gap-2 overflow-x-auto pb-2"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {[
          { id: "overview", label: "Overview", Icon: LayoutDashboard },
          { id: "advanced", label: "Analytics", Icon: BarChart3 },
          { id: "control", label: "Control Panel", Icon: Settings },
          { id: "comparison", label: "Comparison", Icon: GitCompare },
          { id: "environmental", label: "Environmental", Icon: Leaf }
        ].map((tab) => (
          <motion.button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition-all text-sm md:text-base flex items-center gap-2 ${
              activeTab === tab.id
                ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg glow-cyan"
                : "panel hover:border-cyan-500 text-stone-300 hover:text-cyan-300"
            }`}
          >
            <tab.Icon size={18} />
            {tab.label}
            {tab.id === "control" && alertCount > 0 && (
              <span className="ml-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full animate-pulse">
                {alertCount}
              </span>
            )}
          </motion.button>
        ))}
      </motion.div>

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
                  <span className="text-sm text-stone-400">Efficiency</span>
                  <span className="text-lg font-bold text-cyan-300">
                    {summary?.efficiency || 0}%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-stone-400">Carbon Footprint</span>
                  <span className="text-lg font-bold text-emerald-300">
                    {formatNumber(summary?.carbonEstimate, " kg CO₂")}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-stone-400">Forecast (1h)</span>
                  <span className="text-lg font-bold text-amber-300">
                    {formatNumber(prediction?.predictedPower, " W")}
                  </span>
                </div>
              </div>
            </div>

            <UsageBarChart data={series} />

            <div className="panel-purple panel p-6 rounded-2xl">
              <p className="text-xs uppercase tracking-[0.35em] text-purple-400 mb-4">Quick Info</p>
              <ul className="text-sm text-stone-300 space-y-2">
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
          <div className="mb-4 p-4 panel rounded-xl">
            <p className="text-amber-300 font-bold">⚡ Analytics Tab Active</p>
            <p className="text-stone-400 text-sm">
              Data status: {advancedMetrics ? `Loaded (${Object.keys(advancedMetrics).length} keys)` : "Not loaded"}
            </p>
          </div>
          {advancedMetrics && Object.keys(advancedMetrics).length > 0 ? (
            <AdvancedAnalytics data={advancedMetrics} />
          ) : (
            <div className="panel p-8 rounded-2xl text-center text-stone-400">
              {loading ? "Loading advanced analytics..." : "No advanced metrics available. Ensure device is sending data."}
            </div>
          )}
        </div>
      )}

      {/* Control Panel Tab */}
      {activeTab === "control" && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <DeviceControlPanel devices={devices} />
        </motion.div>
      )}

      {/* Comparison Tab */}
      {activeTab === "comparison" && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <DeviceComparison devices={devices} />
        </motion.div>
      )}

      {/* Environmental Impact Tab */}
      {activeTab === "environmental" && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <EnvironmentalImpact
            totalEnergy={summary?.stats?.totalEnergy || 0}
            data={{
              co2Emissions: summary?.carbonEstimate || 0,
              treesRequired: Math.ceil((summary?.carbonEstimate || 0) / 21),
              carKmEquivalent: (summary?.carbonEstimate || 0) / 0.12,
              sustainabilityScore: advancedMetrics?.powerQualityIndex ? advancedMetrics.powerQualityIndex * 100 : 50
            }}
            devices={devices}
          />
        </motion.div>
      )}
    </div>
  );
};

export default Dashboard;
