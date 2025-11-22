
import { Preset, PhaseType, Coupon } from './types';

export const PRESETS: Preset[] = [
  {
    id: 'box-breathing',
    name: 'Box Breathing',
    description: 'Focus and calm the mind. 4s In, 4s Hold, 4s Out, 4s Hold.',
    type: 'breathing',
    phases: [
      { label: 'Inhale', duration: 4, type: PhaseType.Inhale },
      { label: 'Hold', duration: 4, type: PhaseType.Hold },
      { label: 'Exhale', duration: 4, type: PhaseType.Exhale },
      { label: 'Hold', duration: 4, type: PhaseType.Hold },
    ],
    benefits: [
      "Instantly reduces stress and anxiety by regulating the autonomic nervous system.",
      "Heightens performance and concentration (used by Navy SEALs).",
      "Regulates body temperature and blood pressure."
    ],
    technique: [
      "Sit upright and exhale completely through your mouth.",
      "Inhale slowly through your nose for a count of 4.",
      "Hold your breath for a count of 4.",
      "Exhale through your mouth for a count of 4.",
      "Hold your breath again for a count of 4 before restarting."
    ]
  },
  {
    id: '4-7-8',
    name: '4-7-8 Relax',
    description: 'Reduce anxiety and sleep better. 4s In, 7s Hold, 8s Out.',
    type: 'breathing',
    phases: [
      { label: 'Inhale', duration: 4, type: PhaseType.Inhale },
      { label: 'Hold', duration: 7, type: PhaseType.Hold },
      { label: 'Exhale', duration: 8, type: PhaseType.Exhale },
    ],
    benefits: [
      "Acts as a natural tranquilizer for the nervous system.",
      "Helps reduce anxiety and manage cravings.",
      "Promotes better sleep and helps you fall asleep faster."
    ],
    technique: [
      "Place the tip of your tongue against the ridge behind your upper front teeth.",
      "Exhale completely through your mouth with a 'whoosh' sound.",
      "Close your mouth and inhale quietly through your nose to a count of 4.",
      "Hold your breath for a count of 7.",
      "Exhale completely through your mouth, making a whoosh sound to a count of 8."
    ]
  },
  {
    id: 'coherence',
    name: 'Coherence',
    description: 'Balance heart rate variability. 5.5s In, 5.5s Out.',
    type: 'breathing',
    phases: [
      { label: 'Inhale', duration: 5.5, type: PhaseType.Inhale },
      { label: 'Exhale', duration: 5.5, type: PhaseType.Exhale },
    ],
    benefits: [
      "Maximizes Heart Rate Variability (HRV).",
      "Synchronizes your heart, breath, and brain rhythms.",
      "Improves emotional stability and cognitive function."
    ],
    technique: [
      "Breathe comfortably and rhythmically.",
      "Inhale smoothly for 5.5 seconds.",
      "Exhale smoothly for 5.5 seconds.",
      "Ensure there are no pauses between the inhale and exhale; keep it continuous like a wave."
    ]
  },
  {
    id: 'mindful-movement',
    name: 'Mindful Movement',
    description: 'AI-guided posture analysis using your camera.',
    type: 'timer',
    defaultDuration: 5,
    isPremium: true,
    benefits: [
      "Corrects posture in real-time using AI.",
      "Prevents back pain and injury.",
      "Increases body awareness and alignment."
    ],
    technique: [
      "Ensure your device camera is enabled.",
      "Stand back so your full upper body is visible.",
      "Follow the text guidance on screen for alignment.",
      "Hold poses as instructed."
    ]
  },
  {
    id: 'zazen',
    name: 'Zazen (Just Sitting)',
    description: 'Open awareness meditation with a simple timer.',
    type: 'timer',
    defaultDuration: 20, // minutes
    benefits: [
      "Cultivates pure presence and awareness.",
      "Teaches detachment from wandering thoughts.",
      "Improves posture and core stability."
    ],
    technique: [
      "Sit on a cushion or chair with a straight spine.",
      "Keep your eyes half-open, gazing softly at the floor about 3 feet in front of you.",
      "Place your hands in the cosmic mudra (left hand on right, thumbs touching).",
      "Focus on your posture and breathing. When thoughts arise, let them pass like clouds."
    ]
  },
  {
    id: 'pomodoro',
    name: 'Focus Interval',
    description: 'Timed focus session for productivity.',
    type: 'timer',
    defaultDuration: 25, // minutes
    benefits: [
      "Prevents mental fatigue and burnout.",
      "Maintains high levels of focus for longer periods.",
      "Creates a structured workflow to overcome procrastination."
    ],
    technique: [
      "Pick a single task you want to accomplish.",
      "Start the timer for 25 minutes.",
      "Work intensely on the task until the timer rings.",
      "Take a short 5-minute break before starting the next cycle."
    ]
  },
];

export const AVAILABLE_COUPONS: Coupon[] = [
  {
    id: 'amazon-5',
    provider: 'Amazon',
    description: 'Gift Card',
    valueDisplay: '$5',
    cost: 500,
    logoColor: 'bg-amber-500'
  },
  {
    id: 'amazon-10',
    provider: 'Amazon',
    description: 'Gift Card',
    valueDisplay: '$10',
    cost: 900,
    logoColor: 'bg-amber-500'
  },
  {
    id: 'flipkart-500',
    provider: 'Flipkart',
    description: 'Voucher',
    valueDisplay: '₹500',
    cost: 800,
    logoColor: 'bg-blue-500'
  },
  {
    id: 'calm-month',
    provider: 'Wellness Store',
    description: 'Yoga Mat Discount',
    valueDisplay: '20% OFF',
    cost: 250,
    logoColor: 'bg-teal-600'
  },
  {
    id: 'spotify-trial',
    provider: 'Spotify',
    description: 'Premium Trial',
    valueDisplay: '1 Month',
    cost: 300,
    logoColor: 'bg-green-500'
  }
];

export const FAQS = [
  {
    question: "Is ZenFlow completely free?",
    answer: "ZenFlow offers a generous free tier that includes all standard breathing exercises, timer presets, and basic progress tracking. The Pro plan unlocks advanced features like AI Camera Coaching and the Reward Redemption system."
  },
  {
    question: "How does the AI Camera Coach work?",
    answer: "The AI Coach uses your device's camera and Google's Gemini Live API to analyze your posture in real-time. It provides instant text feedback to help you correct your alignment without recording or storing any video data."
  },
  {
    question: "Can I cancel my subscription anytime?",
    answer: "Yes, you can cancel your subscription instantly from your profile settings. Your premium benefits will continue until the end of the current billing period."
  },
  {
    question: "How do points and rewards work?",
    answer: "You earn points for every minute you practice. These points can be redeemed for real-world coupons (like Amazon or Spotify) if you are a Pro subscriber. Points never expire as long as your account is active."
  }
];

export const POLICIES = {
  terms: {
    title: "Terms & Conditions",
    content: `
      1. Introduction
      Welcome to ZenFlow. By using our app, you agree to these terms. Please read them carefully.

      2. Use of Service
      ZenFlow is a tool for mindfulness and relaxation. It is not a medical device and should not replace professional medical advice.

      3. Account Responsibilities
      You are responsible for maintaining the confidentiality of your account credentials. Activity under your account is your responsibility.

      4. Pro Subscription
      Subscriptions automatically renew unless canceled 24 hours before the end of the period. Unused portions of free trials are forfeited upon purchase.

      5. Termination
      We reserve the right to terminate accounts that violate our community guidelines or attempt to exploit the reward system.
    `
  },
  privacy: {
    title: "Privacy Policy",
    content: `
      1. Data Collection
      We collect your email for account management and practice statistics to track your progress.

      2. Camera Data
      The AI Camera feature processes video streams locally or via ephemeral secure cloud processing. We do NOT record or store video of you.

      3. Third Parties
      We use Firebase for authentication/database and Google Gemini for AI services. We do not sell your data to advertisers.

      4. Deletion
      You may request full account deletion by contacting support. All data will be permanently removed from our servers.
    `
  },
  refund: {
    title: "Refund Policy",
    content: `
      1. Subscription Refunds
      Refunds for subscriptions are handled via the platform you purchased from (e.g., App Store, Google Play, or Stripe).

      2. 14-Day Guarantee
      If you are unsatisfied with the Web Pro version, contact us within 14 days of purchase for a full refund.

      3. Reward Points
      Points redeemed for coupons cannot be refunded or reversed once the coupon code is revealed.
    `
  },
  subscription: {
    title: "Subscription Policy",
    content: `
      1. Billing Cycle
      Subscriptions are billed in advance on a monthly or yearly basis.

      2. Cancellation
      You can cancel at any time. You will retain access until the end of your paid period. No partial refunds are issued for unused time.

      3. Changes to Pricing
      We reserve the right to adjust pricing for our service or any components thereof in any manner and at any time. Any price changes will take effect following email notice to you.
    `
  }
};
