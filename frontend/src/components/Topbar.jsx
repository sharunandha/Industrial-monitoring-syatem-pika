import React from "react";
import { logout } from "../services/auth";

const Topbar = () => (
  <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between px-6 pt-6">
    <div>
      <p className="text-xs uppercase tracking-[0.4em] text-slate-400">Live Operations</p>
      <h2 className="text-2xl text-white font-semibold">Industrial Energy Overview</h2>
    </div>

    <div className="flex items-center gap-3">
      <div className="panel px-4 py-2 rounded-full text-xs text-slate-300">
        Shift: A-12
      </div>
      <button
        type="button"
        onClick={logout}
        className="px-4 py-2 rounded-full bg-cyan-500/20 text-cyan-200 text-xs uppercase tracking-[0.25em]"
      >
        Sign Out
      </button>
    </div>
  </header>
);

export default Topbar;
