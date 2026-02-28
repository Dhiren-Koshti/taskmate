import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Edit, Trash2 } from "lucide-react";
import { deleteTodo, updateTodo } from "../redux/slices/taskSlice";
import ConfirmModal from "../components/ConfirmModal";

export default function TaskCard({ id, taskTitle, description, status, priority, statusColor, isCompleted, category, createdAt, deadline, setIsEditing }) {
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);

  const handledCheckbox = () => dispatch(updateTodo({ id, updatedata: { isCompleted: !isCompleted } }));
  const confirmDelete = () => { dispatch(deleteTodo(id)); setShowModal(false); };

  const badgeClass = { high: "badge-high", medium: "badge-medium", low: "badge-low", custom: "badge-custom" };

  return (
    <>
      <div className={`card group ${isCompleted ? "opacity-50" : ""}`}>
        <div className="p-5">
          {/* Top */}
          <div className="flex items-center gap-2 flex-wrap mb-3">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-muted">{category}</span>
            <span className={badgeClass[priority] || "badge-custom"}>{priority}</span>
          </div>

          {/* Title */}
          <h3 className={`text-sm font-semibold text-heading leading-snug mb-2 ${isCompleted ? "line-through text-muted" : ""}`}>{taskTitle}</h3>

          {/* Description */}
          <p className="text-muted text-xs mb-4 line-clamp-2 leading-relaxed">{description}</p>

          {/* Meta */}
          <div className="flex items-center gap-3 text-xs text-muted mb-4">
            <span>{createdAt}</span>
            {deadline && deadline !== "No Deadline" && <span className="text-warning font-medium">Due: {deadline}</span>}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-3 border-t border-border">
            <button onClick={handledCheckbox} className={`text-xs font-medium transition-all duration-200 ${isCompleted ? "text-success" : "text-muted hover:text-primary"}`}>
              {isCompleted ? "✓ Done" : "○ Mark done"}
            </button>
            <div className="flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200">
              <button onClick={setIsEditing} className="icon-btn text-muted hover:text-primary" title="Edit"><Edit className="h-3.5 w-3.5" /></button>
              <button onClick={() => setShowModal(true)} className="icon-btn text-muted hover:text-danger" title="Delete"><Trash2 className="h-3.5 w-3.5" /></button>
            </div>
          </div>
        </div>
      </div>
      <ConfirmModal show={showModal} onClose={() => setShowModal(false)} onConfirm={confirmDelete} message="Delete this task? This can't be undone." />
    </>
  );
}
