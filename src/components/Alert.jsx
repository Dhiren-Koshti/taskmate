import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { hideAlert } from "../redux/slices/alertSlice";
import { CheckCircle, AlertTriangle, XCircle, X } from "lucide-react";

const Alert = () => {
  const dispatch = useDispatch();
  const { message, type, show } = useSelector((state) => state.alert);

  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => dispatch(hideAlert()), 3000);
      return () => clearTimeout(timer);
    }
  }, [show, dispatch]);

  if (!show) return null;

  const styles = {
    success: { bg: "rgba(52,211,153,0.12)", border: "rgba(52,211,153,0.3)", text: "#34D399", Icon: CheckCircle },
    warning: { bg: "rgba(251,191,36,0.12)", border: "rgba(251,191,36,0.3)", text: "#FBBF24", Icon: AlertTriangle },
    error: { bg: "rgba(244,63,94,0.12)", border: "rgba(244,63,94,0.3)", text: "#F43F5E", Icon: XCircle },
  };

  const s = styles[type] || styles.success;

  return (
    <div className="fixed top-20 right-4 z-[100] animate-slide-in max-w-sm w-full">
      <div
        className="flex items-center gap-3 px-4 py-3 rounded-card backdrop-blur-xl shadow-lg"
        style={{ background: s.bg, border: `1px solid ${s.border}` }}
      >
        <s.Icon className="h-5 w-5 flex-shrink-0" style={{ color: s.text }} />
        <p className="text-sm font-medium flex-1" style={{ color: s.text }}>{message}</p>
        <button onClick={() => dispatch(hideAlert())} className="icon-btn flex-shrink-0" style={{ color: s.text }}>
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default Alert;
