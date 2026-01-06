import { useState } from "react";
import { registerUser } from "../firebase/api";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", pass: "", roll: "" });
  const navigate = useNavigate();

  const handleReg = async (e: any) => {
    e.preventDefault();
    const res = await registerUser(form.email, form.pass, form.name, form.roll);
    
    if (res.success) {
      alert("Account created! We sent a verification link to your email. Please click it before logging in.");
      navigate("/");
    } else {
      alert(res.error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <img 
              src="/assets/logo.png" 
              alt="Finance and Consulting Club Logo" 
              className="h-20 w-auto"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Finance & Consulting Club</h1>
          <p className="text-gray-400">Join Our Community</p>
        </div>

        {/* Register Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Create Account</h2>
          
          <form onSubmit={handleReg} className="space-y-5">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input 
                id="name"
                type="text"
                placeholder="Enter your full name"
                value={form.name}
                onChange={e => setForm({...form, name: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                required
              />
            </div>

            <div>
              <label htmlFor="roll" className="block text-sm font-medium text-gray-700 mb-2">
                Roll Number
              </label>
              <input 
                id="roll"
                type="text"
                placeholder="Enter your roll number"
                value={form.roll}
                onChange={e => setForm({...form, roll: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input 
                id="email"
                type="email"
                placeholder="Enter your email"
                value={form.email}
                onChange={e => setForm({...form, email: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input 
                id="password"
                type="password"
                placeholder="Create a password"
                value={form.pass}
                onChange={e => setForm({...form, pass: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                required
              />
            </div>

            <button 
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Sign Up
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200 text-center">
            <p className="text-sm text-gray-600">
              Already a member?{" "}
              <Link to="/" className="text-blue-600 hover:text-blue-700 font-semibold transition-colors">
                Login
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-gray-400 text-sm mt-6">
          © 2025 Finance & Consulting Club. All rights reserved.
        </p>
      </div>
    </div>
  );
}
