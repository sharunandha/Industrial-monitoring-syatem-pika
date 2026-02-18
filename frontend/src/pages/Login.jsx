import React, { useState } from "react";
import { login } from "../services/auth";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    try {
      await login(form);
      window.location.href = "/";
    } catch (err) {
      setError("Login failed. Check credentials.");
    }
  };

  return (
    <div className="min-h-screen grid place-items-center px-6 bg-slate-950">
      <form className="panel p-8 rounded-3xl w-full max-w-md" onSubmit={submit}>
        <p className="text-xs uppercase tracking-[0.4em] text-slate-400">Admin Access</p>
        <h2 className="text-2xl text-white font-semibold mt-2">Sign In</h2>

        <div className="mt-6 flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            className="bg-transparent border border-white/10 rounded-xl px-4 py-3 text-sm"
            value={form.email}
            onChange={(event) => setForm({ ...form, email: event.target.value })}
          />
          <input
            type="password"
            placeholder="Password"
            className="bg-transparent border border-white/10 rounded-xl px-4 py-3 text-sm"
            value={form.password}
            onChange={(event) => setForm({ ...form, password: event.target.value })}
          />
        </div>

        {error ? <p className="text-sm text-red-400 mt-3">{error}</p> : null}

        <button
          type="submit"
          className="w-full mt-6 py-3 rounded-xl bg-cyan-500/20 text-cyan-200 text-xs uppercase tracking-[0.35em]"
        >
          Enter Control Room
        </button>
      </form>
    </div>
  );
};

export default Login;
