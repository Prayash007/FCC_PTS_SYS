import { useEffect, useState } from "react";
import { getLeaderboard } from "../firebase/api";
import TiltCard from "../components/TiltCard";

export default function Leaderboard() {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getLeaderboard().then((data) => {
      setLeaders(data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Ambient background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-12 animate-in fade-in slide-in-from-bottom duration-700">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-gradient-to-br from-amber-400 to-yellow-500 p-4 rounded-2xl shadow-2xl shadow-amber-500/50">
              <svg className="w-12 h-12 text-slate-950" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
              </svg>
            </div>
          </div>
          <h1 className="text-6xl font-black text-transparent bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 bg-clip-text mb-3">
            Hall of Merit
          </h1>
          <p className="text-xl text-slate-400 font-medium">
            Elite performers in the FCC ecosystem
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 border-4 border-amber-400 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-slate-400 text-lg">Loading leaderboard...</p>
          </div>
        ) : leaders.length === 0 ? (
          <div className="text-center py-20">
            <div className="glass-card rounded-3xl p-12 backdrop-blur-2xl bg-slate-900/40 border border-white/10">
              <p className="text-slate-400 text-xl">No leaderboard data available yet.</p>
              <p className="text-slate-500 mt-2">Start earning coins to appear here!</p>
            </div>
          </div>
        ) : (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom duration-1000">
            {/* Top 3 Podium */}
            {leaders.length >= 3 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* 2nd Place */}
                <TiltCard className="md:order-1 md:mt-8">
                  <div className="glass-card rounded-3xl p-8 backdrop-blur-2xl bg-slate-900/40 border border-white/10 shadow-2xl hover:shadow-slate-400/20 transition-all duration-300">
                    <div className="text-center">
                      <div className="inline-block mb-4">
                        <span className="text-6xl animate-bounce">🥈</span>
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-2">{leaders[1].name}</h3>
                      <div className="flex items-center justify-center space-x-2 mb-4">
                        <span className="text-4xl font-black text-transparent bg-gradient-to-r from-slate-300 to-slate-500 bg-clip-text">
                          {leaders[1].walletBalance}
                        </span>
                        <span className="text-2xl">🪙</span>
                      </div>
                      <div className="inline-flex items-center space-x-2 px-4 py-2 bg-slate-800/50 rounded-full border border-slate-700/50">
                        <svg className="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-xs font-semibold text-slate-300">Verified</span>
                      </div>
                    </div>
                  </div>
                </TiltCard>

                {/* 1st Place */}
                <TiltCard className="md:order-2">
                  <div className="glass-card rounded-3xl p-8 backdrop-blur-2xl bg-gradient-to-br from-amber-500/20 to-yellow-500/20 border border-amber-400/30 shadow-2xl shadow-amber-500/30 hover:shadow-amber-500/50 transition-all duration-300">
                    <div className="text-center">
                      <div className="inline-block mb-4 relative">
                        <span className="text-7xl animate-bounce">🥇</span>
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-amber-400 rounded-full animate-ping"></div>
                      </div>
                      <div className="inline-flex items-center space-x-2 px-3 py-1 bg-amber-500/20 rounded-full border border-amber-400/40 mb-2">
                        <svg className="w-4 h-4 text-amber-400 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="text-xs font-bold text-amber-300">CHAMPION</span>
                      </div>
                      <h3 className="text-3xl font-black text-white mb-3">{leaders[0].name}</h3>
                      <div className="flex items-center justify-center space-x-2 mb-4">
                        <span className="text-5xl font-black text-transparent bg-gradient-to-r from-amber-300 to-yellow-400 bg-clip-text">
                          {leaders[0].walletBalance}
                        </span>
                        <span className="text-3xl">🪙</span>
                      </div>
                      <div className="inline-flex items-center space-x-2 px-4 py-2 bg-amber-500/30 rounded-full border border-amber-400/50">
                        <svg className="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-xs font-semibold text-amber-200">Elite Verified</span>
                      </div>
                    </div>
                  </div>
                </TiltCard>

                {/* 3rd Place */}
                <TiltCard className="md:order-3 md:mt-8">
                  <div className="glass-card rounded-3xl p-8 backdrop-blur-2xl bg-slate-900/40 border border-white/10 shadow-2xl hover:shadow-orange-400/20 transition-all duration-300">
                    <div className="text-center">
                      <div className="inline-block mb-4">
                        <span className="text-6xl animate-bounce delay-200">🥉</span>
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-2">{leaders[2].name}</h3>
                      <div className="flex items-center justify-center space-x-2 mb-4">
                        <span className="text-4xl font-black text-transparent bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text">
                          {leaders[2].walletBalance}
                        </span>
                        <span className="text-2xl">🪙</span>
                      </div>
                      <div className="inline-flex items-center space-x-2 px-4 py-2 bg-slate-800/50 rounded-full border border-slate-700/50">
                        <svg className="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-xs font-semibold text-slate-300">Verified</span>
                      </div>
                    </div>
                  </div>
                </TiltCard>
              </div>
            )}

            {/* Rest of the leaderboard */}
            {leaders.slice(3).map((leader, index) => (
              <TiltCard key={leader.id} intensity={10}>
                <div className="glass-card rounded-2xl p-6 backdrop-blur-2xl bg-slate-900/30 border border-white/5 hover:border-white/10 shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-slate-800/50 border border-slate-700/50">
                        <span className="text-lg font-bold text-slate-400">#{index + 4}</span>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white">{leader.name}</h3>
                        <div className="flex items-center space-x-2 mt-1">
                          <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                          <span className="text-xs text-slate-400">Active Member</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-2">
                        <span className="text-3xl font-black text-transparent bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text">
                          {leader.walletBalance}
                        </span>
                        <span className="text-xl">🪙</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">FCC Coins</p>
                    </div>
                  </div>
                </div>
              </TiltCard>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
