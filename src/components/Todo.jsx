import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addTodo } from "../redux/slices/taskSlice";
import { AlertCircle, Plus } from "lucide-react";

export default function Todo() {
  const dispatch = useDispatch();
  const [task, setTask] = useState({ taskTitle: "", description: "", priority: "medium", category: "", deadline: "" });
  const [showDeadlineField, setShowDeadlineField] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const e = {};
    const c = { ...task, taskTitle: task.taskTitle.trim().replace(/\s+/g, " "), description: task.description.trim().replace(/\s+/g, " "), category: task.category.trim().replace(/\s+/g, " ") };
    setTask(c);
    if (c.taskTitle.length < 3 || !/^[a-zA-Z0-9\s]+$/.test(c.taskTitle)) e.taskTitle = "Min 3 chars, letters/numbers/spaces.";
    if (c.description.length < 10) e.description = "Min 10 characters.";
    if (c.category.length < 2 || !/^[a-zA-Z\s&-]+$/.test(c.category)) e.category = "Letters, spaces, '&', '-' only.";
    if (c.priority === "custom") { if (!c.deadline) e.deadline = "Required"; else if (new Date(c.deadline) < new Date()) e.deadline = "Must be future"; }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleOnSubmit = (evt) => {
    evt.preventDefault();
    if (validateForm()) {
      let u = { ...task };
      if (u.deadline) { const d = new Date(u.deadline); if (isNaN(d.getTime())) { setErrors(p => ({ ...p, deadline: "Invalid" })); return; } u.deadline = d.toISOString(); }
      else delete u.deadline;
      dispatch(addTodo(u));
      setTask({ taskTitle: "", description: "", priority: "medium", category: "", deadline: "" });
      setShowDeadlineField(false);
    }
  };

  const handlePriorityChange = (e) => { setTask({ ...task, priority: e.target.value }); setShowDeadlineField(e.target.value === "custom"); };
  const handleOnChange = (e) => setTask({ ...task, [e.target.id]: e.target.value });

  return (
    <div className="max-w-xl mx-auto">
      <div className="card overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-primary-dark px-6 py-4 flex justify-between items-center" style={{ boxShadow: '0 4px 24px rgba(249,115,22,0.2)' }}>
          <div className="flex items-center gap-2.5">
            <Plus className="h-5 w-5 text-white" />
            <h2 className="text-sm font-bold text-white tracking-wide uppercase">New Task</h2>
          </div>
          <span className="text-white/60 text-xs">{new Date().toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</span>
        </div>

        <form onSubmit={handleOnSubmit} className="p-6 space-y-5">
          <div>
            <label htmlFor="taskTitle" className="label">Title</label>
            <input type="text" id="taskTitle" value={task.taskTitle} onChange={handleOnChange} placeholder="What needs to be done?" className={errors.taskTitle ? "input-error" : "input-field"} />
            {errors.taskTitle && <p className="text-danger text-xs mt-1.5 flex items-center gap-1"><AlertCircle className="h-3 w-3" /> {errors.taskTitle}</p>}
          </div>
          <div>
            <label htmlFor="description" className="label">Description</label>
            <textarea id="description" value={task.description} onChange={handleOnChange} rows="3" placeholder="Add details..." className={`${errors.description ? "input-error" : "input-field"} resize-none`}></textarea>
            {errors.description && <p className="text-danger text-xs mt-1.5 flex items-center gap-1"><AlertCircle className="h-3 w-3" /> {errors.description}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="category" className="label">Category</label>
              <input type="text" id="category" value={task.category} onChange={handleOnChange} placeholder="e.g., Work" className={errors.category ? "input-error" : "input-field"} />
              {errors.category && <p className="text-danger text-xs mt-1.5 flex items-center gap-1"><AlertCircle className="h-3 w-3" /> {errors.category}</p>}
            </div>
            <div>
              <label htmlFor="priority" className="label">Priority</label>
              <select id="priority" value={task.priority} onChange={handlePriorityChange} className="input-field appearance-none">
                <option value="low" className="bg-surface-raised">Low</option>
                <option value="medium" className="bg-surface-raised">Medium</option>
                <option value="high" className="bg-surface-raised">High</option>
                <option value="custom" className="bg-surface-raised">Custom</option>
              </select>
            </div>
          </div>
          <div className={`transition-all duration-200 overflow-hidden ${showDeadlineField ? 'max-h-24 opacity-100' : 'max-h-0 opacity-0'}`}>
            <label htmlFor="deadline" className="label">Deadline</label>
            <input type="datetime-local" id="deadline" value={task.deadline} onChange={handleOnChange} className={errors.deadline ? "input-error" : "input-field"} />
            {errors.deadline && <p className="text-danger text-xs mt-1.5 flex items-center gap-1"><AlertCircle className="h-3 w-3" /> {errors.deadline}</p>}
          </div>
          <button type="submit" className="w-full btn-primary py-3 text-sm">Create Task</button>
        </form>
      </div>
    </div>
  );
}
