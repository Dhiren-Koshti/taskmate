import React from "react";
import { Mail, MapPin, Phone, Send } from "lucide-react";

export default function Contact() {
  return (
    <div className="min-h-screen pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold text-heading">Get in touch</h2>
          <p className="text-muted text-sm mt-1.5">We'd love to hear from you</p>
        </div>
        <div className="grid md:grid-cols-5 gap-6">
          {/* Info */}
          <div className="md:col-span-2 space-y-4">
            {[
              { icon: Mail, label: "Email", value: "hello@taskmate.app" },
              { icon: MapPin, label: "Location", value: "Remote-first team" },
              { icon: Phone, label: "Phone", value: "+1 (555) 000-0000" },
            ].map((item, i) => (
              <div key={i} className="card p-4 flex items-center gap-4">
                <div className="btn-primary !p-2.5 !rounded-xl !px-2.5">
                  <item.icon className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="text-[10px] font-semibold text-muted uppercase tracking-widest">{item.label}</p>
                  <p className="text-heading text-sm mt-0.5">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
          {/* Form */}
          <div className="md:col-span-3 card p-6">
            <form className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Name</label>
                  <input type="text" placeholder="Your name" className="input-field" required />
                </div>
                <div>
                  <label className="label">Email</label>
                  <input type="email" placeholder="you@email.com" className="input-field" required />
                </div>
              </div>
              <div>
                <label className="label">Subject</label>
                <input type="text" placeholder="What's this about?" className="input-field" />
              </div>
              <div>
                <label className="label">Message</label>
                <textarea rows="4" placeholder="Your message..." className="input-field resize-none" required></textarea>
              </div>
              <button type="submit" className="btn-primary text-sm flex items-center gap-2"><Send className="h-4 w-4" /> Send message</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
