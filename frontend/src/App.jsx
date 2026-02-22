import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Devices from "./pages/Devices";
import Reports from "./pages/Reports";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import { getToken } from "./services/auth";

// Floating Lightning Bolts Component
const FloatingLightning = () => (
  <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
    {[...Array(6)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute text-2xl text-yellow-400"
        style={{
          left: `${10 + i * 15}%`,
          top: "-50px",
        }}
        animate={{
          y: ["0vh", "110vh"],
          x: [0, Math.sin(i) * 50, 0],
          opacity: [0, 0.6, 0.6, 0],
          rotate: [0, 360],
        }}
        transition={{
          duration: 8 + i * 2,
          repeat: Infinity,
          delay: i * 1.5,
          ease: "linear",
        }}
      >
        ⚡
      </motion.div>
    ))}
  </div>
);

const Layout = ({ children }) => (
  <div className="min-h-screen grid lg:grid-cols-[260px_1fr] relative">
    <FloatingLightning />
    <Sidebar />
    <div className="flex flex-col">
      <Topbar />
      <main className="flex-1 p-6 lg:p-8 grid-pattern">{children}</main>
    </div>
  </div>
);

const RequireAuth = ({ children }) => {
  const token = getToken();
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const App = () => (
  <AnimatePresence mode="wait">
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <RequireAuth>
            <Layout>
              <Dashboard />
            </Layout>
          </RequireAuth>
        }
      />
      <Route
        path="/devices"
        element={
          <RequireAuth>
            <Layout>
              <Devices />
            </Layout>
          </RequireAuth>
        }
      />
      <Route
        path="/reports"
        element={
          <RequireAuth>
            <Layout>
              <Reports />
            </Layout>
          </RequireAuth>
        }
      />
    </Routes>
  </AnimatePresence>
);

export default App;
