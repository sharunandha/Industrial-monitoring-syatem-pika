import React from "react";
import { NavLink } from "react-router-dom";
import { Zap, LayoutDashboard, Cpu, FileText } from "lucide-react";

const NavItem = ({ to, label, icon: Icon }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center gap-3 px-4 py-3 rounded-xl text-sm uppercase tracking-widest transition ${
        isActive
          ? "bg-amber-500/25 text-amber-300 thunder-border electric-pulse font-bold"
          : "text-stone-300 hover:bg-amber-500/15 hover:text-amber-200"
      }`
    }
  >
    {Icon && <Icon className="w-5 h-5" />}
    {label}
  </NavLink>
);

const Sidebar = () => (
  <aside className="panel min-h-screen p-6 hidden lg:flex flex-col gap-6 border-r-2 border-amber-500/30">
    {/* Pikachu Image */}
    <div className="text-center">
      <img 
        src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png" 
        alt="Pikachu" 
        className="w-24 h-24 mx-auto drop-shadow-lg hover:scale-110 transition-transform duration-300"
        style={{ filter: 'drop-shadow(0 0 15px rgba(251, 191, 36, 0.6))' }}
      />
      <p className="text-xs text-amber-400 uppercase tracking-[0.3em] mt-2">Pokemon</p>
      <h1 className="text-2xl font-bold thunder-text mt-1">Thunder Core</h1>
      <p className="text-xs text-stone-400 mt-1">IoT Power Monitor</p>
    </div>

    {/* Navigation */}
    <nav className="flex flex-col gap-2">
      <NavItem to="/" label="Dashboard" icon={LayoutDashboard} />
      <NavItem to="/devices" label="Devices" icon={Cpu} />
      <NavItem to="/reports" label="Reports" icon={FileText} />
    </nav>

    {/* Status Footer */}
    <div className="mt-auto panel-thunder p-4 rounded-xl">
      <div className="flex items-center gap-2 text-amber-400 mb-2">
        <Zap className="w-4 h-4 zap-icon" />
        <span className="text-xs uppercase tracking-wider font-semibold">System Status</span>
      </div>
      <p className="text-sm text-green-400 flex items-center gap-2 font-medium">
        <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
        All sensors online
      </p>
      <div className="mt-2 h-2 bg-stone-700 rounded-full overflow-hidden">
        <div className="h-full energy-bar" style={{width: '75%'}}></div>
      </div>
      <p className="text-xs text-stone-400 mt-1 font-medium">Power Level: 75%</p>
      
      {/* Tamil Nadu TNEB Badge */}
      <div className="mt-3 text-center">
        <span className="text-xs bg-amber-900/50 text-amber-300 px-2 py-1 rounded-full border border-amber-500/50">
          🇮🇳 Tamil Nadu TNEB
        </span>
      </div>
    </div>
  </aside>
);

export default Sidebar;
