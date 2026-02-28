import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { updateTodo } from "../redux/slices/taskSlice";
import { X, Save, AlertCircle } from "lucide-react";

const EditModal = ({ show, task, onClose }) => {
  const dispatch = useDispatch();
  const [isDeadlinePassed, setIsDeadlinePassed] = useState(false);

  useEffect(() => { setIsDeadlinePassed(task.deadline ? new Date(task.deadline) < new Date() : false); }, [task]);

  const formatDeadlineForInput = (iso) => {
    if (!iso) return "";
    const d = new Date(iso); d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().slice(0, 16);
  };

  const [edittask, setEditTask] = useState({ taskTitle: task.taskTitle || "", description: task.description || "", priority: task.priority || "", category: task.category || "", deadline: formatDeadlineForInput(task.deadline) });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const e = {};
    if (edittask.taskTitle.length < 3 || !/^[a-zA-Z0-9\s]+$/.test(edittask.taskTitle)) e.taskTitle = "Min 3 chars.";
    if (edittask.description.length < 10) e.description = "Min 10 chars.";
    if (edittask.category.length < 2 || !/^[a-zA-Z\s&-]+$/.test(edittask.category)) e.category = "Letters, spaces, '&', '-' only.";
    if (edittask.priority === "custom") {
      const orig = formatDeadlineForInput(task.deadline), changed = edittask.deadline !== orig;
      if (!edittask.deadline) e.deadline = "Required";
      else if (changed && new Date(edittask.deadline) < new Date()) e.deadline = "Must be future";
      if (isDeadlinePassed && changed) e.deadline = "Locked";
    }
    setErrors(e); return Object.keys(e).length === 0;
  };

  const handleOnSubmit = (evt) => {
    evt.preventDefault();
    if (validateForm()) {
      const up = {};
      for (let f in edittask) {
        const nv = typeof edittask[f] === "string" ? edittask[f].replace(/\s+/g, " ").trim() : edittask[f];
        const ov = typeof task[f] === "string" ? task[f].replace(/\s+/g, " ").trim() : task[f];
        if (nv !== ov) { if (f === "deadline" && edittask[f] === formatDeadlineForInput(task[f])) continue; up[f] = nv; }
      }
      if (up.deadline) { const d = new Date(up.deadline); if (!isNaN(d.getTime())) up.deadline = d.toISOString(); }
      if (!Object.keys(up).length) { show(false); return; }
      dispatch(updateTodo({ id: task._id, updatedata: up }));
      show(false);
    }
  };

  const handleOnChange = (evt) => {
    if (isDeadlinePassed && (evt.target.name === "deadline" || evt.target.name === "priority")) return;
    setEditTask({ ...edittask, [evt.target.name]: evt.target.value });
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="glass w-full max-w-2xl my-8">
        <div className="px-6 py-4 border-b border-border flex justify-between items-center">
          <h2 className="text-base font-bold text-heading flex items-center gap-2">
            Edit Task
            {isDeadlinePassed && <span className="badge-high">Locked</span>}
          </h2>
          <button className="icon-btn text-muted hover:text-heading" onClick={() => show(false)}><X className="h-5 w-5" /></button>
        </div>
        <form onSubmit={handleOnSubmit} className="p-6 space-y-5">
          <div>
            <label className="label">Title</label>
            <input type="text" name="taskTitle" value={edittask.taskTitle} onChange={handleOnChange} className={errors.taskTitle ? "input-error" : "input-field"} />
            {errors.taskTitle && <p className="text-danger text-xs mt-1.5 flex items-center gap-1"><AlertCircle className="h-3 w-3" /> {errors.taskTitle}</p>}
          </div>
          <div>
            <label className="label">Description</label>
            <textarea name="description" rows="3" value={edittask.description} onChange={handleOnChange} className={`${errors.description ? "input-error" : "input-field"} resize-none`} />
            {errors.description && <p className="text-danger text-xs mt-1.5 flex items-center gap-1"><AlertCircle className="h-3 w-3" /> {errors.description}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Priority</label>
              <select name="priority" value={edittask.priority} onChange={handleOnChange} disabled={isDeadlinePassed} className="input-field appearance-none">
                <option value="low" className="bg-surface-raised">Low</option><option value="medium" className="bg-surface-raised">Medium</option><option value="high" className="bg-surface-raised">High</option><option value="custom" className="bg-surface-raised">Custom</option>
              </select>
              {isDeadlinePassed && <p className="text-warning text-xs mt-1">Locked — deadline passed</p>}
            </div>
            <div>
              <label className="label">Category</label>
              <input type="text" name="category" value={edittask.category} onChange={handleOnChange} className={errors.category ? "input-error" : "input-field"} />
              {errors.category && <p className="text-danger text-xs mt-1.5 flex items-center gap-1"><AlertCircle className="h-3 w-3" /> {errors.category}</p>}
            </div>
          </div>
          {edittask.priority === "custom" && (
            <div>
              <label className="label">Deadline</label>
              <input type="datetime-local" name="deadline" value={edittask.deadline || ""} onChange={handleOnChange} disabled={isDeadlinePassed} className={errors.deadline ? "input-error" : "input-field"} />
              {isDeadlinePassed && <p className="text-danger text-xs mt-1">Cannot modify</p>}
              {errors.deadline && !isDeadlinePassed && <p className="text-danger text-xs mt-1.5 flex items-center gap-1"><AlertCircle className="h-3 w-3" /> {errors.deadline}</p>}
            </div>
          )}
          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <button type="button" className="btn-secondary text-sm" onClick={() => show(false)}>Cancel</button>
            <button type="submit" className="btn-primary text-sm flex items-center gap-2"><Save className="h-4 w-4" /> Save</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditModal;
