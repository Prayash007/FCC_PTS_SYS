import { useEffect, useState } from "react";
import { redeemItem, getUserRedemptions } from "../firebase/api";

const ITEMS = [
  { id: 1, name: "Laptop Sticker", cost: 50, icon: "💻" },
  { id: 2, name: "Club T-Shirt", cost: 500, icon: "👕" },
  { id: 3, name: "Workshop Pass", cost: 200, icon: "🎓" },
];

export default function Store({ user }) {
  const [redemptions, setRedemptions] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchRedemptions = async () => {
    if (!user?.uid) return;
    setLoading(true);
    try {
      const items = await getUserRedemptions(user.uid);
      setRedemptions(items);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRedemptions();
  }, [user?.uid]);

  const handleBuy = async (item) => {
    if (!confirm(`Buy ${item.name} for ${item.cost} coins?`)) return;
    const res = await redeemItem(user.uid, item.name, item.cost);
    if (res.success) {
      alert("Ordered! Pick up from club room.");
      await fetchRedemptions();
    } else alert(res.error);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Redeem Rewards</h1>
          <p className="text-gray-600">Exchange your coins for exclusive club merchandise and benefits</p>
        </div>

        {/* Store Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ITEMS.map(item => (
            <div 
              key={item.id} 
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
            >
              <div className="p-8 text-center">
                {/* Item Icon */}
                <div className="mb-6">
                  <div className="bg-gradient-to-br from-blue-100 to-green-100 rounded-full w-24 h-24 mx-auto flex items-center justify-center text-5xl group-hover:scale-110 transition-transform duration-300">
                    {item.icon}
                  </div>
                </div>

                {/* Item Name */}
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{item.name}</h3>

                {/* Price */}
                <div className="mb-6">
                  <div className="inline-flex items-baseline space-x-2">
                    <span className="text-4xl font-bold text-yellow-600">{item.cost}</span>
                    <span className="text-2xl">🪙</span>
                  </div>
                </div>

                {/* Redeem Button */}
                <button 
                  onClick={() => handleBuy(item)}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  Redeem Now
                </button>
              </div>

              {/* Hover Effect Border */}
              <div className="h-1 bg-gradient-to-r from-blue-600 to-green-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
            </div>
          ))}
        </div>

        {/* Info Box */}
        <div className="mt-12 bg-blue-50 border border-blue-200 rounded-2xl p-6 max-w-3xl mx-auto">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <svg className="h-6 w-6 text-blue-600 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-blue-900 mb-2">How it works</h3>
              <p className="text-blue-800 text-sm">
                Earn coins by attending club events and activities. Once you have enough coins, 
                redeem them for exclusive rewards! Pick up your redeemed items from the club room.
              </p>
            </div>
          </div>
        </div>

        {/* Order History */}
        <div className="mt-10 max-w-4xl mx-auto">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Order History</h2>
          <p className="text-sm text-gray-600 mb-4">
            If the team doesn't respond within 7 days, email your Purchase ID to 
            <a className="text-blue-600 hover:underline" href="mailto:club@example.edu"> club@example.edu</a>.
          </p>

          <div className="space-y-4">
            {loading && <div className="text-sm text-gray-500">Loading orders...</div>}
            {!loading && redemptions.length === 0 && (
              <div className="text-sm text-gray-500">No orders yet.</div>
            )}

            {redemptions.map((r) => {
              const date = r.date?.toDate ? r.date.toDate() : r.date?.toDate?.() || null;
              const formatted = date ? new Date(date).toLocaleString() : "-";

              const statusClass = (status) => {
                switch ((status || "").toLowerCase()) {
                  case "ready": return "bg-green-100 text-green-800";
                  case "collected": return "bg-gray-100 text-gray-800";
                  case "cancelled": return "bg-red-100 text-red-800";
                  default: return "bg-yellow-100 text-yellow-800";
                }
              };

              return (
                <div key={r.id} className="bg-white border rounded-lg p-4 flex items-center justify-between">
                  <div>
                    <div className="text-sm text-gray-500">Purchase ID: <span className="font-mono text-xs text-gray-700">{r.id}</span></div>
                    <div className="text-lg font-semibold text-gray-900">{r.item}</div>
                    <div className="text-sm text-gray-600">Cost: <span className="font-semibold text-yellow-600">{r.cost} 🪙</span></div>
                    <div className="text-xs text-gray-500">Ordered: {formatted}</div>
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${statusClass(r.status)}`}>{r.status || 'pending'}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
