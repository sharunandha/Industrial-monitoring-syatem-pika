import React from "react";
import { NavLink } from "react-router-dom";

const NavItem = ({ to, label }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `block px-4 py-3 rounded-xl text-sm uppercase tracking-widest transition ${
        isActive
          ? "bg-cyan-500/15 text-cyan-200"
          : "text-slate-300 hover:bg-white/5"
      }`
    }
  >
    {label}
  </NavLink>
);

const Sidebar = () => (
  <aside className="panel min-h-screen p-6 hidden lg:flex flex-col gap-6">
    <div>
      <p className="text-xs text-slate-400 uppercase tracking-[0.3em]">Control</p>
      <h1 className="text-2xl font-semibold text-white mt-2">Energy Core</h1>
    </div>

    <nav className="flex flex-col gap-2">
      <NavItem to="/" label="Dashboard" />
      <NavItem to="/devices" label="Devices" />
      <NavItem to="/reports" label="Reports" />
    </nav>

    <div className="mt-auto text-xs text-slate-500">
      <p>System Health: Stable</p>
      <p className="text-emerald-400 mt-1">All sensors online</p>
    </div>
  </aside>
);

export default Sidebar;
