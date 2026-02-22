import React from "react";
import { motion } from "framer-motion";

export const SkeletonCard = ({ className = "" }) => (
  <div className={`panel p-6 rounded-2xl ${className}`}>
    <motion.div
      className="h-4 w-24 bg-slate-700 rounded mb-4"
      animate={{ opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 1.5, repeat: Infinity }}
    />
    <motion.div
      className="h-8 w-32 bg-slate-700 rounded mb-2"
      animate={{ opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
    />
    <motion.div
      className="h-3 w-20 bg-slate-700 rounded"
      animate={{ opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
    />
  </div>
);

export const SkeletonChart = ({ height = 200, className = "" }) => (
  <div className={`panel p-6 rounded-2xl ${className}`}>
    <motion.div
      className="h-4 w-32 bg-slate-700 rounded mb-4"
      animate={{ opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 1.5, repeat: Infinity }}
    />
    <div className="flex items-end gap-2" style={{ height }}>
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="flex-1 bg-slate-700 rounded-t"
          style={{ height: `${30 + Math.random() * 60}%` }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }}
        />
      ))}
    </div>
  </div>
);

export const SkeletonGauge = ({ className = "" }) => (
  <div className={`panel p-6 rounded-2xl ${className}`}>
    <motion.div
      className="w-32 h-32 mx-auto rounded-full bg-slate-700"
      animate={{ opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 1.5, repeat: Infinity }}
    />
    <motion.div
      className="h-4 w-20 bg-slate-700 rounded mt-4 mx-auto"
      animate={{ opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
    />
  </div>
);

export const SkeletonTable = ({ rows = 5, className = "" }) => (
  <div className={`panel p-6 rounded-2xl ${className}`}>
    <div className="space-y-3">
      {[...Array(rows)].map((_, i) => (
        <div key={i} className="flex gap-4">
          <motion.div
            className="h-4 flex-1 bg-slate-700 rounded"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }}
          />
          <motion.div
            className="h-4 w-20 bg-slate-700 rounded"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 + 0.2 }}
          />
        </div>
      ))}
    </div>
  </div>
);

export const LoadingOverlay = ({ message = "Loading..." }) => (
  <motion.div
    className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-50"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
  >
    <div className="text-center">
      <motion.div
        className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full mx-auto"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
      <motion.p
        className="mt-4 text-cyan-300 font-semibold"
        animate={{ opacity: [1, 0.5, 1] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        {message}
      </motion.p>
    </div>
  </motion.div>
);

export const PulsingDot = ({ color = "cyan", size = 2 }) => (
  <motion.span
    className={`inline-block rounded-full bg-${color}-400`}
    style={{ width: size * 4, height: size * 4 }}
    animate={{ scale: [1, 1.2, 1], opacity: [1, 0.7, 1] }}
    transition={{ duration: 1.5, repeat: Infinity }}
  />
);

export const BlinkingAlert = ({ children, severity = "warning" }) => {
  const colors = {
    warning: "bg-yellow-500/20 border-yellow-500/50 text-yellow-400",
    critical: "bg-red-500/20 border-red-500/50 text-red-400",
    info: "bg-cyan-500/20 border-cyan-500/50 text-cyan-400"
  };

  return (
    <motion.div
      className={`px-4 py-2 rounded-lg border ${colors[severity]}`}
      animate={{ opacity: [1, 0.5, 1] }}
      transition={{ duration: 1, repeat: Infinity }}
    >
      {children}
    </motion.div>
  );
};

export default {
  SkeletonCard,
  SkeletonChart,
  SkeletonGauge,
  SkeletonTable,
  LoadingOverlay,
  PulsingDot,
  BlinkingAlert
};
