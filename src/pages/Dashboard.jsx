import { useEffect, useState, useRef } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { auth, db } from "../firebase/config";
import { Link } from "react-router-dom";
import TiltCard from "../components/TiltCard";

export default function Dashboard() {
  const [coins, setCoins] = useState(0);
  const [userName, setUserName] = useState("");
  const user = auth.currentUser;
  const heroRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
  if (!user) return;

  const unsub = onSnapshot(doc(db, "users", user.uid), (d) => {
    if (d.exists()) {
      setUserName(d.data().name); // or username, displayName, etc.
      setCoins(d.data().walletBalance);
    }
  });

  return () => unsub();
}, [user]);


  useEffect(() => {
    const handleMouseMove = (e) => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        setMousePosition({ x: x * 20, y: y * 20 });
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 relative overflow-hidden -mt-20 pt-20">
      {/* Ambient background gradient blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section with Parallax */}
        <div 
          ref={heroRef}
          className="mb-16 text-center animate-in fade-in slide-in-from-top duration-700"
        >
          <div className="inline-block mb-6 relative">
            <div 
              className="parallax-layer"
              style={{
                transform: `translate(${mousePosition.x* 0.5}px, ${mousePosition.y* 0.25}px)`,
              }}
            >
              <h1 className="text-5xl md:text-6xl font-black text-transparent bg-gradient-to-r from-emerald-400 via-blue-500 to-purple-600 bg-clip-text mb-4">
                Welcome, {userName}
              </h1>
            </div>
            <div 
              className="parallax-layer mt-4"
              style={{
                transform: `translate(${mousePosition.x * 0.5}px, ${mousePosition.y * 0.25}px)`,
              }}
            >
              <p className="text-2xl text-slate-400 font-medium">
                Analyse. Bridge. Consult.
              </p>
            </div>
          </div>

          {/* Floating decorative elements */}
          <div className="absolute top-1/4 right-1/4 w-20 h-20 opacity-20">
            <svg 
              viewBox="0 0 100 100" 
              className="text-emerald-400"
              style={{
                transform: `translate(${mousePosition.x * -0.7}px, ${mousePosition.y * -0.8}px)`,
              }}
            >
              <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="2" fill="none" />
            </svg>
          </div>
          <div className="absolute bottom-1/3 left-1/4 w-16 h-16 opacity-20">
            <svg 
              viewBox="0 0 100 100" 
              className="text-blue-400"
              style={{
                transform: `translate(${mousePosition.x * 0.7}px, ${mousePosition.y * 1.3}px)`,
              }}
            >
              <rect x="20" y="20" width="60" height="60" stroke="currentColor" strokeWidth="2" fill="none" />
            </svg>
          </div>
        </div>

        {/* Bento Grid Layout */}
        <div className="bento-grid">
          {/* Vault - Large Card */}
          <TiltCard className="bento-span-8 animate-in fade-in slide-in-from-bottom duration-700 delay-100">
            <div className="glass-card rounded-3xl p-8 md:p-12 h-full backdrop-blur-2xl bg-gradient-to-br from-emerald-500/20 to-blue-500/20 border border-white/10 hover:border-emerald-400/30 transition-all duration-300 shadow-2xl">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between h-full">
                <div className="mb-6 md:mb-0">
                  <div className="inline-flex items-center space-x-2 px-3 py-1 bg-emerald-500/20 rounded-full border border-emerald-400/40 mb-4">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                    <span className="text-xs font-semibold text-emerald-300">VAULT ACTIVE</span>
                  </div>
                  <p className="text-slate-400 text-sm font-medium mb-2">Your Balance</p>
                  <div className="flex items-baseline space-x-3 mb-2">
                    <span className="text-8xl font-black text-transparent bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text">
                      {coins}
                    </span>
                    <span className="text-4xl">🪙</span>
                  </div>
                  <p className="text-slate-500 text-lg font-medium">FCC Coins</p>
                  <Link 
                    to="/earn" 
                    className="hoverable inline-block mt-6 px-8 py-4 liquid-glass-btn bg-gradient-to-r from-emerald-500/80 to-blue-500/80 border border-emerald-400/30 rounded-2xl text-white font-bold text-lg shadow-lg shadow-emerald-500/20"
                  >
                    Earn More Coins →
                  </Link>
                </div>
                <div className="hidden lg:block">
                  <div className="relative">
                    <div className="w-48 h-48 rounded-full bg-gradient-to-br from-emerald-500/20 to-blue-500/20 flex items-center justify-center backdrop-blur-xl border border-white/10">
                      <svg className="w-24 h-24 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-emerald-400 rounded-full animate-ping"></div>
                  </div>
                </div>
              </div>
            </div>
          </TiltCard>

          {/* Quick Stats */}
          <TiltCard className="bento-span-4">
            <Link to="/leaderboard" className="hoverable block h-full">
              <div className="glass-card rounded-3xl p-8 h-full backdrop-blur-2xl bg-slate-900/40 border border-white/10 hover:border-amber-400/30 transition-all duration-300 shadow-xl">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="bg-gradient-to-br from-amber-400 to-yellow-500 p-3 rounded-2xl shadow-lg shadow-amber-500/30">
                    <svg className="w-6 h-6 text-slate-950" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-white">Hall of Merit</h3>
                </div>
                <p className="text-slate-400 mb-6">Check your rank among elite performers</p>
                <div className="flex items-center space-x-2 text-amber-400 font-semibold">
                  <span>View Leaderboard</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
              </div>
            </Link>
          </TiltCard>

          {/* Core Pillars - Analyse */}
          <TiltCard className="bento-span-4">
                  <div className="rounded-3xl p-8 h-full bg-slate-900/40 border border-white/10 hover:border-blue-400/60 transition-colors duration-200">
                    
                    <div className="mb-4">
                      <div className="w-14 h-14 rounded-2xl bg-blue-500/20 flex items-center justify-center border border-blue-400/20">
                        {/* icon */}
                        <svg className="w-7 h-7 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokelinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                      </div>
                    </div>

                    <h3 className="text-2xl font-bold text-white mb-2">Analyse</h3>
                    <p className="text-slate-400">
                      Deep-dive into data analytics and financial modeling
                    </p>
                  </div>
          </TiltCard>
          {/* Core Pillars - Bridge */}
          <TiltCard className="bento-span-4">
            <div className="rounded-3xl p-8 h-full bg-slate-900/40 border border-white/10 hover:border-blue-400/60 transition-colors duration-200">
              <div className="mb-4">
                <div className="w-14 h-14 rounded-2xl bg-blue-500/20 flex items-center justify-center border border-blue-400/20">
                  <svg className="w-7 h-7 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857
                      M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857
                      m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0
                      zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Bridge</h3>
                <p className="text-slate-400">
                  Connect with industry leaders and build networks
                </p>
              </div>
            </div>
          </TiltCard>

          {/* Core Pillars - Consult */}
          <TiltCard className="bento-span-4">
            <div className="rounded-3xl p-8 h-full bg-slate-900/40 border border-white/10 hover:border-emerald-400/60 transition-colors duration-200">
              <div className="mb-4">
                <div className="w-14 h-14 rounded-2xl bg-blue-500/20 flex items-center justify-center border border-blue-400/20">
                  <svg className="w-7 h-7 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707
                      M21 12h-1M4 12H3m3.343-5.657l-.707-.707
                      m2.828 9.9a5 5 0 117.072 0l-.548.547
                      A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0
                      v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Consult</h3>
                <p className="text-slate-400">
                  Strategic problem-solving and case expertise
                </p>
              </div>
            </div>
          </TiltCard>


          {/* Call to Action */}
          <TiltCard className="bento-span-6">
            <Link to="/store" className="hoverable block h-full">
              <div className="glass-card rounded-3xl p-8 h-full backdrop-blur-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-400/30 hover:border-purple-400/50 transition-all duration-300 shadow-xl">
                <div className="flex items-center justify-between h-full">
                  <div>
                    <h3 className="text-3xl font-black text-white mb-3">Rewards Store</h3>
                    <p className="text-purple-200 text-lg mb-6">Exchange your coins for exclusive perks</p>
                    <div className="flex items-center space-x-2 text-purple-300 font-semibold">
                      <span>Browse Rewards</span>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </div>
                  </div>
                  <div className="hidden md:block">
                    <div className="w-24 h-24 rounded-full bg-purple-500/30 flex items-center justify-center backdrop-blur-xl border border-purple-400/30">
                      <svg className="w-12 h-12 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </TiltCard>

          {/* Profile Quick Access */}
          <TiltCard className="bento-span-6">
            <Link to="/profile" className="hoverable block h-full">
              <div className="glass-card rounded-3xl p-8 h-full backdrop-blur-2xl bg-slate-900/40 border border-white/10 hover:border-blue-400/30 transition-all duration-300 shadow-xl">
                <div className="flex items-center justify-between h-full">
                  <div>
                    <h3 className="text-3xl font-black text-white mb-3">Your Profile</h3>
                    <p className="text-slate-400 text-lg mb-6">Manage your account and achievements</p>
                    <div className="flex items-center space-x-2 text-blue-400 font-semibold">
                      <span>View Profile</span>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </div>
                  </div>
                  <div className="hidden md:block">
                    <div className="w-24 h-24 rounded-full bg-blue-500/20 flex items-center justify-center backdrop-blur-xl border border-blue-400/20">
                      <svg className="w-12 h-12 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </TiltCard>
        </div>
      </div>
    </div>
  );
}
