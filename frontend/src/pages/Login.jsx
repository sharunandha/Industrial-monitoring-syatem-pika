import React, { useState } from "react";
import { motion } from "framer-motion";
import { Zap, Mail, Lock, LogIn } from "lucide-react";
import { login } from "../services/auth";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(form);
      window.location.href = "/";
    } catch (err) {
      setError("⚡ Login failed. Check credentials.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid place-items-center px-6 relative overflow-hidden">
      {/* Animated Lightning Bolts Background */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-4xl"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              color: '#f59e0b',
            }}
            animate={{
              opacity: [0, 0.6, 0],
              scale: [0.5, 1.5, 0.5],
              rotate: [0, 360],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          >
            ⚡
          </motion.div>
        ))}
      </div>

      <motion.form 
        className="panel p-8 rounded-3xl w-full max-w-md border-2 border-amber-400/50 relative z-10"
        onSubmit={submit}
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, type: "spring" }}
      >
        {/* Pikachu Header */}
        <div className="text-center mb-8">
          <motion.img 
            src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png"
            alt="Pikachu"
            className="w-28 h-28 mx-auto"
            style={{ filter: 'drop-shadow(0 0 20px rgba(251, 191, 36, 0.6))' }}
            animate={{ y: [-5, 5, -5], rotate: [-3, 3, -3] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <p className="text-xs uppercase tracking-[0.4em] text-amber-400 mt-2">Pokemon Thunder</p>
          <h2 className="text-3xl font-bold thunder-text mt-2">IoT Monitor</h2>
          <p className="text-stone-400 text-sm mt-2">Enter the Thunder Control Room</p>
        </div>

        {/* Input Fields */}
        <div className="flex flex-col gap-4">
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-400" />
            <input
              type="email"
              placeholder="Email"
              className="w-full bg-stone-800 border-2 border-amber-500/50 rounded-xl pl-12 pr-4 py-3 text-stone-100 placeholder-stone-500 focus:border-amber-400 focus:outline-none transition-colors"
              value={form.email}
              onChange={(event) => setForm({ ...form, email: event.target.value })}
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-400" />
            <input
              type="password"
              placeholder="Password"
              className="w-full bg-stone-800 border-2 border-amber-500/50 rounded-xl pl-12 pr-4 py-3 text-stone-100 placeholder-stone-500 focus:border-amber-400 focus:outline-none transition-colors"
              value={form.password}
              onChange={(event) => setForm({ ...form, password: event.target.value })}
            />
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <motion.p 
            className="text-sm text-red-400 mt-3 text-center font-medium"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            {error}
          </motion.p>
        )}

        {/* Submit Button */}
        <motion.button
          type="submit"
          disabled={loading}
          className="w-full mt-6 py-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold text-sm uppercase tracking-[0.2em] flex items-center justify-center gap-2 shadow-lg"
          whileHover={{ scale: 1.02, boxShadow: "0 0 30px rgba(251, 191, 36, 0.6)" }}
          whileTap={{ scale: 0.98 }}
        >
          {loading ? (
            <div className="pokeball-spinner" style={{ width: 24, height: 24 }} />
          ) : (
            <>
              <Zap className="w-5 h-5" />
              Thunder Shock Login
              <LogIn className="w-5 h-5" />
            </>
          )}
        </motion.button>

        {/* Demo Credentials */}
        <div className="mt-6 p-4 bg-stone-800/80 rounded-xl border-2 border-amber-500/30">
          <p className="text-xs text-amber-400 uppercase tracking-wider mb-2 font-semibold">Demo Credentials</p>
          <p className="text-sm text-stone-300">Email: <span className="text-amber-300 font-medium">admin@iot.com</span></p>
          <p className="text-sm text-stone-300">Password: <span className="text-amber-300 font-medium">admin123</span></p>
        </div>

        {/* Tamil Nadu Badge */}
        <div className="mt-4 text-center">
          <span className="text-xs bg-green-900/50 text-green-300 px-3 py-1 rounded-full border border-green-500/50">
            🇮🇳 Tamil Nadu TNEB Electricity Rates
          </span>
        </div>
      </motion.form>
    </div>
  );
};

export default Login;
