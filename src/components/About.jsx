import React from "react";
import { Shield, Zap, Users, Github, Linkedin } from "lucide-react";

export default function About() {
  const values = [
    { icon: Zap, title: "Fast & Efficient", desc: "Built for speed — no bloat, no lag. Get things done faster." },
    { icon: Shield, title: "Reliable", desc: "Your data is safe and always accessible when you need it." },
    { icon: Users, title: "Team-Ready", desc: "Designed for individuals and teams who value simplicity." },
  ];

  return (
    <div className="min-h-screen pb-16">
      {/* Hero Aura */}
      <div className="relative">
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at top, rgba(249,115,22,0.08) 0%, transparent 60%)' }} />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 relative">
          <div className="py-20 text-center">
            <div className="inline-block mb-6">
              <span className="badge-custom !px-4 !py-1.5 !text-xs">About TaskMate</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-heading mb-4 leading-tight">
              Built for people who<br />
              <span className="text-primary">get things done</span>
            </h1>
            <p className="text-muted max-w-xl mx-auto text-base leading-relaxed">
              TaskMate is a modern task management platform designed to help you focus on what matters. No distractions, just productivity.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Values */}
        <div className="grid md:grid-cols-3 gap-5 mb-20">
          {values.map((v, i) => (
            <div key={i} className="card p-6 group">
              <div className="btn-primary !p-3 !rounded-xl !px-3 inline-flex mb-4">
                <v.icon className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-sm font-bold text-heading mb-2">{v.title}</h3>
              <p className="text-muted text-sm leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>

        {/* Team */}
        <div className="text-center mb-16">
          <h2 className="text-xl font-bold text-heading mb-2">Built by developers</h2>
          <p className="text-muted text-sm mb-8">A small team passionate about productivity tools</p>
          <div className="card inline-block p-8">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center mx-auto mb-3" style={{ boxShadow: '0 0 24px rgba(249,115,22,0.35)' }}>
              <span className="text-2xl font-bold text-white">D</span>
            </div>
            <p className="text-heading font-semibold text-sm">Developer</p>
            <p className="text-muted text-xs mt-0.5">Full Stack Engineer</p>
            <div className="flex gap-2 mt-3 justify-center">
              <a href="#" className="icon-btn text-muted hover:text-primary"><Github className="h-4 w-4" /></a>
              <a href="#" className="icon-btn text-muted hover:text-primary"><Linkedin className="h-4 w-4" /></a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
