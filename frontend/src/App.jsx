import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Devices from "./pages/Devices";
import Reports from "./pages/Reports";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import { getToken } from "./services/auth";

const Layout = ({ children }) => (
  <div className="min-h-screen grid lg:grid-cols-[260px_1fr]">
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
);

export default App;
