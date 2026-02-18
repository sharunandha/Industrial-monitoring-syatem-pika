import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

const LineChartCard = ({ title, data, dataKey, stroke }) => (
  <div className="panel p-4 rounded-2xl">
    <p className="text-xs uppercase tracking-[0.35em] text-slate-400">{title}</p>
    <div className="h-52 mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis dataKey="label" stroke="#475569" />
          <YAxis stroke="#475569" />
          <Tooltip
            contentStyle={{ background: "#0f172a", border: "1px solid #1f2937" }}
          />
          <Line type="monotone" dataKey={dataKey} stroke={stroke} strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  </div>
);

export default LineChartCard;
