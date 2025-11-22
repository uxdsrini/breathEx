
import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { UserStats } from '../types';

interface AuthContextType {
  currentUser: User | null;
  userStats: UserStats | null;
  loading: boolean;
  signup: (email: string, pass: string) => Promise<void>;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);

  // Sign up and create user document in Firestore
  const signup = async (email: string, pass: string) => {
    const result = await createUserWithEmailAndPassword(auth, email, pass);
    // Create user table entry with initial stats
    const initialStats: UserStats = {
      totalPoints: 0,
      totalMinutes: 0,
      totalSessions: 0,
      currentStreak: 0,
      longestStreak: 0,
      lastSessionDate: null,
      zenScore: 0,
      level: 1
    };

    await setDoc(doc(db, "users", result.user.uid), {
      email: result.user.email,
      uid: result.user.uid,
      createdAt: serverTimestamp(),
      stats: initialStats
    });
  };

  const login = async (email: string, pass: string) => {
    await signInWithEmailAndPassword(auth, email, pass);
  };

  const logout = async () => {
    await signOut(auth);
    setUserStats(null);
  };

  useEffect(() => {
    let unsubscribeStats: (() => void) | undefined;

    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      
      if (user) {
        // Subscribe to real-time stats updates
        const userDocRef = doc(db, "users", user.uid);
        unsubscribeStats = onSnapshot(userDocRef, (doc) => {
          if (doc.exists()) {
            const data = doc.data();
            if (data.stats) {
              setUserStats(data.stats as UserStats);
            }
          }
        });
      } else {
        setUserStats(null);
        if (unsubscribeStats) unsubscribeStats();
      }
      
      setLoading(false);
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeStats) unsubscribeStats();
    };
  }, []);

  const value = {
    currentUser,
    userStats,
    loading,
    signup,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
