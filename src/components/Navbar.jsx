import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { auth } from "../firebase/config";

export default function Navbar() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  return (
    <nav className="bg-slate-900 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <img 
              src="/assets/logo.png" 
              alt="Finance and Consulting Club Logo" 
              className="h-8 md:h-10 w-auto"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
            <span className="text-lg md:text-xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
              Finance & Consulting Club
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-gray-300 hover:text-white transition-colors font-medium">Home</Link>
            <a href="/#mudra" className="text-gray-300 hover:text-white transition-colors font-medium">Mudra</a>
            <a href="/#non-core-week" className="text-gray-300 hover:text-white transition-colors font-medium">Non-Core Week</a>
            <Link to="/earn" className="text-gray-300 hover:text-white transition-colors font-medium">Earn</Link>
            <a href="/#sponsors" className="text-gray-300 hover:text-white transition-colors font-medium">Sponsors</a>
            <a href="/#team" className="text-gray-300 hover:text-white transition-colors font-medium">Team</a>
            <button onClick={() => { auth.signOut(); navigate("/"); }} className="ml-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium">Logout</button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setOpen(!open)} aria-expanded={open} className="p-2 rounded-md text-gray-200 hover:bg-slate-800">
              {open ? (
                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div className="md:hidden bg-slate-900 border-t border-slate-800">
          <div className="px-4 py-3 space-y-2">
            <Link to="/" onClick={() => setOpen(false)} className="block text-gray-300 hover:text-white">Home</Link>
            <a href="/#mudra" onClick={() => setOpen(false)} className="block text-gray-300 hover:text-white">Mudra</a>
            <a href="/#non-core-week" onClick={() => setOpen(false)} className="block text-gray-300 hover:text-white">Non-Core Week</a>
            <Link to="/earn" onClick={() => setOpen(false)} className="block text-gray-300 hover:text-white">Earn</Link>
            <a href="/#sponsors" onClick={() => setOpen(false)} className="block text-gray-300 hover:text-white">Sponsors</a>
            <a href="/#team" onClick={() => setOpen(false)} className="block text-gray-300 hover:text-white">Team</a>
            <button onClick={() => { auth.signOut(); navigate("/"); }} className="w-full text-left px-0 mt-2 bg-red-600 hover:bg-red-700 text-white rounded-md py-2">Logout</button>
          </div>
        </div>
      )}
    </nav>
  );
}
