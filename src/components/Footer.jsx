import React from "react";
import { Github, Twitter, Instagram, Linkedin, Send } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-surface border-t border-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-heading">Task<span className="text-primary">Mate</span></h3>
            <p className="text-sm text-muted leading-relaxed">Your ultimate companion for productivity. Simple, fast, and warm.</p>
          </div>
          <div className="space-y-3">
            <h3 className="label !mb-3">Navigate</h3>
            <ul className="space-y-2.5 text-sm">
              {["/", "/tasks", "/about", "/contact"].map((to) => (
                <li key={to}><Link to={to} className="text-body hover:text-primary transition-colors duration-200">{to === "/" ? "Home" : to.slice(1).charAt(0).toUpperCase() + to.slice(2)}</Link></li>
              ))}
            </ul>
          </div>
          <div className="space-y-3">
            <h3 className="label !mb-3">Social</h3>
            <div className="flex space-x-2">
              {[Github, Twitter, Instagram, Linkedin].map((Icon, i) => (
                <a key={i} href="#" className="p-2.5 rounded-btn border border-border text-muted hover:text-primary hover:border-primary/30 icon-btn transition-all duration-200">
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
          <div className="space-y-3">
            <h3 className="label !mb-3">Newsletter</h3>
            <form className="flex gap-2">
              <input type="email" placeholder="you@email.com" required className="input-field flex-1" />
              <button type="submit" className="btn-primary !px-3" aria-label="Subscribe"><Send className="h-4 w-4" /></button>
            </form>
          </div>
        </div>
        <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-muted">
          <p>&copy; {new Date().getFullYear()} TaskMate. All rights reserved.</p>
          <ul className="flex space-x-6 mt-3 md:mt-0">
            <li><a href="#" className="hover:text-primary transition-colors duration-200">Privacy</a></li>
            <li><a href="#" className="hover:text-primary transition-colors duration-200">Terms</a></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
