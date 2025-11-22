
import React, { useState } from 'react';
import { PLANS, upgradeSubscription } from '../services/subscriptionService';
import { useAuth } from '../contexts/AuthContext';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SubscriptionModal: React.FC<SubscriptionModalProps> = ({ isOpen, onClose }) => {
  const { currentUser } = useAuth();
  const [processing, setProcessing] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('yearly');

  if (!isOpen) return null;

  const handleSubscribe = async () => {
    if (!currentUser) return;
    setProcessing(true);
    
    const planId = selectedPlan === 'monthly' ? PLANS.MONTHLY.id : PLANS.YEARLY.id;
    const success = await upgradeSubscription(currentUser.uid, planId);
    
    setProcessing(false);
    if (success) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        {/* Decorative header */}
        <div className="bg-teal-900 text-white p-8 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-teal-800 to-teal-950 opacity-50"></div>
          <div className="relative z-10">
            <h2 className="text-2xl font-light mb-2 tracking-tight">Unlock Full Access</h2>
            <p className="text-teal-200/80 text-sm">Upgrade to unlock live AI coaching and redeem your hard-earned points for real rewards.</p>
          </div>
        </div>

        <div className="p-6">
          {/* Features */}
          <div className="space-y-3 mb-8">
             <div className="flex items-center gap-3 text-stone-700 text-sm">
               <div className="w-5 h-5 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center flex-shrink-0">
                 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5"><path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" /></svg>
               </div>
               <span>Live Camera AI Coaching</span>
             </div>
             <div className="flex items-center gap-3 text-stone-700 text-sm">
               <div className="w-5 h-5 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center flex-shrink-0">
                 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5"><path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" /></svg>
               </div>
               <span>Real-time Posture Correction</span>
             </div>
             <div className="flex items-center gap-3 text-stone-700 text-sm">
               <div className="w-5 h-5 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center flex-shrink-0">
                 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5"><path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" /></svg>
               </div>
               <span>Redeem Points for Coupons (Amazon, etc.)</span>
             </div>
          </div>

          {/* Plan Selector */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button 
              onClick={() => setSelectedPlan('monthly')}
              className={`px-4 py-4 pt-6 rounded-xl border-2 text-center transition-all relative ${selectedPlan === 'monthly' ? 'border-teal-600 bg-teal-50' : 'border-stone-200 bg-white opacity-70 hover:opacity-100'}`}
            >
              <div className="font-medium text-stone-800">Monthly</div>
              <div className="text-sm text-stone-500 mt-1">$9.99/mo</div>
            </button>
            
            <button 
              onClick={() => setSelectedPlan('yearly')}
              className={`px-4 py-4 pt-6 rounded-xl border-2 text-center transition-all relative ${selectedPlan === 'yearly' ? 'border-teal-600 bg-teal-50' : 'border-stone-200 bg-white opacity-70 hover:opacity-100'}`}
            >
               <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-teal-600 text-white text-[10px] font-bold uppercase px-3 py-1 rounded-full shadow-sm whitespace-nowrap">
                 Best Value
               </div>
              <div className="font-medium text-stone-800">Yearly</div>
              <div className="text-sm text-stone-500 mt-1">$79.99/yr</div>
              <div className="text-[10px] text-teal-600 font-bold mt-1">Save 33%</div>
            </button>
          </div>

          <button 
            onClick={handleSubscribe}
            disabled={processing}
            className="w-full bg-teal-800 text-white py-4 rounded-xl font-medium hover:bg-teal-900 transition-all active:scale-[0.98] shadow-lg disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {processing ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                Processing...
              </>
            ) : (
              'Start Free Trial'
            )}
          </button>
          
          <button onClick={onClose} className="w-full text-center mt-4 text-xs text-stone-400 hover:text-stone-600">
             Maybe later
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionModal;
