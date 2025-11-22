
import React, { useEffect, useState } from 'react';
import { AVAILABLE_COUPONS } from '../constants';
import { useAuth } from '../contexts/AuthContext';
import { redeemCoupon, getRedemptionHistory } from '../services/rewardService';
import { Coupon, Redemption } from '../types';

interface RewardsViewProps {
  onUpgrade: () => void;
}

const RewardsView: React.FC<RewardsViewProps> = ({ onUpgrade }) => {
  const { userStats, isPremium, currentUser } = useAuth();
  const [redemptions, setRedemptions] = useState<Redemption[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Fallback logic for migration
  const balance = userStats ? (userStats.currentPoints !== undefined ? userStats.currentPoints : userStats.totalPoints) : 0;

  useEffect(() => {
    const loadHistory = async () => {
      if (currentUser) {
        const history = await getRedemptionHistory(currentUser.uid);
        setRedemptions(history);
      }
      setLoading(false);
    };
    loadHistory();
  }, [currentUser]);

  const handleRedeem = async (coupon: Coupon) => {
    if (!currentUser) return;

    // 1. Gating check
    if (!isPremium) {
      onUpgrade();
      return;
    }

    // 2. Balance check
    if (balance < coupon.cost) {
      setError(`You need ${coupon.cost} points for this reward.`);
      setTimeout(() => setError(null), 3000);
      return;
    }

    setProcessingId(coupon.id);
    const result = await redeemCoupon(currentUser.uid, coupon);
    
    if (result.success) {
      // Refresh history locally to show immediately
      const newHistory = await getRedemptionHistory(currentUser.uid);
      setRedemptions(newHistory);
    } else {
      if (result.message === "Subscription required") {
        onUpgrade();
      } else {
        setError(result.message || "Failed to redeem");
        setTimeout(() => setError(null), 3000);
      }
    }
    setProcessingId(null);
  };

  if (loading) return <div className="p-4 text-center text-stone-400 text-sm">Loading rewards...</div>;

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      
      {/* Header Balance */}
      <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 flex justify-between items-center">
         <div>
            <div className="text-xs font-bold text-amber-700 uppercase tracking-wider">Your Balance</div>
            <div className="text-2xl font-mono font-bold text-amber-600">{balance.toLocaleString()} <span className="text-sm font-normal">pts</span></div>
         </div>
         <div className="text-right">
           {!isPremium && (
             <button onClick={onUpgrade} className="text-xs bg-teal-700 text-white px-3 py-1.5 rounded-full font-bold hover:bg-teal-800 transition-colors shadow-sm">
               Unlock Rewards
             </button>
           )}
         </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 text-xs p-3 rounded-lg text-center animate-pulse">
          {error}
        </div>
      )}

      {/* Coupons List */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold text-stone-400 uppercase tracking-wider ml-1">Available Coupons</h4>
        {AVAILABLE_COUPONS.map(coupon => {
          const canAfford = balance >= coupon.cost;
          return (
            <div key={coupon.id} className="bg-white border border-stone-100 rounded-2xl p-4 flex items-center justify-between shadow-sm hover:shadow-md transition-all">
               <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl ${coupon.logoColor} text-white flex items-center justify-center font-bold text-lg shadow-sm`}>
                     {coupon.provider[0]}
                  </div>
                  <div>
                     <div className="font-bold text-stone-800">{coupon.provider}</div>
                     <div className="text-xs text-stone-500">{coupon.description}</div>
                     <div className="text-xs font-medium text-teal-600 mt-0.5">{coupon.valueDisplay}</div>
                  </div>
               </div>
               
               <div className="flex flex-col items-end gap-1">
                 <span className="text-xs font-bold text-stone-400">{coupon.cost} pts</span>
                 <button 
                   onClick={() => handleRedeem(coupon)}
                   disabled={processingId === coupon.id || (!isPremium && !canAfford)} // Let them click if not premium to see gate, but disable if affordable check fails logic visually
                   className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                     processingId === coupon.id 
                       ? 'bg-stone-100 text-stone-400 cursor-wait'
                       : (!isPremium 
                           ? 'bg-stone-900 text-white hover:bg-stone-700' 
                           : (canAfford 
                               ? 'bg-teal-600 text-white hover:bg-teal-700 shadow-md hover:shadow-lg' 
                               : 'bg-stone-100 text-stone-400 cursor-not-allowed'))
                   }`}
                 >
                   {processingId === coupon.id ? '...' : (isPremium ? 'Redeem' : 'Unlock')}
                 </button>
               </div>
            </div>
          );
        })}
      </div>

      {/* History */}
      {redemptions.length > 0 && (
        <div className="pt-4 border-t border-stone-100">
           <h4 className="text-xs font-bold text-stone-400 uppercase tracking-wider ml-1 mb-3">My Rewards</h4>
           <div className="space-y-2">
              {redemptions.map(r => (
                <div key={r.id} className="flex justify-between items-center bg-stone-50 p-3 rounded-lg border border-stone-100">
                   <div>
                      <div className="text-sm font-bold text-stone-700">{r.couponProvider}</div>
                      <div className="text-[10px] text-stone-400">{new Date(r.timestamp.seconds * 1000).toLocaleDateString()}</div>
                   </div>
                   <div className="text-right">
                      <div className="text-sm font-mono bg-white px-2 py-1 rounded border border-stone-200 text-teal-700 select-all cursor-copy">
                        {r.code}
                      </div>
                      <div className="text-[10px] text-stone-400 mt-0.5">-{r.cost} pts</div>
                   </div>
                </div>
              ))}
           </div>
        </div>
      )}
    </div>
  );
};

export default RewardsView;
