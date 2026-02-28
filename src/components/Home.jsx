import React from "react";
import Todo from "./Todo";
import TodayTask from "./TodayTask";

export default function Home() {
  return (
    <div className="min-h-screen pb-12 relative">
      {/* Hero Aura */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at top, rgba(249,115,22,0.08) 0%, transparent 60%)' }} />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-10 py-8 relative">
        <Todo />
        <div className="border-t border-border pt-10">
          <TodayTask />
        </div>
      </div>
    </div>
  );
}
