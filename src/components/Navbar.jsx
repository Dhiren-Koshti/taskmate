import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Menu, X, LogIn, UserPlus, LogOut, Flame, LayoutDashboard } from "lucide-react";
import ConfirmModal from "./ConfirmModal";

export default function Navbar({ token, handleLogout }) {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const confirmLogout = () => { handleLogout(); setShowLogoutModal(false); setIsMobileMenuOpen(false); navigate("/login"); };
  const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMenu = () => setIsMobileMenuOpen(false);

  const isActive = (path) => location.pathname === path;

  const NavLink = ({ to, children, icon: Icon }) => (
    <Link to={to} className={`px-3 py-2 text-sm transition-colors duration-200 flex items-center gap-1.5 relative ${isActive(to) ? "text-primary font-semibold" : "text-body hover:text-primary"}`}>
      {Icon && <Icon className="h-4 w-4" />}
      {children}
      {isActive(to) && <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-primary rounded-full" />}
    </Link>
  );

  return (
    <>
      <nav className="bg-[rgba(12,10,8,0.85)] backdrop-blur-xl border-b border-border sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center gap-2.5 group" onClick={closeMenu}>
              <div className="btn-primary !p-2 !rounded-xl !px-2">
                <Flame className="h-4 w-4 text-white" />
              </div>
              <span className="text-base font-bold text-heading tracking-tight">
                Task<span className="text-primary">Mate</span>
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-1">
              <NavLink to="/">Home</NavLink>
              <NavLink to="/tasks">Tasks</NavLink>
              <NavLink to="/about">About</NavLink>
              {token && <NavLink to="/dashboard" icon={LayoutDashboard}>Dashboard</NavLink>}
              <NavLink to="/contact">Contact</NavLink>
            </div>

            <div className="hidden md:flex items-center gap-3">
              {!token ? (
                <>
                  <Link to="/login" className="px-4 py-2 text-sm text-body hover:text-primary font-medium transition-colors duration-200">Login</Link>
                  <Link to="/signup" className="btn-primary text-sm">Sign Up</Link>
                </>
              ) : (
                <button onClick={() => setShowLogoutModal(true)} className="px-4 py-2 text-sm text-danger hover:bg-[rgba(244,63,94,0.08)] rounded-btn font-medium transition-all duration-200">Logout</button>
              )}
            </div>

            <button onClick={toggleMenu} className="md:hidden icon-btn text-body hover:text-primary">
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden bg-surface border-t border-border absolute w-full left-0" style={{ boxShadow: '0 24px 64px rgba(0,0,0,0.7)' }}>
            {[
              { to: "/", label: "Home" },
              { to: "/tasks", label: "Tasks" },
              { to: "/about", label: "About" },
              ...(token ? [{ to: "/dashboard", label: "Dashboard" }] : []),
              { to: "/contact", label: "Contact" },
            ].map(({ to, label }) => (
              <Link key={to} to={to} onClick={closeMenu} className={`block px-6 py-3.5 text-sm border-b border-border transition-colors duration-200 ${isActive(to) ? "text-primary font-semibold border-l-2 border-l-primary" : "text-body hover:text-primary"}`}>
                {label}
              </Link>
            ))}
            <div className="p-4 space-y-2">
              {!token ? (
                <>
                  <Link to="/login" onClick={closeMenu} className="block text-center py-2.5 text-body font-medium text-sm">Login</Link>
                  <Link to="/signup" onClick={closeMenu} className="block text-center btn-primary text-sm">Sign Up</Link>
                </>
              ) : (
                <button onClick={() => { setShowLogoutModal(true); closeMenu(); }} className="w-full text-center py-2.5 text-danger hover:bg-[rgba(244,63,94,0.08)] rounded-btn font-medium text-sm transition-all duration-200">Logout</button>
              )}
            </div>
          </div>
        )}
      </nav>
      <ConfirmModal show={showLogoutModal} onClose={() => setShowLogoutModal(false)} onConfirm={confirmLogout} message="Are you sure you want to logout?" />
    </>
  );
}
