
import { db } from '../firebase';
import { doc, runTransaction, collection, query, where, getDocs, orderBy, serverTimestamp } from 'firebase/firestore';
import { Coupon, Redemption, UserStats, UserSubscription } from '../types';
import { checkPremiumStatus } from './subscriptionService';

// Generate a pseudo-random coupon code
const generateCouponCode = (provider: string): string => {
  const prefix = provider.substring(0, 3).toUpperCase();
  const randomStr = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `${prefix}-${randomStr}-2025`;
};

export const redeemCoupon = async (userId: string, coupon: Coupon): Promise<{ success: boolean, message?: string, code?: string }> => {
  if (!userId) return { success: false, message: "User not found" };

  const userRef = doc(db, 'users', userId);
  const redemptionsRef = collection(db, 'redemptions');

  try {
    const result = await runTransaction(db, async (transaction) => {
      const userDoc = await transaction.get(userRef);
      if (!userDoc.exists()) {
        throw "User does not exist";
      }

      const userData = userDoc.data();
      const stats: UserStats = userData.stats;
      const subscription: UserSubscription = userData.subscription;

      // 1. VALIDATE SUBSCRIPTION (Security Rule)
      if (!checkPremiumStatus(subscription)) {
        throw "Subscription required";
      }

      // 2. VALIDATE BALANCE (Security Rule)
      // Handle migration case where currentPoints might be undefined
      const balance = stats.currentPoints !== undefined ? stats.currentPoints : stats.totalPoints;

      if (balance < coupon.cost) {
        throw "Insufficient points";
      }

      // 3. DEDUCT POINTS
      const newBalance = balance - coupon.cost;
      transaction.update(userRef, {
        'stats.currentPoints': newBalance
      });

      // 4. GENERATE COUPON RECORD
      const code = generateCouponCode(coupon.provider);
      const newRedemptionRef = doc(redemptionsRef); // Auto-ID
      
      transaction.set(newRedemptionRef, {
        userId,
        couponId: coupon.id,
        couponProvider: coupon.provider,
        code: code,
        cost: coupon.cost,
        timestamp: serverTimestamp()
      });

      return code;
    });

    return { success: true, code: result };
    
  } catch (error) {
    console.error("Redemption failed:", error);
    return { success: false, message: typeof error === 'string' ? error : "Transaction failed" };
  }
};

export const getRedemptionHistory = async (userId: string): Promise<Redemption[]> => {
  const redemptionsRef = collection(db, 'redemptions');
  const q = query(
    redemptionsRef, 
    where("userId", "==", userId), 
    orderBy("timestamp", "desc")
  );
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as Redemption[];
};
