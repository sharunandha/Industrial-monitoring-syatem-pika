import React from "react";
import { PieChart, Pie, Cell } from "recharts";

const GaugeChart = ({ value, max, label, unit, color = "cyan" }) => {
  const normalized = Math.min(value, max);
  const percentage = (normalized / max) * 100;
  const data = [
    { name: "value", value: normalized },
    { name: "rest", value: Math.max(0, max - normalized) }
  ];

  const colorMap = {
    cyan: { fill: "#06b6d4", bg: "bg-cyan-500/10", border: "border-cyan-500/50", text: "text-cyan-300", glow: "glow-cyan" },
    blue: { fill: "#0ea5e9", bg: "bg-blue-500/10", border: "border-blue-500/50", text: "text-blue-300", glow: "glow-blue" },
    orange: { fill: "#f97316", bg: "bg-orange-500/10", border: "border-orange-500/50", text: "text-orange-300", glow: "glow-orange" },
    purple: { fill: "#a855f7", bg: "bg-purple-500/10", border: "border-purple-500/50", text: "text-purple-300", glow: "glow-purple" },
    green: { fill: "#10b981", bg: "bg-green-500/10", border: "border-green-500/50", text: "text-green-300", glow: "glow-green" }
  };

  const theme = colorMap[color] || colorMap.cyan;

  return (
    <div className={`panel ${theme.bg} p-6 rounded-2xl flex flex-col items-center border-2 ${theme.border} ${theme.glow} transition-all hover:scale-105`}>
      <p className="text-xs uppercase tracking-widest text-stone-400 font-semibold">{label}</p>
      <PieChart width={220} height={140}>
        <Pie
          data={data}
          startAngle={180}
          endAngle={0}
          innerRadius={70}
          outerRadius={90}
          paddingAngle={2}
          dataKey="value"
        >
          <Cell fill={theme.fill} />
          <Cell fill="#1f2937" />
        </Pie>
      </PieChart>
      <div className="-mt-12 text-center">
        <p className={`text-3xl font-bold ${theme.text}`}>{value.toFixed(1)}</p>
        <span className="text-xs text-stone-400">{unit}</span>
        <p className="text-xs text-stone-400 mt-1">{percentage.toFixed(1)}% of {max}</p>
      </div>
    </div>
  );};

export default GaugeChart;
