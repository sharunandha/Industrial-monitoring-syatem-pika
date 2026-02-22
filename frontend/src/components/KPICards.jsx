import React from "react";

const KPICards = ({ items }) => {
  const colorMap = {
    "text-cyan-300": "panel-thunder border-amber-500/50 glow-thunder",
    "text-orange-300": "panel-fire border-orange-500/50 glow-orange",
    "text-emerald-300": "panel-bolt border-green-500/50 glow-green",
    "text-purple-300": "panel-storm border-purple-500/50 glow-purple"
  };

  const textColorMap = {
    "text-cyan-300": "text-amber-300",
    "text-orange-300": "text-orange-300",
    "text-emerald-300": "text-green-300",
    "text-purple-300": "text-purple-300"
  };

  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 fade-in">
      {items.map((item, index) => {
        const themeClass = colorMap[item.tone] || "panel-thunder";
        const textColor = textColorMap[item.tone] || "text-amber-300";
        return (
          <div
            key={item.label}
            className={`${themeClass} panel p-6 rounded-2xl border-l-4 transition-all hover:scale-105 hover:-translate-y-1`}
            style={{
              animationDelay: `${index * 0.1}s`
            }}
          >
            <p className="text-xs uppercase tracking-widest text-stone-400 font-semibold">
              {item.label}
            </p>
            <div className="flex items-end justify-between mt-4">
              <h3 className={`text-3xl font-bold ${textColor}`}>{item.value}</h3>
            </div>
            <p className="text-xs text-stone-400 mt-3">{item.caption}</p>
          </div>
        );
      })}
    </div>
  );
};
export default KPICards;
