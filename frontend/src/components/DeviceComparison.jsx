import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from "recharts";
import {
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Zap,
  Leaf,
  DollarSign,
  Gauge,
  Thermometer,
  TrendingUp,
  Activity,
  Award
} from "lucide-react";
import api from "../services/api";

const MetricCard = ({ label, valueA, valueB, unit, icon: Icon, better, difference, percentDiff }) => {
  const isABetter = better === "deviceA";
  const isBBetter = better === "deviceB";
  const diffColor = difference > 0 ? "text-red-400" : difference < 0 ? "text-green-400" : "text-stone-400";

  return (
    <motion.div
      className="panel p-4 rounded-xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
    >
      <div className="flex items-center gap-2 mb-3">
        {Icon && <Icon className="w-5 h-5 text-cyan-400" />}
        <h4 className="text-sm font-semibold text-stone-300">{label}</h4>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className={`p-3 rounded-lg ${isABetter ? "bg-green-500/10 border border-green-500/30" : "bg-slate-800/50"}`}>
          <p className="text-xs text-stone-400 mb-1">Device A</p>
          <p className={`text-lg font-bold ${isABetter ? "text-green-400" : "text-white"}`}>
            {typeof valueA === "number" ? valueA.toFixed(2) : valueA}
            <span className="text-sm text-stone-400 ml-1">{unit}</span>
          </p>
          {isABetter && <Award className="w-4 h-4 text-green-400 mt-1" />}
        </div>
        
        <div className={`p-3 rounded-lg ${isBBetter ? "bg-green-500/10 border border-green-500/30" : "bg-slate-800/50"}`}>
          <p className="text-xs text-stone-400 mb-1">Device B</p>
          <p className={`text-lg font-bold ${isBBetter ? "text-green-400" : "text-white"}`}>
            {typeof valueB === "number" ? valueB.toFixed(2) : valueB}
            <span className="text-sm text-stone-400 ml-1">{unit}</span>
          </p>
          {isBBetter && <Award className="w-4 h-4 text-green-400 mt-1" />}
        </div>
      </div>
      
      {difference !== undefined && (
        <div className={`mt-3 pt-3 border-t border-slate-700 flex items-center justify-between`}>
          <span className="text-xs text-stone-400">Difference</span>
          <span className={`flex items-center gap-1 text-sm font-semibold ${diffColor}`}>
            {difference > 0 ? <ArrowUpRight className="w-4 h-4" /> : 
             difference < 0 ? <ArrowDownRight className="w-4 h-4" /> : 
             <Minus className="w-4 h-4" />}
            {Math.abs(difference).toFixed(2)} {unit}
            {percentDiff !== undefined && (
              <span className="text-xs text-stone-400 ml-1">
                ({percentDiff > 0 ? "+" : ""}{percentDiff.toFixed(1)}%)
              </span>
            )}
          </span>
        </div>
      )}
    </motion.div>
  );
};

const DeviceComparison = ({ devices }) => {
  const [deviceA, setDeviceA] = useState(devices[0]?.deviceId || "");
  const [deviceB, setDeviceB] = useState(devices[1]?.deviceId || "");
  const [dateRange, setDateRange] = useState({ from: "", to: "" });
  const [comparison, setComparison] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchComparison = async () => {
    if (!deviceA || !deviceB || deviceA === deviceB) return;

    setLoading(true);
    try {
      const { data } = await api.post("/api/comparison/devices", {
        deviceAId: deviceA,
        deviceBId: deviceB,
        from: dateRange.from || undefined,
        to: dateRange.to || undefined
      });
      setComparison(data);
    } catch (error) {
      console.error("Comparison failed:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (deviceA && deviceB && deviceA !== deviceB) {
      fetchComparison();
    }
  }, [deviceA, deviceB]);

  const barChartData = comparison ? [
    {
      name: "Power (W)",
      "Device A": comparison.deviceA.stats.avgPower,
      "Device B": comparison.deviceB.stats.avgPower
    },
    {
      name: "Energy (kWh)",
      "Device A": comparison.deviceA.energyCost.totalEnergy * 100,
      "Device B": comparison.deviceB.energyCost.totalEnergy * 100
    },
    {
      name: "Cost (₹×100)",
      "Device A": comparison.deviceA.energyCost.totalCost * 100,
      "Device B": comparison.deviceB.energyCost.totalCost * 100
    },
    {
      name: "CO₂ (kg×10)",
      "Device A": comparison.deviceA.environmental.co2Emissions * 10,
      "Device B": comparison.deviceB.environmental.co2Emissions * 10
    }
  ] : [];

  const radarData = comparison ? [
    {
      metric: "Efficiency",
      "Device A": comparison.deviceA.powerMetrics.efficiency,
      "Device B": comparison.deviceB.powerMetrics.efficiency,
      fullMark: 100
    },
    {
      metric: "Power Factor",
      "Device A": comparison.deviceA.powerMetrics.powerFactor * 100,
      "Device B": comparison.deviceB.powerMetrics.powerFactor * 100,
      fullMark: 100
    },
    {
      metric: "Load Factor",
      "Device A": comparison.deviceA.powerMetrics.loadFactor,
      "Device B": comparison.deviceB.powerMetrics.loadFactor,
      fullMark: 100
    },
    {
      metric: "Power Quality",
      "Device A": comparison.deviceA.powerMetrics.powerQualityIndex * 100,
      "Device B": comparison.deviceB.powerMetrics.powerQualityIndex * 100,
      fullMark: 100
    },
    {
      metric: "Sustainability",
      "Device A": comparison.deviceA.environmental.sustainabilityScore,
      "Device B": comparison.deviceB.environmental.sustainabilityScore,
      fullMark: 100
    }
  ] : [];

  return (
    <div className="space-y-6">
      {/* Device Selection */}
      <motion.div
        className="panel p-6 rounded-2xl"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h3 className="text-lg font-bold text-cyan-300 mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5" />
          Multi-Device Comparison
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="text-xs text-stone-400 mb-1 block">Device A</label>
            <select
              value={deviceA}
              onChange={(e) => setDeviceA(e.target.value)}
              className="w-full px-4 py-3 bg-slate-900 border border-cyan-500/30 rounded-lg text-white focus:border-cyan-500 focus:outline-none"
            >
              <option value="">Select Device A</option>
              {devices.map((d) => (
                <option key={d.deviceId} value={d.deviceId} disabled={d.deviceId === deviceB}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="text-xs text-stone-400 mb-1 block">Device B</label>
            <select
              value={deviceB}
              onChange={(e) => setDeviceB(e.target.value)}
              className="w-full px-4 py-3 bg-slate-900 border border-blue-500/30 rounded-lg text-white focus:border-blue-500 focus:outline-none"
            >
              <option value="">Select Device B</option>
              {devices.map((d) => (
                <option key={d.deviceId} value={d.deviceId} disabled={d.deviceId === deviceA}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="text-xs text-stone-400 mb-1 block">From Date</label>
            <input
              type="date"
              value={dateRange.from}
              onChange={(e) => setDateRange(prev => ({ ...prev, from: e.target.value }))}
              className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white focus:border-cyan-500 focus:outline-none"
            />
          </div>
          
          <div>
            <label className="text-xs text-stone-400 mb-1 block">To Date</label>
            <input
              type="date"
              value={dateRange.to}
              onChange={(e) => setDateRange(prev => ({ ...prev, to: e.target.value }))}
              className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white focus:border-cyan-500 focus:outline-none"
            />
          </div>
        </div>

        <motion.button
          onClick={fetchComparison}
          disabled={!deviceA || !deviceB || deviceA === deviceB || loading}
          className="mt-4 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold rounded-lg disabled:opacity-50 flex items-center gap-2"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {loading ? (
            <motion.div
              className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
          ) : (
            <>
              <TrendingUp className="w-5 h-5" />
              Compare Devices
            </>
          )}
        </motion.button>
      </motion.div>

      {/* Comparison Results */}
      {comparison && (
        <>
          {/* Device Labels */}
          <div className="grid grid-cols-2 gap-4">
            <motion.div
              className="panel p-4 rounded-xl border-l-4 border-cyan-500"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center">
                  <span className="text-cyan-400 font-bold">A</span>
                </div>
                <div>
                  <h4 className="font-bold text-cyan-300">
                    {devices.find(d => d.deviceId === deviceA)?.name || deviceA}
                  </h4>
                  <p className="text-xs text-stone-400">
                    {comparison.deviceA.dataPoints} data points
                  </p>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              className="panel p-4 rounded-xl border-l-4 border-blue-500"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <span className="text-blue-400 font-bold">B</span>
                </div>
                <div>
                  <h4 className="font-bold text-blue-300">
                    {devices.find(d => d.deviceId === deviceB)?.name || deviceB}
                  </h4>
                  <p className="text-xs text-stone-400">
                    {comparison.deviceB.dataPoints} data points
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Metric Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard
              label="Average Power"
              valueA={comparison.deviceA.stats.avgPower}
              valueB={comparison.deviceB.stats.avgPower}
              unit="W"
              icon={Zap}
              better={comparison.comparison.power.moreEfficient}
              difference={comparison.comparison.power.difference}
              percentDiff={comparison.comparison.power.percentDifference}
            />
            <MetricCard
              label="Total Energy"
              valueA={comparison.deviceA.energyCost.totalEnergy}
              valueB={comparison.deviceB.energyCost.totalEnergy}
              unit="kWh"
              icon={Activity}
              difference={comparison.comparison.energy.difference}
              percentDiff={comparison.comparison.energy.percentDifference}
            />
            <MetricCard
              label="Total Cost"
              valueA={comparison.deviceA.energyCost.totalCost}
              valueB={comparison.deviceB.energyCost.totalCost}
              unit="₹"
              icon={DollarSign}
              better={comparison.comparison.cost.cheaper}
              difference={comparison.comparison.cost.difference}
              percentDiff={comparison.comparison.cost.percentDifference}
            />
            <MetricCard
              label="CO₂ Emissions"
              valueA={comparison.deviceA.environmental.co2Emissions}
              valueB={comparison.deviceB.environmental.co2Emissions}
              unit="kg"
              icon={Leaf}
              better={comparison.comparison.carbon.greener}
              difference={comparison.comparison.carbon.difference}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard
              label="Power Factor"
              valueA={comparison.deviceA.powerMetrics.powerFactor}
              valueB={comparison.deviceB.powerMetrics.powerFactor}
              unit=""
              icon={Gauge}
              better={comparison.comparison.powerFactor.better}
              difference={comparison.comparison.powerFactor.difference}
            />
            <MetricCard
              label="Efficiency"
              valueA={comparison.deviceA.powerMetrics.efficiency}
              valueB={comparison.deviceB.powerMetrics.efficiency}
              unit="%"
              icon={TrendingUp}
              better={comparison.comparison.efficiency.better}
              difference={comparison.comparison.efficiency.difference}
            />
            <MetricCard
              label="Load Factor"
              valueA={comparison.deviceA.powerMetrics.loadFactor}
              valueB={comparison.deviceB.powerMetrics.loadFactor}
              unit="%"
              difference={comparison.comparison.loadFactor.difference}
            />
            <MetricCard
              label="Peak Power"
              valueA={comparison.deviceA.powerMetrics.peakPower}
              valueB={comparison.deviceB.powerMetrics.peakPower}
              unit="W"
              icon={Thermometer}
              difference={comparison.comparison.peakLoad.difference}
            />
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Bar Chart */}
            <motion.div
              className="panel p-6 rounded-2xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h4 className="text-sm font-semibold text-stone-400 uppercase tracking-wider mb-4">
                Side-by-Side Comparison
              </h4>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={barChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                  <YAxis stroke="#94a3b8" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1e293b",
                      border: "1px solid #334155",
                      borderRadius: "8px"
                    }}
                  />
                  <Legend />
                  <Bar dataKey="Device A" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Device B" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Radar Chart */}
            <motion.div
              className="panel p-6 rounded-2xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h4 className="text-sm font-semibold text-stone-400 uppercase tracking-wider mb-4">
                Performance Radar
              </h4>
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#334155" />
                  <PolarAngleAxis dataKey="metric" stroke="#94a3b8" fontSize={11} />
                  <PolarRadiusAxis stroke="#334155" fontSize={10} />
                  <Radar
                    name="Device A"
                    dataKey="Device A"
                    stroke="#06b6d4"
                    fill="#06b6d4"
                    fillOpacity={0.3}
                  />
                  <Radar
                    name="Device B"
                    dataKey="Device B"
                    stroke="#3b82f6"
                    fill="#3b82f6"
                    fillOpacity={0.3}
                  />
                  <Legend />
                </RadarChart>
              </ResponsiveContainer>
            </motion.div>
          </div>

          {/* Summary */}
          <motion.div
            className="panel p-6 rounded-2xl bg-gradient-to-r from-emerald-500/10 to-green-500/5 border border-emerald-500/30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <h4 className="text-lg font-bold text-emerald-300 mb-4 flex items-center gap-2">
              <Award className="w-5 h-5" />
              Analysis Summary
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-slate-900/50 rounded-lg">
                <p className="text-sm text-stone-400 mb-2">Most Efficient</p>
                <p className="text-xl font-bold text-emerald-400">
                  {devices.find(d => d.deviceId === (comparison.comparison.efficiency.better === "deviceA" ? deviceA : deviceB))?.name}
                </p>
              </div>
              <div className="p-4 bg-slate-900/50 rounded-lg">
                <p className="text-sm text-stone-400 mb-2">Most Cost Effective</p>
                <p className="text-xl font-bold text-emerald-400">
                  {devices.find(d => d.deviceId === (comparison.comparison.cost.cheaper === "deviceA" ? deviceA : deviceB))?.name}
                </p>
              </div>
              <div className="p-4 bg-slate-900/50 rounded-lg">
                <p className="text-sm text-stone-400 mb-2">Greenest Choice</p>
                <p className="text-xl font-bold text-emerald-400">
                  {devices.find(d => d.deviceId === (comparison.comparison.carbon.greener === "deviceA" ? deviceA : deviceB))?.name}
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}

      {/* No comparison yet */}
      {!comparison && !loading && (
        <motion.div
          className="panel p-12 rounded-2xl text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <Activity className="w-16 h-16 text-stone-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-stone-400 mb-2">Select Devices to Compare</h3>
          <p className="text-stone-400">
            Choose two different devices and click "Compare Devices" to see detailed analytics
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default DeviceComparison;
