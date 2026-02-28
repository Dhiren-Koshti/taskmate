import React from "react";
import { Link } from "react-router-dom";
import { Home } from "lucide-react";

export default function ErrorPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-8xl font-bold text-primary mb-4" style={{ textShadow: '0 0 40px rgba(249,115,22,0.3)' }}>404</h1>
        <h2 className="text-xl font-bold text-heading mb-2">Page not found</h2>
        <p className="text-muted text-sm mb-8 max-w-sm mx-auto">The page you're looking for doesn't exist or has been moved.</p>
        <Link to="/" className="btn-primary inline-flex items-center gap-2 text-sm">
          <Home className="h-4 w-4" /> Go home
        </Link>
      </div>
    </div>
  );
}
