import { useState } from "react";
import { claimEventCode } from "../firebase/api";

export default function Earn({ user }) {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const handleClaim = async () => {
    if (!code.trim()) {
      alert("Please enter an event code");
      return;
    }
    setLoading(true);
    const res = await claimEventCode(user.uid, code);
    if (res.success) {
      alert(`Success! Earned ${res.points} coins.`);
      setCode("");
    } else {
      alert(res.error);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Earn Coins</h1>
          <p className="text-gray-600">Claim rewards from events you've attended</p>
        </div>

        {/* Earn Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10">
          <div className="max-w-md mx-auto">
            <div className="text-center mb-8">
              <div className="bg-gradient-to-br from-green-500 to-blue-500 rounded-full p-6 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Claim Event Code</h2>
              <p className="text-gray-600">
                Attended an event? Enter the secret code shared by the host to earn coins.
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <label htmlFor="eventCode" className="block text-sm font-medium text-gray-700 mb-2">
                  Event Code
                </label>
                <input 
                  id="eventCode"
                  type="text"
                  placeholder="Enter Event Code (e.g. HACK2025)"
                  value={code}
                  onChange={e => setCode(e.target.value.toUpperCase())}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none text-center text-lg font-semibold tracking-wider uppercase"
                  disabled={loading}
                />
              </div>

              <button 
                onClick={handleClaim}
                disabled={loading || !code.trim()}
                className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white font-semibold py-4 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl text-lg"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  "Claim Points"
                )}
              </button>
            </div>

            {/* Info Box */}
            <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-blue-700">
                    <strong>Note:</strong> Event codes are case-insensitive and are shared by event hosts during or after events.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
