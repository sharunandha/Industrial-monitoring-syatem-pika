import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const UsageBarChart = ({ data }) => (
  <div className="panel p-4 rounded-2xl">
    <p className="text-xs uppercase tracking-[0.35em] text-stone-400">Energy Usage</p>
    <div className="h-52 mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <XAxis dataKey="label" stroke="#475569" />
          <YAxis stroke="#475569" />
          <Tooltip
            contentStyle={{ background: "#0f172a", border: "1px solid #1f2937" }}
          />
          <Bar dataKey="value" fill="#f59e0b" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </div>
);

export default UsageBarChart;
