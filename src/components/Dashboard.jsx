import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchTodos } from "../redux/slices/taskSlice";
import { ListChecks, Clock, AlertTriangle, CheckCircle, TrendingUp, PieChart, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const taskState = useSelector((state) => state.task);
  const [tasks, setTasks] = useState([]);

  useEffect(() => { const t = JSON.parse(localStorage.getItem("token")); if (!t) navigate("/login"); else dispatch(fetchTodos()); }, [dispatch, navigate]);
  useEffect(() => { setTasks(taskState.data); }, [taskState.data]);

  const total = tasks.length, completed = tasks.filter(t => t.isCompleted).length, pending = total - completed;
  const highPriority = tasks.filter(t => t.priority === "high" && !t.isCompleted).length;
  const rate = total > 0 ? Math.round((completed / total) * 100) : 0;

  const stats = [
    { label: "Total Tasks", value: total, icon: ListChecks, borderColor: "rgba(249,115,22,0.3)", glowColor: "rgba(249,115,22,0.12)" },
    { label: "Completed", value: completed, icon: CheckCircle, borderColor: "rgba(52,211,153,0.3)", glowColor: "rgba(52,211,153,0.12)" },
    { label: "Pending", value: pending, icon: Clock, borderColor: "rgba(251,191,36,0.3)", glowColor: "rgba(251,191,36,0.12)" },
    { label: "High Priority", value: highPriority, icon: AlertTriangle, borderColor: "rgba(244,63,94,0.3)", glowColor: "rgba(244,63,94,0.12)" },
  ];

  return (
    <div className="min-h-screen pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-3">
          <div>
            <h2 className="text-2xl font-bold text-heading">Dashboard</h2>
            <p className="text-muted text-sm mt-0.5">Your productivity at a glance</p>
          </div>
          <div className="card !rounded-btn px-4 py-2 flex items-center gap-2 text-xs text-muted">
            <Calendar className="h-3.5 w-3.5 text-primary" />
            {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {stats.map((s) => (
            <div key={s.label} className="bg-surface rounded-card p-5 transition-all duration-200 hover:-translate-y-0.5" style={{ border: `1px solid ${s.borderColor}`, boxShadow: `0 0 20px ${s.glowColor}` }}>
              <div className="flex items-center justify-between mb-3">
                <div className="btn-primary !p-2.5 !rounded-xl !px-2.5">
                  <s.icon className="h-4 w-4 text-white" />
                </div>
                <span className="text-3xl font-bold text-heading">{s.value}</span>
              </div>
              <p className="text-[10px] font-semibold text-muted uppercase tracking-widest">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Completion */}
          <div className="card p-6">
            <div className="flex items-center gap-2.5 mb-6">
              <TrendingUp className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-semibold text-heading">Completion Rate</h3>
            </div>
            <div className="mb-6">
              <div className="flex justify-between text-xs mb-2">
                <span className="text-muted">Progress</span>
                <span className="font-bold text-heading">{rate}%</span>
              </div>
              <div className="w-full bg-border rounded-full h-2">
                <div className="h-2 rounded-full transition-all duration-700" style={{ width: `${rate}%`, background: 'linear-gradient(90deg, #F97316, #34D399)' }}></div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-input-bg rounded-card p-4 border border-border">
                <p className="text-[10px] text-muted uppercase tracking-widest mb-1">Active</p>
                <p className="text-xl font-bold text-primary">{pending}</p>
              </div>
              <div className="bg-input-bg rounded-card p-4 border border-border">
                <p className="text-[10px] text-muted uppercase tracking-widest mb-1">Done</p>
                <p className="text-xl font-bold text-success">{completed}</p>
              </div>
            </div>
          </div>

          {/* Priority */}
          <div className="card p-6">
            <div className="flex items-center gap-2.5 mb-6">
              <PieChart className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-semibold text-heading">Priority Breakdown</h3>
            </div>
            <div className="space-y-4">
              {[
                { key: 'high', label: 'High', barFrom: '#F43F5E', barTo: '#CC1A36', textColor: 'text-danger' },
                { key: 'medium', label: 'Medium', barFrom: '#FBBF24', barTo: '#D4A017', textColor: 'text-warning' },
                { key: 'low', label: 'Low', barFrom: '#34D399', barTo: '#059669', textColor: 'text-success' },
              ].map((p) => {
                const count = tasks.filter(t => t.priority === p.key && !t.isCompleted).length;
                const pct = pending > 0 ? Math.round((count / pending) * 100) : 0;
                return (
                  <div key={p.key} className="bg-input-bg rounded-card p-4 border border-border">
                    <div className="flex justify-between text-xs mb-2">
                      <span className={`font-semibold ${p.textColor}`}>{p.label}</span>
                      <span className="text-muted">{count} tasks · {pct}%</span>
                    </div>
                    <div className="w-full bg-border rounded-full h-1.5">
                      <div className="h-1.5 rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${p.barFrom}, ${p.barTo})` }}></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
