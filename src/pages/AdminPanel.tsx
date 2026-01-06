import { useState, useEffect } from "react";
import { createEvent, addCoinsToUser, getAllRedemptions, updateRedemptionStatus, getAllEvents, deleteEvent } from "../firebase/api";

export default function AdminPanel() {
  const [form, setForm] = useState({ title: "", code: "", points: "" });
  const [loading, setLoading] = useState(false);
  const [coinsForm, setCoinsForm] = useState({ userId: "", amount: "" });
  const [redemptions, setRedemptions] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [loadingRedemptions, setLoadingRedemptions] = useState(false);
  const [loadingEvents, setLoadingEvents] = useState(false);

  const handleCreate = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    const res = await createEvent(form.title, form.code, Number(form.points));
    if (res.success) {
      alert("Event Created!");
      setForm({ title: "", code: "", points: "" });
    } else {
      alert(res.error);
    }
    setLoading(false);
  };

  const fetchRedemptions = async () => {
    setLoadingRedemptions(true);
    try {
      const items = await getAllRedemptions();
      setRedemptions(items as any[]);
    } finally {
      setLoadingRedemptions(false);
    }
  };

  const fetchEvents = async () => {
    setLoadingEvents(true);
    try {
      const items = await getAllEvents();
      setEvents(items as any[]);
    } finally {
      setLoadingEvents(false);
    }
  };

  useEffect(() => {
    fetchRedemptions();
    fetchEvents();
  }, []);

  const handleAddCoins = async (e: any) => {
    e.preventDefault();
    if (!coinsForm.userId || !coinsForm.amount) return alert("Enter user id and amount");
    const amt = Number(coinsForm.amount);
    if (isNaN(amt) || amt === 0) return alert("Enter a valid non-zero amount");
    const res = await addCoinsToUser(coinsForm.userId.trim(), amt, "Admin credit");
    if (res.success) {
      alert("Balance updated.");
      setCoinsForm({ userId: "", amount: "" });
      fetchRedemptions();
    } else alert(res.error);
  };

  const handleChangeStatus = async (id: string, status: string) => {
    const res = await updateRedemptionStatus(id, status);
    if (res.success) {
      fetchRedemptions();
    } else alert(res.error);
  };

  const handleDeleteEvent = async (id: string) => {
    if (!confirm("Delete this event/coupon? This cannot be undone.")) return;
    const res = await deleteEvent(id);
    if (res.success) {
      alert("Deleted.");
      fetchEvents();
    } else alert(res.error);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-red-100 rounded-full p-3">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Admin Panel</h1>
              <p className="text-gray-600">Manage events and club activities</p>
            </div>
          </div>
        </div>
        {/* Admin Actions: Add Coins */}
        <div className="mt-6 bg-white rounded-2xl shadow p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-3">Add Coins to User</h3>
          <form onSubmit={handleAddCoins} className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
            <div className="md:col-span-2">
              <label className="block text-sm text-gray-700 mb-1">User ID</label>
              <input value={coinsForm.userId} onChange={e => setCoinsForm({...coinsForm, userId: e.target.value})} className="w-full px-3 py-2 border rounded" placeholder="Enter Firebase UID" />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">Amount</label>
              <input value={coinsForm.amount} onChange={e => setCoinsForm({...coinsForm, amount: e.target.value})} className="w-full px-3 py-2 border rounded" placeholder="e.g. 100" />
            </div>
            <div className="md:col-span-3">
              <button type="submit" className="mt-2 bg-green-600 text-white px-4 py-2 rounded">Add Coins</button>
            </div>
          </form>
        </div>

        {/* Redemptions Management */}
        <div className="mt-6 bg-white rounded-2xl shadow p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-3">All Purchases / Redemptions</h3>
          {loadingRedemptions ? (
            <div className="text-sm text-gray-500">Loading...</div>
          ) : (
            <div className="space-y-3">
              {redemptions.length === 0 && <div className="text-sm text-gray-500">No purchases yet.</div>}
              {redemptions.map(r => (
                <div key={r.id} className="border rounded p-3 flex items-center justify-between">
                  <div>
                    <div className="text-sm text-gray-500">ID: <span className="font-mono">{r.id}</span></div>
                    <div className="font-semibold">{r.item} — {r.userName || r.userId}</div>
                    <div className="text-sm text-gray-600">Cost: {r.cost} 🪙</div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <select value={r.status || 'pending'} onChange={e => handleChangeStatus(r.id, e.target.value)} className="px-2 py-1 border rounded">
                      <option value="pending">pending</option>
                      <option value="ready">ready</option>
                      <option value="collected">collected</option>
                      <option value="cancelled">cancelled</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Events / Coupons Management */}
        <div className="mt-6 bg-white rounded-2xl shadow p-6 mb-12">
          <h3 className="text-xl font-semibold text-gray-900 mb-3">Live Coupons / Events</h3>
          {loadingEvents ? (
            <div className="text-sm text-gray-500">Loading...</div>
          ) : (
            <div className="space-y-3">
              {events.length === 0 && <div className="text-sm text-gray-500">No live coupons.</div>}
              {events.map(ev => (
                <div key={ev.id} className="border rounded p-3 flex items-center justify-between">
                  <div>
                    <div className="font-semibold">{ev.title}</div>
                    <div className="text-sm text-gray-600">Code: <span className="font-mono">{ev.secretCode}</span> • Points: {ev.points}</div>
                    <div className="text-xs text-gray-500">Attendees: {(ev.attendees || []).length}</div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button onClick={() => handleDeleteEvent(ev.id)} className="px-3 py-1 bg-red-600 text-white rounded">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Create Event Card */}
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Create New Event</h2>
            <p className="text-gray-600">Generate event codes for member participation</p>
          </div>

          <form onSubmit={handleCreate} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Event Title
              </label>
              <input 
                id="title"
                type="text"
                placeholder="Enter event title (e.g. Finance Workshop 2025)"
                value={form.title}
                onChange={e => setForm({...form, title: e.target.value})}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                required
              />
            </div>

            <div>
              <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-2">
                Secret Code
              </label>
              <input 
                id="code"
                type="text"
                placeholder="Enter secret code (e.g. FIN2025)"
                value={form.code}
                onChange={e => setForm({...form, code: e.target.value.toUpperCase()})}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none font-mono uppercase tracking-wider"
                required
              />
              <p className="mt-2 text-sm text-gray-500">
                This code will be shared with event attendees to claim coins
              </p>
            </div>

            <div>
              <label htmlFor="points" className="block text-sm font-medium text-gray-700 mb-2">
                Points (Coins)
              </label>
              <input 
                id="points"
                type="number"
                placeholder="Enter points (e.g. 100)"
                value={form.points}
                onChange={e => setForm({...form, points: e.target.value})}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                min="1"
                required
              />
              <p className="mt-2 text-sm text-gray-500">
                Number of coins members will earn when they claim this event code
              </p>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl text-lg"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating Event...
                </span>
              ) : (
                "Create Event"
              )}
            </button>
          </form>
        </div>

        {/* Info Box */}
        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-2xl p-6">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <svg className="h-6 w-6 text-yellow-600 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-yellow-900 mb-2">Admin Guidelines</h3>
              <ul className="text-yellow-800 text-sm space-y-1 list-disc list-inside">
                <li>Share the event code with attendees during or after the event</li>
                <li>Ensure codes are unique and memorable</li>
                <li>Points should reflect the event's value and duration</li>
                <li>Event codes are case-insensitive</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
