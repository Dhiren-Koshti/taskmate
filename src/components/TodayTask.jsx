import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchTodos } from "../redux/slices/taskSlice";
import TaskCard from "./TaskCard";
import Spinner from "./Spinner";
import EditModal from "./EditModal";
import { useNavigate } from "react-router-dom";
import { ClipboardList } from "lucide-react";

export default function TodayTask() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const taskState = useSelector((state) => state.task);
  const [localTasks, setLocalTasks] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const token = JSON.parse(localStorage.getItem("token"));
    if (!token) navigate("/login");
    else { dispatch(fetchTodos({ date: new Date().toLocaleDateString() })); setAuthChecked(true); }
  }, [dispatch, navigate, taskState.isUpdateTask]);

  useEffect(() => { setLocalTasks(taskState.data); }, [taskState.data]);

  if (!authChecked) return <Spinner />;
  if (taskState.isLoading && localTasks.length === 0) return <Spinner />;

  return (
    <>
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="btn-primary !p-2.5 !rounded-xl !px-2.5">
            <ClipboardList className="h-4 w-4 text-white" />
          </div>
          <div>
            <h2 className="text-base font-bold text-heading">Today's Tasks</h2>
            <p className="text-muted text-xs">{localTasks.length} task{localTasks.length !== 1 ? 's' : ''} for today</p>
          </div>
        </div>

        {localTasks.length === 0 || taskState.isError ? (
          <div className="card p-12 text-center !hover:translate-y-0">
            <div className="p-4 rounded-2xl inline-flex mb-4" style={{ background: 'rgba(249,115,22,0.06)' }}>
              <ClipboardList className="h-8 w-8 text-muted" />
            </div>
            <h3 className="text-sm font-semibold text-heading mb-1">No tasks today</h3>
            <p className="text-muted text-xs max-w-xs mx-auto">Create a task above to get started.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {localTasks.map((t) => (
              <TaskCard key={t._id} id={t._id} taskTitle={t.taskTitle} description={t.description}
                status={t.status} priority={t.priority} statusColor={t.statusColor}
                createdAt={new Date(t.date).toLocaleDateString()} category={t.category}
                isCompleted={t.isCompleted}
                deadline={t.deadline ? new Date(t.deadline).toLocaleString("en-US", { month: "numeric", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit", hour12: true }) : "No Deadline"}
                setIsEditing={() => { setSelectedTask(t); setIsEditing(true); }}
              />
            ))}
          </div>
        )}
      </div>
      {isEditing && <EditModal show={() => setIsEditing(false)} task={selectedTask} onClose={() => setIsEditing(false)} />}
    </>
  );
}
