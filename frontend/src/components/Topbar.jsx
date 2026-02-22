import React from "react";
import { motion } from "framer-motion";
import { Zap, LogOut, Activity } from "lucide-react";
import { logout } from "../services/auth";

const Topbar = () => (
  <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between px-6 pt-6">
    <div className="flex items-center gap-4">
      <motion.img 
        src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png"
        alt="Pikachu"
        className="w-14 h-14"
        style={{ filter: 'drop-shadow(0 0 12px rgba(251, 191, 36, 0.6))' }}
        animate={{ rotate: [-5, 5, -5], y: [-2, 2, -2] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      />
      <div>
        <p className="text-xs uppercase tracking-[0.4em] text-amber-400 flex items-center gap-2 font-semibold">
          <Activity className="w-3 h-3" />
          Live Thunder Operations
        </p>
        <h2 className="text-2xl font-bold thunder-text">Pokemon Energy Monitor</h2>
      </div>
    </div>

    <div className="flex items-center gap-3">
      <motion.div 
        className="panel px-4 py-2 rounded-full text-xs text-amber-300 flex items-center gap-2 thunder-border font-semibold"
        animate={{ boxShadow: ["0 0 0px rgba(251,191,36,0)", "0 0 15px rgba(251,191,36,0.4)", "0 0 0px rgba(251,191,36,0)"] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <Zap className="w-3 h-3" />
        Pikachu Mode: Active
      </motion.div>
      <span className="text-xs bg-green-900/50 text-green-300 px-3 py-1 rounded-full border border-green-500/50 font-medium">
        🇮🇳 TNEB
      </span>
      <motion.button
        type="button"
        onClick={logout}
        className="px-4 py-2 rounded-full bg-gradient-to-r from-amber-500 to-orange-600 text-white text-xs uppercase tracking-[0.2em] font-bold flex items-center gap-2 shadow-lg"
        whileHover={{ scale: 1.05, boxShadow: "0 0 25px rgba(251, 191, 36, 0.6)" }}
        whileTap={{ scale: 0.95 }}
      >
        <LogOut className="w-4 h-4" />
        Sign Out
      </motion.button>
    </div>
  </header>
);

export default Topbar;
