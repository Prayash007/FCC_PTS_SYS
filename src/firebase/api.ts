import { 
  doc, setDoc, addDoc, collection, runTransaction, arrayUnion, 
  serverTimestamp, query, orderBy, limit, getDocs, where, updateDoc, deleteDoc
} from "firebase/firestore";
import {
  sendPasswordResetEmail,
  sendEmailVerification, 
  createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut 
} from "firebase/auth";
import { auth, db } from "./config";

// --- AUTH ---
export const registerUser = async (email: string, pass: string, name: string, roll: string) => {
  try {
    const userCred = await createUserWithEmailAndPassword(auth, email, pass);
    const user = userCred.user;
    
    await sendEmailVerification(user);
    
    // Give 20 Coin Bonus
    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      name, email, rollNo: roll,
      walletBalance: 20,
      role: "student",
      createdAt: serverTimestamp()
    });

    await addDoc(collection(db, "transactions"), {
      userId: user.uid,
      type: "BONUS",
      amount: 20,
      description: "Welcome Bonus",
      timestamp: serverTimestamp()
    });

    await signOut(auth);

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

export const loginUser = async (email: string, pass: string) => {
  try {
    const userCred = await signInWithEmailAndPassword(auth, email, pass);
    const user = userCred.user;
    
    // Check if email is verified
    if (!user.emailVerified) {
      await signOut(auth);
      return { success: false, error: "Please verify your email before logging in. Check your inbox for the verification link." };
    }
    
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// --- 2. PASSWORD RESET ---
export const resetPassword = async (email: string) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// --- 3. SEND VERIFICATION EMAIL ---
export const sendVerificationLink = async (user: any) => {
  try {
    await sendEmailVerification(user);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

export const logoutUser = () => signOut(auth);

// --- EARN ---
export const claimEventCode = async (userId: string, secretCode: string) => {
  try {
    const eventsRef = collection(db, "events");
    const q = query(eventsRef); 
    const querySnapshot = await getDocs(q);
    
    let targetEvent: any = null;
    let targetEventId = "";

    querySnapshot.forEach((doc) => {
      if (doc.data().secretCode === secretCode) {
        targetEvent = doc.data();
        targetEventId = doc.id;
      }
    });

    if (!targetEvent) return { success: false, error: "Invalid Code" };

    await runTransaction(db, async (transaction) => {
      const eventRef = doc(db, "events", targetEventId);
      const userRef = doc(db, "users", userId);
      const eventDoc = await transaction.get(eventRef);
      const userDoc = await transaction.get(userRef);

      if (!eventDoc.exists() || !userDoc.exists()) throw "Error finding data";
      if (eventDoc.data().attendees.includes(userId)) throw "Already Claimed!";

      transaction.update(eventRef, { attendees: arrayUnion(userId) });
      const newBalance = (userDoc.data().walletBalance || 0) + Number(targetEvent.points);
      transaction.update(userRef, { walletBalance: newBalance });

      const newTxnRef = doc(collection(db, "transactions"));
      transaction.set(newTxnRef, {
        userId: userId,
        type: "EARN",
        amount: Number(targetEvent.points),
        description: `Event: ${targetEvent.title}`,
        timestamp: serverTimestamp()
      });
    });

    return { success: true, points: targetEvent.points };
  } catch (error: any) {
    return { success: false, error: error.message || error };
  }
};

// --- REDEEM ---
export const redeemItem = async (userId: string, itemName: string, cost: number) => {
  const userRef = doc(db, "users", userId);
  try {
    await runTransaction(db, async (transaction) => {
      const userDoc = await transaction.get(userRef);
      if (!userDoc.exists()) throw "User not found";
      const current = userDoc.data().walletBalance || 0;
      if (current < cost) throw "Insufficient Coins!";

      transaction.update(userRef, { walletBalance: current - cost });
      
      const orderRef = doc(collection(db, "redemptions"));
      transaction.set(orderRef, {
        userId, userName: userDoc.data().name,
        item: itemName, cost, status: "pending",
        date: serverTimestamp()
      });

      const txnRef = doc(collection(db, "transactions"));
      transaction.set(txnRef, {
        userId, type: "SPENT", amount: -cost,
        description: `Bought ${itemName}`, timestamp: serverTimestamp()
      });
    });
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || error };
  }
};

// --- ADMIN ---
export const createEvent = async (title: string, code: string, points: number) => {
  try {
    await addDoc(collection(db, "events"), {
      title, secretCode: code, points: Number(points),
      attendees: [], createdAt: serverTimestamp()
    });
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

export const getLeaderboard = async () => {
  try {
    const q = query(collection(db, "users"), orderBy("walletBalance", "desc"), limit(10));
    const snap = await getDocs(q);
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (e) { console.error(e); return []; }
};

// --- USER REDEMPTIONS / ORDERS ---
export const getUserRedemptions = async (userId: string) => {
  try {
    const q = query(
      collection(db, "redemptions"),
      where("userId", "==", userId),
      orderBy("date", "desc")
    );
    const snap = await getDocs(q);
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (e: any) {
    if (e?.code === 'failed-precondition' || e?.message?.includes('index')) {
      try {
        const q = query(
          collection(db, "redemptions"),
          where("userId", "==", userId)
        );
        const snap = await getDocs(q);
        const items = snap.docs.map(doc => ({ id: doc.id, ...doc.data() })) as any[];
        return items.sort((a, b) => {
          const aTime = a.date?.toMillis?.() || a.date?.seconds || 0;
          const bTime = b.date?.toMillis?.() || b.date?.seconds || 0;
          return bTime - aTime;
        });
      } catch (fallbackError) {
        console.error("Fallback redemptions query failed:", fallbackError);
        return [];
      }
    }
    console.error("Error fetching redemptions:", e);
    return [];
  }
};

// --- USER TRANSACTIONS ---
export const getUserTransactions = async (userId: string) => {
  try {
    const q = query(
      collection(db, "transactions"),
      where("userId", "==", userId),
      orderBy("timestamp", "desc")
    );
    const snap = await getDocs(q);
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (e: any) { 
    
    if (e?.code === 'failed-precondition' || e?.message?.includes('index')) {
      console.warn("Firestore index required. Fetching without orderBy and sorting client-side.");
      try {
        const q = query(
          collection(db, "transactions"),
          where("userId", "==", userId)
        );
        const snap = await getDocs(q);
        const transactions = snap.docs.map(doc => ({ id: doc.id, ...doc.data() })) as any[];
        // Sort by timestamp descending client-side
        return transactions.sort((a, b) => {
          const aTime = a.timestamp?.toMillis?.() || a.timestamp?.seconds || 0;
          const bTime = b.timestamp?.toMillis?.() || b.timestamp?.seconds || 0;
          return bTime - aTime;
        });
      } catch (fallbackError) {
        console.error("Fallback query also failed:", fallbackError);
        return [];
      }
    }
    console.error("Error fetching transactions:", e); 
    return []; 
  }
};

// --- ADMIN HELPERS ---
export const addCoinsToUser = async (userId: string, amount: number, reason = "Admin Adjustment") => {
  const userRef = doc(db, "users", userId);
  try {
    await runTransaction(db, async (transaction) => {
      const userDoc = await transaction.get(userRef);
      if (!userDoc.exists()) throw "User not found";
      const current = userDoc.data().walletBalance || 0;
      transaction.update(userRef, { walletBalance: current + Number(amount) });

      const txnRef = doc(collection(db, "transactions"));
      transaction.set(txnRef, {
        userId,
        type: "ADMIN_ADJUST",
        amount: Number(amount),
        description: reason,
        timestamp: serverTimestamp()
      });
    });
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || error };
  }
};

export const getAllRedemptions = async () => {
  try {
    const q = query(collection(db, "redemptions"), orderBy("date", "desc"));
    const snap = await getDocs(q);
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (e: any) {
    // fallback without ordering
    try {
      const snap = await getDocs(collection(db, "redemptions"));
      const items = snap.docs.map(doc => ({ id: doc.id, ...doc.data() })) as any[];
      return items.sort((a, b) => {
        const aTime = a.date?.toMillis?.() || a.date?.seconds || 0;
        const bTime = b.date?.toMillis?.() || b.date?.seconds || 0;
        return bTime - aTime;
      });
    } catch (e2) {
      console.error("Error fetching all redemptions:", e2);
      return [];
    }
  }
};

export const updateRedemptionStatus = async (redemptionId: string, status: string) => {
  try {
    const rRef = doc(db, "redemptions", redemptionId);
    await updateDoc(rRef, { status });
    return { success: true };
  } catch (e: any) {
    return { success: false, error: e.message || e };
  }
};

export const getAllEvents = async () => {
  try {
    const q = query(collection(db, "events"), orderBy("createdAt", "desc"));
    const snap = await getDocs(q);
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (e: any) {
    console.error("Error fetching events:", e);
    try {
      const snap = await getDocs(collection(db, "events"));
      return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (e2) {
      console.error("Fallback events fetch failed:", e2);
      return [];
    }
  }
};

export const deleteEvent = async (eventId: string) => {
  try {
    await deleteDoc(doc(db, "events", eventId));
    return { success: true };
  } catch (e: any) {
    return { success: false, error: e.message || e };
  }
};