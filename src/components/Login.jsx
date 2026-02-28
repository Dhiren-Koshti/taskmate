import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { showAlert } from "../redux/slices/alertSlice";
import { useDispatch } from "react-redux";
import { Mail, Lock, LogIn } from "lucide-react";

export default function Login({ handleTokenLogin }) {
  const token = JSON.parse(localStorage.getItem("token"));
  const navigate = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => { if (token) navigate("/"); }, [token]);

  const userLogin = async (c) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:8081"}/user/login`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(c) });
      const data = await res.json();
      if (data.type === "Success") { dispatch(showAlert({ message: data.msg, type: "success" })); handleTokenLogin(data.authToken); navigate("/"); }
      else dispatch(showAlert({ message: data.msg, type: "warning" }));
    } catch (e) { console.error(e); }
  };

  const handleLogin = async (evt) => { evt.preventDefault(); await userLogin({ email: evt.target[0].value, password: evt.target[1].value }); evt.target.reset(); };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="card w-full max-w-md p-8 sm:p-10">
        <div className="text-center mb-8">
          <div className="inline-flex p-3 rounded-2xl mb-4" style={{ background: 'rgba(249,115,22,0.08)' }}>
            <div className="btn-primary !p-2.5 !rounded-xl !px-2.5"><LogIn className="h-5 w-5 text-white" /></div>
          </div>
          <h2 className="text-2xl font-bold text-heading">Welcome back</h2>
          <p className="text-muted text-sm mt-1.5">Sign in to your account</p>
        </div>
        <form className="space-y-5" onSubmit={handleLogin}>
          <div>
            <label className="label">Email</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
              <input type="email" className="input-field !pl-10" placeholder="you@example.com" required />
            </div>
          </div>
          <div>
            <label className="label">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
              <input type="password" className="input-field !pl-10" placeholder="••••••••" autoComplete="off" required />
            </div>
          </div>
          <button type="submit" className="w-full btn-primary py-3 text-sm">Sign in</button>
          <p className="text-center text-muted text-sm pt-1">No account? <Link to="/signup" className="text-primary font-semibold hover:text-primary-light transition-colors duration-200">Sign up</Link></p>
        </form>
      </div>
    </div>
  );
}
