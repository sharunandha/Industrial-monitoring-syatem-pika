import React, { useEffect, useState } from "react";
import { createDevice, fetchDevices } from "../services/device";

const Devices = () => {
  const [devices, setDevices] = useState([]);
  const [form, setForm] = useState({ deviceId: "", name: "", location: "" });

  const load = async () => {
    const list = await fetchDevices();
    setDevices(list);
  };

  useEffect(() => {
    load();
  }, []);

  const submit = async (event) => {
    event.preventDefault();
    await createDevice({ ...form });
    setForm({ deviceId: "", name: "", location: "" });
    load();
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="panel p-6 rounded-2xl">
        <h3 className="text-xl text-white font-semibold">Register Device</h3>
        <form className="mt-4 grid gap-3 md:grid-cols-3" onSubmit={submit}>
          <input
            className="bg-transparent border border-white/10 rounded-xl px-3 py-2 text-sm"
            placeholder="Device ID"
            value={form.deviceId}
            onChange={(event) => setForm({ ...form, deviceId: event.target.value })}
          />
          <input
            className="bg-transparent border border-white/10 rounded-xl px-3 py-2 text-sm"
            placeholder="Device Name"
            value={form.name}
            onChange={(event) => setForm({ ...form, name: event.target.value })}
          />
          <input
            className="bg-transparent border border-white/10 rounded-xl px-3 py-2 text-sm"
            placeholder="Location"
            value={form.location}
            onChange={(event) => setForm({ ...form, location: event.target.value })}
          />
          <button
            type="submit"
            className="md:col-span-3 px-4 py-2 rounded-xl bg-cyan-500/20 text-cyan-200 text-xs uppercase tracking-[0.35em]"
          >
            Register
          </button>
        </form>
      </div>

      <div className="panel p-6 rounded-2xl">
        <h3 className="text-xl text-white font-semibold">Registered Devices</h3>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-stone-400">
              <tr>
                <th className="pb-2">Device ID</th>
                <th className="pb-2">Name</th>
                <th className="pb-2">Location</th>
                <th className="pb-2">Power Threshold</th>
                <th className="pb-2">Temp Threshold</th>
              </tr>
            </thead>
            <tbody>
              {devices.map((device) => (
                <tr key={device.deviceId} className="border-t border-white/5">
                  <td className="py-3 text-stone-100">{device.deviceId}</td>
                  <td className="py-3 text-stone-300">{device.name}</td>
                  <td className="py-3 text-stone-300">{device.location}</td>
                  <td className="py-3 text-stone-300">{device.thresholds?.power}</td>
                  <td className="py-3 text-stone-300">{device.thresholds?.temperature}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Devices;
