import React from "react";
import { motion } from "framer-motion";
import {
  Leaf,
  TreePine,
  Car,
  Factory,
  Award,
  TrendingDown,
  Globe,
  Droplets
} from "lucide-react";

const EnvironmentalImpact = ({ data, totalEnergy = 0, emissionFactor = 0.82 }) => {
  // Calculate environmental metrics
  const co2Emissions = data?.co2Emissions || (totalEnergy * emissionFactor);
  const treesRequired = data?.treesRequired || Math.ceil(co2Emissions / 21);
  const carKmEquivalent = data?.carKmEquivalent || (co2Emissions / 0.12);
  const sustainabilityScore = data?.sustainabilityScore || Math.max(0, 100 - (emissionFactor * 100));
  const greenEnergyBadge = data?.greenEnergyBadge || 
    (sustainabilityScore > 80 ? "gold" : sustainabilityScore > 60 ? "silver" : "bronze");

  const badgeColors = {
    gold: { bg: "from-yellow-500/20 to-amber-500/10", border: "border-yellow-500/50", text: "text-yellow-400" },
    silver: { bg: "from-slate-400/20 to-gray-500/10", border: "border-slate-400/50", text: "text-stone-300" },
    bronze: { bg: "from-orange-700/20 to-amber-700/10", border: "border-orange-600/50", text: "text-orange-400" }
  };

  const badge = badgeColors[greenEnergyBadge] || badgeColors.bronze;

  return (
    <motion.div
      className="space-y-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-emerald-300 flex items-center gap-2">
          <Globe className="w-5 h-5" />
          Environmental Impact
        </h3>
        
        {/* Green Energy Badge */}
        <motion.div
          className={`px-4 py-2 rounded-full bg-gradient-to-r ${badge.bg} border ${badge.border}`}
          whileHover={{ scale: 1.05 }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <span className={`flex items-center gap-2 ${badge.text} font-bold`}>
            <Award className="w-4 h-4" />
            {greenEnergyBadge.toUpperCase()} Badge
          </span>
        </motion.div>
      </div>

      {/* Main Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* CO2 Emissions */}
        <motion.div
          className="panel p-6 rounded-2xl bg-gradient-to-br from-red-500/10 to-orange-500/5 border border-red-500/20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-stone-400 uppercase tracking-wider mb-1">Total CO₂ Emitted</p>
              <motion.p
                className="text-3xl font-bold text-red-400"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {co2Emissions.toFixed(2)}
              </motion.p>
              <p className="text-sm text-stone-400">kg CO₂</p>
            </div>
            <div className="p-3 rounded-lg bg-red-500/20">
              <Factory className="w-6 h-6 text-red-400" />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-700/50">
            <p className="text-xs text-stone-400">
              Emission Factor: {emissionFactor} kg/kWh
            </p>
          </div>
        </motion.div>

        {/* Trees Required */}
        <motion.div
          className="panel p-6 rounded-2xl bg-gradient-to-br from-green-500/10 to-emerald-500/5 border border-green-500/20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-stone-400 uppercase tracking-wider mb-1">Trees to Offset</p>
              <motion.p
                className="text-3xl font-bold text-green-400"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {treesRequired}
              </motion.p>
              <p className="text-sm text-stone-400">trees/year</p>
            </div>
            <div className="p-3 rounded-lg bg-green-500/20">
              <TreePine className="w-6 h-6 text-green-400" />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-700/50">
            <p className="text-xs text-stone-400">
              1 tree absorbs ~21 kg CO₂/year
            </p>
          </div>
        </motion.div>

        {/* Car Km Equivalent */}
        <motion.div
          className="panel p-6 rounded-2xl bg-gradient-to-br from-blue-500/10 to-cyan-500/5 border border-blue-500/20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-stone-400 uppercase tracking-wider mb-1">Equivalent Car Travel</p>
              <motion.p
                className="text-3xl font-bold text-blue-400"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {carKmEquivalent.toFixed(1)}
              </motion.p>
              <p className="text-sm text-stone-400">km driven</p>
            </div>
            <div className="p-3 rounded-lg bg-blue-500/20">
              <Car className="w-6 h-6 text-blue-400" />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-700/50">
            <p className="text-xs text-stone-400">
              Avg car: 0.12 kg CO₂/km
            </p>
          </div>
        </motion.div>

        {/* Sustainability Score */}
        <motion.div
          className="panel p-6 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-teal-500/5 border border-emerald-500/20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-stone-400 uppercase tracking-wider mb-1">Sustainability Score</p>
              <motion.p
                className="text-3xl font-bold text-emerald-400"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {sustainabilityScore.toFixed(0)}
              </motion.p>
              <p className="text-sm text-stone-400">/ 100</p>
            </div>
            <div className="p-3 rounded-lg bg-emerald-500/20">
              <Leaf className="w-6 h-6 text-emerald-400" />
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4">
            <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-emerald-500 to-green-400 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${sustainabilityScore}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Improvement Tips */}
      <motion.div
        className="panel p-6 rounded-2xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <h4 className="text-sm font-semibold text-stone-400 uppercase tracking-wider mb-4 flex items-center gap-2">
          <TrendingDown className="w-4 h-4 text-green-400" />
          Reduce Your Carbon Footprint
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700/50">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center">
                <Droplets className="w-4 h-4 text-cyan-400" />
              </div>
              <p className="font-semibold text-cyan-300">Off-Peak Usage</p>
            </div>
            <p className="text-sm text-stone-400">
              Shift energy-intensive tasks to off-peak hours (9PM-9AM) to reduce grid stress and costs.
            </p>
          </div>
          
          <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700/50">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                <Leaf className="w-4 h-4 text-green-400" />
              </div>
              <p className="font-semibold text-green-300">Renewable Sources</p>
            </div>
            <p className="text-sm text-stone-400">
              Consider solar panels or green energy plans to reduce your emission factor below 0.1 kg/kWh.
            </p>
          </div>
          
          <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700/50">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center">
                <Factory className="w-4 h-4 text-purple-400" />
              </div>
              <p className="font-semibold text-purple-300">Equipment Upgrade</p>
            </div>
            <p className="text-sm text-stone-400">
              Replace inefficient devices with high-efficiency models (class A+++) to reduce consumption by 40%.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Monthly Summary */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <div className="panel p-6 rounded-2xl border border-emerald-500/20">
          <h4 className="text-sm font-semibold text-emerald-400 uppercase tracking-wider mb-4">
            Monthly Projection
          </h4>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-stone-400">Projected CO₂</span>
              <span className="text-lg font-bold text-slate-200">{(co2Emissions * 30).toFixed(1)} kg</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-stone-400">Trees Needed</span>
              <span className="text-lg font-bold text-green-400">{Math.ceil(treesRequired * 30 / 12)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-stone-400">Car Equivalent</span>
              <span className="text-lg font-bold text-blue-400">{(carKmEquivalent * 30).toFixed(0)} km</span>
            </div>
          </div>
        </div>
        
        <div className="panel p-6 rounded-2xl border border-cyan-500/20">
          <h4 className="text-sm font-semibold text-cyan-400 uppercase tracking-wider mb-4">
            Regional Comparison
          </h4>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-stone-400">Coal Grid (1.0 kg/kWh)</span>
              <span className="text-lg font-bold text-red-400">{(totalEnergy * 1.0).toFixed(1)} kg</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-stone-400">US Average (0.41 kg/kWh)</span>
              <span className="text-lg font-bold text-yellow-400">{(totalEnergy * 0.41).toFixed(1)} kg</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-stone-400">Renewable (0.05 kg/kWh)</span>
              <span className="text-lg font-bold text-green-400">{(totalEnergy * 0.05).toFixed(1)} kg</span>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default EnvironmentalImpact;
