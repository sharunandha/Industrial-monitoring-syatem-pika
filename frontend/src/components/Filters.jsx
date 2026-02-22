import React from "react";

const Filters = ({ value, onChange, devices }) => (
  <div className="panel p-4 rounded-2xl flex flex-col gap-3 lg:flex-row lg:items-center">
    <div className="flex-1">
      <label className="text-xs uppercase tracking-[0.3em] text-stone-400">Device</label>
      <select
        value={value.deviceId}
        onChange={(event) => onChange({ ...value, deviceId: event.target.value })}
        className="w-full mt-2 bg-transparent border border-white/10 rounded-xl px-3 py-2 text-sm"
      >
        {devices.map((device) => (
          <option key={device.deviceId} value={device.deviceId} className="bg-slate-900">
            {device.name}
          </option>
        ))}
      </select>
    </div>
    <div>
      <label className="text-xs uppercase tracking-[0.3em] text-stone-400">From</label>
      <input
        type="date"
        value={value.from}
        onChange={(event) => onChange({ ...value, from: event.target.value })}
        className="mt-2 bg-transparent border border-white/10 rounded-xl px-3 py-2 text-sm"
      />
    </div>
    <div>
      <label className="text-xs uppercase tracking-[0.3em] text-stone-400">To</label>
      <input
        type="date"
        value={value.to}
        onChange={(event) => onChange({ ...value, to: event.target.value })}
        className="mt-2 bg-transparent border border-white/10 rounded-xl px-3 py-2 text-sm"
      />
    </div>
  </div>
);

export default Filters;
