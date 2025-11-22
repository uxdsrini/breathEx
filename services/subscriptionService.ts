
import { db } from '../firebase';
import { doc, updateDoc, serverTimestamp, Timestamp } from 'firebase/firestore';
import { UserSubscription, PlanInterval } from '../types';

export const PLANS = {
  MONTHLY: {
    id: 'pro_monthly',
    name: 'ZenFlow Pro Monthly',
    price: 9.99,
    interval: 'month' as PlanInterval,
  },
  YEARLY: {
    id: 'pro_yearly',
    name: 'ZenFlow Pro Yearly',
    price: 79.99,
    interval: 'year' as PlanInterval,
    savings: '33%'
  }
};

/**
 * Mocks a payment gateway process (e.g., Stripe)
 * In a real app, this would call a Cloud Function which communicates with Stripe/RevenueCat
 */
export const upgradeSubscription = async (userId: string, planId: string): Promise<boolean> => {
  if (!userId) return false;

  // Simulate API network latency
  await new Promise(resolve => setTimeout(resolve, 1500));

  // Calculate expiry date (1 month or 1 year from now)
  const now = new Date();
  const expiryDate = new Date();
  
  if (planId === 'pro_monthly') {
    expiryDate.setMonth(now.getMonth() + 1);
  } else {
    expiryDate.setFullYear(now.getFullYear() + 1);
  }

  const newSubscription: UserSubscription = {
    status: 'active',
    planId: planId,
    interval: planId === 'pro_monthly' ? 'month' : 'year',
    currentPeriodEnd: Timestamp.fromDate(expiryDate)
  };

  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      subscription: newSubscription
    });
    return true;
  } catch (error) {
    console.error("Subscription failed:", error);
    return false;
  }
};

export const cancelSubscription = async (userId: string): Promise<boolean> => {
  if (!userId) return false;
  
  // In reality, this would set 'cancel_at_period_end' in Stripe
  // Here we just downgrade immediately for demo purposes, or mark as canceled
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      'subscription.status': 'canceled'
    });
    return true;
  } catch (error) {
    console.error("Cancellation failed:", error);
    return false;
  }
};

/**
 * Checks if the user has access to premium features
 */
export const checkPremiumStatus = (sub?: UserSubscription): boolean => {
  if (!sub) return false;
  
  const now = new Date();
  
  // Check status
  if (sub.status !== 'active' && sub.status !== 'canceled') return false;
  
  // Check expiry
  if (sub.currentPeriodEnd) {
    const expiry = sub.currentPeriodEnd.toDate();
    if (expiry < now) return false; // Expired
  }
  
  return true;
};
