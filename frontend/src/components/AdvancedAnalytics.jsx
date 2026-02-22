import React from "react";

const AdvancedAnalytics = ({ data = {} }) => {
  const metrics = [
    {
      label: "Power Factor",
      value: (data.powerFactor || 0).toFixed(3),
      unit: "",
      color: "cyan",
      description: "Ratio of real to apparent power (ideal: 1.0)"
    },
    {
      label: "Load Factor",
      value: (data.loadFactor || 0).toFixed(1),
      unit: "%",
      color: "blue",
      description: "Avg power / Peak power ratio"
    },
    {
      label: "Reactive Power",
      value: (data.reactivePower || 0).toFixed(0),
      unit: "VAR",
      color: "purple",
      description: "Non-productive power"
    },
    {
      label: "Apparent Power",
      value: (data.apparentPower || 0).toFixed(0),
      unit: "VA",
      color: "orange",
      description: "Total power (real + reactive)"
    },
    {
      label: "Harmonic Distortion",
      value: (data.harmonicDistortion || 0).toFixed(1),
      unit: "%",
      color: "red",
      description: "Power quality indicator (lower is better)"
    },
    {
      label: "Power Quality Index",
      value: (data.powerQualityIndex || 0).toFixed(3),
      unit: "",
      color: "green",
      description: "Overall quality score (0-1)"
    }
  ];

  const colorClasses = {
    cyan: "border-amber-500 text-amber-300",
    blue: "border-blue-400 text-blue-300",
    purple: "border-purple-400 text-purple-300",
    orange: "border-orange-400 text-orange-300",
    red: "border-red-400 text-red-300",
    green: "border-green-400 text-green-300"
  };

  const bgClasses = {
    cyan: "bg-amber-500/10",
    blue: "bg-blue-500/10",
    purple: "bg-purple-500/10",
    orange: "bg-orange-500/10",
    red: "bg-red-500/10",
    green: "bg-green-500/10"
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-2 h-8 bg-gradient-to-b from-amber-400 to-orange-500 rounded-full" />
        <h3 className="text-xl font-bold text-amber-300">⚡ Advanced Power Analytics</h3>
      </div>

      {/* Power Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {metrics.map((metric) => (
          <div key={metric.label} className={`panel ${bgClasses[metric.color]} p-4 rounded-2xl border-l-4 ${colorClasses[metric.color]}`}>
            <p className="text-xs uppercase tracking-widest text-amber-200 mb-2">{metric.label}</p>
            <div className="flex items-baseline justify-between mb-2">
              <span className="text-2xl font-bold text-amber-100">{metric.value}</span>
              <span className="text-sm text-stone-400">{metric.unit}</span>
            </div>
            <p className="text-xs text-stone-400">{metric.description}</p>
          </div>
        ))}
      </div>

      {/* Peak Load Analysis */}
      {data.peakLoadAnalysis && (
        <div className="panel panel-orange p-6 rounded-2xl">
          <h4 className="text-lg font-semibold text-orange-300 mb-4">Peak Load Analysis</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-stone-400">Peak Load</p>
              <p className="text-2xl font-bold text-orange-300 mt-1">
                {(data.peakLoadAnalysis.peakLoad / 1000).toFixed(2)} kW
              </p>
            </div>
            <div>
              <p className="text-sm text-stone-400">Peak Time</p>
              <p className="text-sm font-semibold text-orange-300 mt-1">
                {new Date(data.peakLoadAnalysis.peakTime).toLocaleTimeString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-stone-400">Demand Charge</p>
              <p className="text-2xl font-bold text-orange-300 mt-1">
                ₹{data.peakLoadAnalysis.demandCharge.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Consumption Trend */}
      {data.consumptionTrend && (
        <div className="panel panel-blue p-6 rounded-2xl">
          <h4 className="text-lg font-semibold text-blue-300 mb-4">Consumption Trend</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-stone-400">Trend Direction</p>
              <p className={`text-lg font-bold mt-1 ${
                data.consumptionTrend.trend === "increasing" ? "text-red-400" :
                data.consumptionTrend.trend === "decreasing" ? "text-green-400" :
                "text-blue-300"
              }`}>
                {data.consumptionTrend.trend.charAt(0).toUpperCase() + data.consumptionTrend.trend.slice(1)}
              </p>
            </div>
            <div>
              <p className="text-sm text-stone-400">Slope (W/interval)</p>
              <p className="text-2xl font-bold text-blue-300 mt-1">
                {data.consumptionTrend.slope.toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-sm text-stone-400">Baseline Power</p>
              <p className="text-2xl font-bold text-blue-300 mt-1">
                {(data.consumptionTrend.intercept / 1000).toFixed(2)} kW
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Cost Analysis - Tamil Nadu TNEB */}
      {data.costAnalysis && (
        <div className="panel panel-green p-6 rounded-2xl">
          <h4 className="text-lg font-semibold text-green-300 mb-4">
            Cost Analysis - Tamil Nadu TNEB (₹ INR)
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-stone-400">Total Cost</p>
              <p className="text-2xl font-bold text-green-300 mt-1">
                ₹{data.costAnalysis.totalCost.toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-sm text-stone-400">Peak Hours (6PM-10PM)</p>
              <div className="mt-1">
                <p className="text-sm font-semibold text-green-400">{data.costAnalysis.peakEnergy.toFixed(1)} kWh</p>
                <p className="text-xs text-stone-400">@ ₹{data.costAnalysis.peakRate}/kWh</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-stone-400">Normal (6AM-6PM)</p>
              <div className="mt-1">
                <p className="text-sm font-semibold text-yellow-400">{data.costAnalysis.shoulderEnergy.toFixed(1)} kWh</p>
                <p className="text-xs text-stone-400">@ ₹{data.costAnalysis.shoulderRate}/kWh</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-stone-400">Off-Peak (10PM-6AM)</p>
              <div className="mt-1">
                <p className="text-sm font-semibold text-blue-400">{data.costAnalysis.offPeakEnergy.toFixed(1)} kWh</p>
                <p className="text-xs text-stone-400">@ ₹{data.costAnalysis.offPeakRate}/kWh</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Demand Response Potential */}
      {data.demandResponsePotential && (
        <div className="panel panel-purple p-6 rounded-2xl">
          <h4 className="text-lg font-semibold text-purple-300 mb-4">Demand Response Potential</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-stone-400">Potential Savings</p>
              <p className="text-2xl font-bold text-purple-300 mt-1">
                {data.demandResponsePotential.potentialSavings.toFixed(1)} kWh/day
              </p>
            </div>
            <div>
              <p className="text-sm text-stone-400">Cost Savings</p>
              <p className="text-2xl font-bold text-purple-300 mt-1">
                ${data.demandResponsePotential.costSavings.toFixed(2)}/day
              </p>
            </div>
            <div>
              <p className="text-sm text-stone-400">Reduction Target</p>
              <p className="text-2xl font-bold text-purple-300 mt-1">
                {data.demandResponsePotential.reductionPercentage.toFixed(0)}%
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Temperature Impact */}
      {data.temperatureImpact && (
        <div className="panel panel-orange p-6 rounded-2xl">
          <h4 className="text-lg font-semibold text-orange-300 mb-4">Temperature Impact</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-stone-400">Thermal Status</p>
              <p className={`text-lg font-bold mt-1 ${
                data.temperatureImpact.thermalStatus === "high" ? "text-red-400" :
                data.temperatureImpact.thermalStatus === "moderate" ? "text-orange-400" :
                "text-green-400"
              }`}>
                {data.temperatureImpact.thermalStatus.charAt(0).toUpperCase() + data.temperatureImpact.thermalStatus.slice(1)}
              </p>
            </div>
            <div>
              <p className="text-sm text-stone-400">Efficiency Loss</p>
              <p className="text-2xl font-bold text-orange-300 mt-1">
                {(data.temperatureImpact.efficiencyLoss ?? 0).toFixed(2)}%
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedAnalytics;
