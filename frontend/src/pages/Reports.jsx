import React, { useEffect, useState } from "react";
import Filters from "../components/Filters";
import { fetchDevices } from "../services/device";
import { exportCsv, exportPdf, fetchSeries, fetchAdvancedAnalytics } from "../services/data";
import { toChartSeries } from "../utils/format";
import UsageBarChart from "../charts/UsageBarChart";

const Reports = () => {
  const [devices, setDevices] = useState([]);
  const [filters, setFilters] = useState({ deviceId: "", from: "", to: "" });
  const [series, setSeries] = useState([]);

  useEffect(() => {
    const init = async () => {
      const list = await fetchDevices();
      setDevices(list);
      if (list.length) {
        setFilters((prev) => ({ ...prev, deviceId: list[0].deviceId }));
      }
    };

    init();
  }, []);

  useEffect(() => {
    if (!filters.deviceId) return;
    const load = async () => {
      const data = await fetchSeries(filters.deviceId, filters.from, filters.to);
      setSeries(toChartSeries(data.series, "totalEnergy"));
    };
    load();
  }, [filters]);

  const download = async () => {
    const response = await exportCsv(filters.deviceId, filters.from, filters.to);
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "energy-report.csv");
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const downloadPdf = async () => {
    const response = await exportPdf(filters.deviceId, filters.from, filters.to);
    const url = window.URL.createObjectURL(
      new Blob([response.data], { type: "application/pdf" })
    );
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "energy-report.pdf");
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <div className="flex flex-col gap-6">
      <Filters value={filters} onChange={setFilters} devices={devices} />
      <div className="flex items-center justify-between">
        <h3 className="text-xl text-white font-semibold">Energy Reports</h3>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={downloadPdf}
            className="px-4 py-2 rounded-xl bg-amber-500/20 text-amber-200 text-xs uppercase tracking-[0.35em]"
          >
            Export PDF
          </button>
          <button
            type="button"
            onClick={download}
            className="px-4 py-2 rounded-xl bg-cyan-500/20 text-cyan-200 text-xs uppercase tracking-[0.35em]"
          >
            Export CSV
          </button>
        </div>
      </div>
      <UsageBarChart data={series} />
      <div className="panel p-4 rounded-2xl">
        <p className="text-sm text-stone-300">
          Use the filters to generate hourly, daily, and monthly reports. The export uses
          the same date range.
        </p>
      </div>
    </div>
  );
};

export default Reports;
