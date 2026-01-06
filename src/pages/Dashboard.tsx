import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { auth, db } from "../firebase/config";
import { getLeaderboard } from "../firebase/api";

export default function Dashboard() {
  const [coins, setCoins] = useState(0);
  const [leaders, setLeaders] = useState<any[]>([]);
  const user = auth.currentUser;

  useEffect(() => {
    if (!user) return;
    const unsub = onSnapshot(doc(db, "users", user.uid), (d) => {
      setCoins(d.data()?.walletBalance || 0);
    });
    
    getLeaderboard().then(setLeaders);
    return () => unsub();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Welcome back!</h1>
          <p className="text-gray-600">Track your engagement and see your standing</p>
        </div>

        {/* Wallet Balance Card */}
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl shadow-xl p-8 mb-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium mb-2">Your Balance</p>
              <div className="flex items-baseline space-x-2">
                <span className="text-5xl font-bold">{coins}</span>
                <span className="text-2xl">🪙</span>
              </div>
              <p className="text-blue-100 mt-2">Club Coins</p>
            </div>
            <div className="hidden md:block">
              <div className="bg-white/20 rounded-full p-6">
                <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Leaderboard Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
          <div className="flex items-center space-x-3 mb-6">
            <div className="bg-yellow-100 rounded-full p-3">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Leaderboard</h2>
          </div>
          
          {leaders.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p>No leaderboard data available yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">Rank</th>
                    <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">Name</th>
                    <th className="text-right py-4 px-4 text-sm font-semibold text-gray-700">Coins</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {leaders.map((l, i) => (
                    <tr key={l.id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-3">
                          {i === 0 && <span className="text-yellow-500 text-xl">🥇</span>}
                          {i === 1 && <span className="text-gray-400 text-xl">🥈</span>}
                          {i === 2 && <span className="text-orange-500 text-xl">🥉</span>}
                          {i > 2 && <span className="text-gray-400 font-semibold">#{i + 1}</span>}
                        </div>
                      </td>
                      <td className="py-4 px-4 font-medium text-gray-900">{l.name}</td>
                      <td className="py-4 px-4 text-right font-semibold text-blue-600">{l.walletBalance} 🪙</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
