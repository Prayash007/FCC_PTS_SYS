import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "./firebase/config";
import { doc, getDoc } from "firebase/firestore";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Earn from "./pages/Earn";
import Store from "./pages/Store";
import AdminPanel from "./pages/AdminPanel";
import Leaderboard from "./pages/Leaderboard";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Profile from "./pages/profile";
import CustomCursor from "./components/CustomCursor";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const docRef = doc(db, "users", currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists() && docSnap.data().role === "admin") {
          setIsAdmin(true);
        }
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <img 
              src="/assets/logo.png" 
              alt="Finance and Consulting Club Logo" 
              className="h-24 w-auto animate-pulse"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </div>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-lg font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      {user && <CustomCursor />}
      {user && <Navbar />}
      <div className={user ? "pt-20" : ""}>
        <Routes>
          <Route path="/" element={!user ? <Login /> : <Navigate to="/dashboard" />} />
          <Route path="/register" element={!user ? <Register /> : <Navigate to="/dashboard" />} />
          
          <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/" />} />
          <Route path="/earn" element={user ? <Earn user={user}/> : <Navigate to="/" />} />
          <Route path="/store" element={user ? <Store user={user}/> : <Navigate to="/" />} />
          <Route path="/leaderboard" element={user ? <Leaderboard /> : <Navigate to="/" />} />
          <Route path="/profile" element={user ? <Profile /> : <Navigate to="/" />} />
          <Route path="/admin" element={isAdmin ? <AdminPanel /> : <Navigate to="/dashboard" />} />
        </Routes>
      </div>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
