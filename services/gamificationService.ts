
import { db } from '../firebase';
import { doc, runTransaction, collection, addDoc, serverTimestamp, getDocs, query, orderBy, limit, Timestamp } from 'firebase/firestore';
import { UserStats } from '../types';

export const calculatePoints = (durationSeconds: number): number => {
  // Base rate: 10 points per minute
  const minutes = durationSeconds / 60;
  const basePoints = Math.floor(minutes * 10);
  // Completion bonus
  const bonus = 20; 
  return basePoints + bonus;
};

export const calculateZenScore = (stats: UserStats): number => {
  // Algorithm for Health Prediction (Zen Score 0-100)
  // 1. Consistency (40%): Based on streak. Cap at 30 days.
  const consistencyScore = Math.min(stats.currentStreak / 30, 1) * 40;

  // 2. Experience (30%): Based on total minutes. Cap at 1000 minutes (approx 16 hours).
  const experienceScore = Math.min(stats.totalMinutes / 1000, 1) * 30;

  // 3. Dedication (30%): Based on total sessions. Cap at 50 sessions.
  const dedicationScore = Math.min(stats.totalSessions / 50, 1) * 30;

  return Math.round(consistencyScore + experienceScore + dedicationScore);
};

export const recordSession = async (userId: string, durationSeconds: number, presetId: string) => {
  if (!userId || durationSeconds < 10) return; // Ignore very short sessions

  const userRef = doc(db, 'users', userId);
  const sessionRef = collection(db, 'sessions');

  try {
    await runTransaction(db, async (transaction) => {
      const userDoc = await transaction.get(userRef);
      if (!userDoc.exists()) return;

      const userData = userDoc.data();
      const currentStats: UserStats = userData.stats || {
        totalPoints: 0,
        currentPoints: 0,
        totalMinutes: 0,
        totalSessions: 0,
        currentStreak: 0,
        longestStreak: 0,
        lastSessionDate: null,
        zenScore: 0,
        level: 1
      };

      // Ensure currentPoints exists (migration for old users)
      if (currentStats.currentPoints === undefined) {
          currentStats.currentPoints = currentStats.totalPoints;
      }

      // Streak Logic
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      let newStreak = currentStats.currentStreak;

      if (currentStats.lastSessionDate) {
        const lastDate = currentStats.lastSessionDate.toDate();
        const lastSessionDay = new Date(lastDate.getFullYear(), lastDate.getMonth(), lastDate.getDate());
        
        const diffTime = Math.abs(today.getTime() - lastSessionDay.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 

        if (diffDays === 1) {
          newStreak += 1;
        } else if (diffDays > 1) {
          newStreak = 1; // Streak broken
        }
        // If diffDays === 0, streak remains same (already practiced today)
      } else {
        newStreak = 1;
      }

      const pointsEarned = calculatePoints(durationSeconds);
      const newTotalMinutes = currentStats.totalMinutes + Math.floor(durationSeconds / 60);
      const newTotalSessions = currentStats.totalSessions + 1;

      const updatedStats: UserStats = {
        totalPoints: currentStats.totalPoints + pointsEarned,
        currentPoints: currentStats.currentPoints + pointsEarned, // Increment wallet balance
        totalMinutes: newTotalMinutes,
        totalSessions: newTotalSessions,
        currentStreak: newStreak,
        longestStreak: Math.max(newStreak, currentStats.longestStreak),
        lastSessionDate: serverTimestamp(),
        zenScore: 0, // placeholder
        level: Math.floor((currentStats.totalPoints + pointsEarned) / 500) + 1
      };

      // Recalculate Zen Score with new stats
      updatedStats.zenScore = calculateZenScore(updatedStats);

      // 1. Update User Stats
      transaction.update(userRef, { stats: updatedStats });
    });

    // Log session history separately
    await addDoc(sessionRef, {
      userId,
      presetId,
      durationSeconds,
      points: calculatePoints(durationSeconds),
      completedAt: serverTimestamp()
    });

    return true;
  } catch (e) {
    console.error("Transaction failed: ", e);
    throw e;
  }
};

export const getLeaderboard = async () => {
  const usersRef = collection(db, 'users');
  const q = query(usersRef, orderBy('stats.totalPoints', 'desc'), limit(10));
  const querySnapshot = await getDocs(q);
  
  return querySnapshot.docs.map(doc => ({
    uid: doc.id,
    ...doc.data()
  }));
};
