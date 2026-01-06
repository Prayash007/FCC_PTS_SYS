// src/pages/Profile.tsx
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase/config";
import { sendVerificationLink, getUserTransactions } from "../firebase/api";

export default function Profile() {
  const [authUser, setAuthUser] = useState<any>(null);
  const [userData, setUserData] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Reload user to check if they clicked the link recently
    const currentUser = auth.currentUser;
    if (!currentUser) {
      setLoading(false);
      return;
    }

    currentUser.reload().then(() => {
      setAuthUser(auth.currentUser);
      
      // Fetch user document from Firestore
      const fetchUserData = async () => {
        try {
          console.log("Fetching data for userId:", currentUser.uid);
          const userDoc = await getDoc(doc(db, "users", currentUser.uid));
          if (userDoc.exists()) {
            setUserData(userDoc.data());
          }
          
          // Fetch transactions
          const txns = await getUserTransactions(currentUser.uid);
          console.log("Fetched transactions:", txns.length, txns);
          if (txns.length === 0) {
            console.warn("No transactions found. Check if transactions exist in Firestore with userId:", currentUser.uid);
          }
          setTransactions(txns);
        } catch (error) {
          console.error("Error fetching user data:", error);
        } finally {
          setLoading(false);
        }
      };
      
      fetchUserData();
    });
  }, []);

  const handleResend = async () => {
    if (authUser) {
      await sendVerificationLink(authUser);
      alert("Link resent!");
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return "N/A";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleString();
  };

  const formatAmount = (amount: number) => {
    if (amount > 0) {
      return `+${amount}`;
    }
    return `${amount}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!authUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          <p className="text-gray-600">Please log in to view your profile.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">My Profile</h1>
          <p className="text-gray-600">Manage your account and view your activity</p>
        </div>

        {/* Profile Information Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Account Information</h2>
          
          {userData && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">FCC_ID</label>
                <p className="text-lg font-semibold text-gray-900">{userData.uid || "N/A"}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Name</label>
                <p className="text-lg font-semibold text-gray-900">{userData.name || "N/A"}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Email</label>
                <p className="text-lg font-semibold text-gray-900">{authUser.email}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Roll Number</label>
                <p className="text-lg font-semibold text-gray-900">{userData.rollNo || "N/A"}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Wallet Balance</label>
                <p className="text-lg font-semibold text-blue-600">{userData.walletBalance || 0} 🪙</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Role</label>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                  {userData.role || "Member"}
                </span>
              </div>
            </div>
          )}
          
          {/* Email Verification Status */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Email Verification Status</label>
                {authUser.emailVerified ? (
                  <span className="inline-flex items-center text-green-600 font-semibold">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Verified
                  </span>
                ) : (
                  <span className="inline-flex items-center text-red-600 font-semibold">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    Unverified
                  </span>
                )}
              </div>
            </div>

            {!authUser.emailVerified && (
              <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800 mb-3">
                  Please verify your email to secure your account.
                </p>
                <button 
                  onClick={handleResend}
                  className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-colors font-medium text-sm"
                >
                  Resend Verification Link
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Transaction History Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Transaction History</h2>
          
          {transactions.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p>No transactions yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">Date/Time</th>
                    <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">Type</th>
                    <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">Description</th>
                    <th className="text-right py-4 px-4 text-sm font-semibold text-gray-700">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {transactions.map((txn) => (
                    <tr key={txn.id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-4 text-sm text-gray-600">{formatDate(txn.timestamp)}</td>
                      <td className="py-4 px-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {txn.type}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-900">{txn.description || "N/A"}</td>
                      <td className={`py-4 px-4 text-right font-semibold ${
                        txn.amount > 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {formatAmount(txn.amount)} 🪙
                      </td>
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
