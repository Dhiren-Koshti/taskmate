import React, { useEffect, useState } from "react";
import EditModal from "./EditModal";
import { fetchTodos, deleteTodo } from "../redux/slices/taskSlice";
import { useDispatch, useSelector } from "react-redux";
import Spinner from "./Spinner";
import ConfirmModal from "../components/ConfirmModal";
import { useNavigate } from "react-router-dom";
import { Search, ChevronDown, ListFilter, SlidersHorizontal } from "lucide-react";
import TaskCard from "./TaskCard";

export default function FilterTask() {
  const token = JSON.parse(localStorage.getItem("token"));
  const navigate = useNavigate();
  useEffect(() => { if (!token) navigate("/login"); }, [token]);

  const dispatch = useDispatch();
  const taskState = useSelector((state) => state.task);
  const [localTasks, setLocalTasks] = useState([]);
  const [filter, setFilter] = useState({ taskTitle: "", category: "", priority: "", deadline: "", status: "", date: "", month: "", year: "" });
  const [inputError, setInputError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => { if (!inputError) dispatch(fetchTodos(filter)); }, [filter]);
  useEffect(() => { setLocalTasks(taskState.data); }, [taskState.data]);

  const confirmDelete = () => { if (selectedTask) { dispatch(deleteTodo(selectedTask._id)); setSelectedTask(null); setShowModal(false); } };
  const handleOnChange = (e) => setFilter(p => ({ ...p, [e.target.id]: e.target.value }));
  const handleDateChange = (e) => { const v = e.target.value; setInputError(!v || !isNaN(new Date(v).getTime()) ? "" : "Invalid date"); setFilter(p => ({ ...p, date: v, month: "", year: "" })); };
  const handleMonthChange = (e) => { setInputError(""); setFilter(p => ({ ...p, month: e.target.value, date: "" })); };
  const handleYearChange = (e) => { const v = e.target.value; setInputError(v && (v < 2000 || v > 2099) ? "Year: 2000-2099" : ""); setFilter(p => ({ ...p, year: v, date: "" })); };

  const renderContent = () => {
    if (taskState.isLoading && localTasks.length === 0) return <div className="flex justify-center py-20"><Spinner /></div>;
    if (taskState.isError || inputError) return <div className="card p-4 text-center text-danger text-sm !hover:translate-y-0">{inputError || "Something went wrong."}</div>;
    if (localTasks.length === 0) return (
      <div className="card text-center py-20 !hover:translate-y-0">
        <div className="p-4 rounded-2xl inline-flex mb-3" style={{ background: 'rgba(249,115,22,0.06)' }}>
          <ListFilter className="h-10 w-10 text-muted" />
        </div>
        <h3 className="text-sm font-semibold text-heading">No tasks found</h3>
        <p className="text-muted text-xs mt-1">Try adjusting your filters.</p>
      </div>
    );
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {localTasks.map((t) => (
          <TaskCard key={t._id} id={t._id} taskTitle={t.taskTitle} description={t.description}
            status={t.status} priority={t.priority} statusColor={t.statusColor}
            createdAt={new Date(t.date).toLocaleDateString()} category={t.category} isCompleted={t.isCompleted}
            deadline={t.deadline ? new Date(t.deadline).toLocaleString("en-US", { month: "numeric", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit", hour12: true }) : "No Deadline"}
            setIsEditing={() => { setSelectedTask(t); setIsEditing(true); }}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-3">
        <div>
          <h2 className="text-lg font-bold text-heading">All Tasks</h2>
          <p className="text-muted text-xs mt-0.5">Manage and filter your tasks</p>
        </div>
        <button onClick={() => setShowFilters(!showFilters)} className="btn-secondary flex items-center gap-2 text-sm !py-2">
          <SlidersHorizontal className="h-4 w-4" /> Filters
          <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${showFilters ? 'rotate-180' : ''}`} />
        </button>
      </div>

      <div className={`mb-6 transition-all duration-200 overflow-hidden ${showFilters ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="card p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 !hover:translate-y-0">
          <div>
            <label className="label">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
              <input type="text" id="taskTitle" value={filter.taskTitle} onChange={handleOnChange} placeholder="By title..." className="input-field pl-9" />
            </div>
          </div>
          <div>
            <label className="label">Category</label>
            <input type="text" id="category" value={filter.category} onChange={handleOnChange} placeholder="Filter..." className="input-field" />
          </div>
          <div>
            <label className="label">Priority</label>
            <select id="priority" value={filter.priority} onChange={handleOnChange} className="input-field appearance-none">
              <option value="" className="bg-surface-raised">All</option><option value="high" className="bg-surface-raised">High</option><option value="medium" className="bg-surface-raised">Medium</option><option value="low" className="bg-surface-raised">Low</option><option value="custom" className="bg-surface-raised">Custom</option>
            </select>
          </div>
          <div>
            <label className="label">Status</label>
            <select id="status" value={filter.status} onChange={handleOnChange} className="input-field appearance-none">
              <option value="" className="bg-surface-raised">All</option><option value="Completed" className="bg-surface-raised">Completed</option><option value="Pending" className="bg-surface-raised">Pending</option><option value="Delayed" className="bg-surface-raised">Delayed</option>
            </select>
          </div>
          <div className="md:col-span-2 lg:col-span-4 grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-border pt-4 mt-1">
            <div>
              <label className="label">Date</label>
              <input type="date" id="date" value={filter.date} onChange={handleDateChange} disabled={filter.month || filter.year} className="input-field" />
            </div>
            <div>
              <label className="label">Month</label>
              <select id="month" value={filter.month} onChange={handleMonthChange} disabled={filter.date} className="input-field appearance-none">
                <option value="" className="bg-surface-raised">All</option>
                {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map((m, i) => <option key={i} value={String(i + 1).padStart(2, '0')} className="bg-surface-raised">{m}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Year</label>
              <input type="number" id="year" min="2000" max="2099" value={filter.year} onChange={handleYearChange} disabled={filter.date} placeholder="YYYY" className="input-field" />
            </div>
          </div>
        </div>
      </div>

      {renderContent()}
      {isEditing && <EditModal show={setIsEditing} task={selectedTask} onClose={() => setIsEditing(false)} />}
      <ConfirmModal show={showModal} onClose={() => { setShowModal(false); setSelectedTask(null); }} onConfirm={confirmDelete} message="Delete this task?" />
    </div>
  );
}
