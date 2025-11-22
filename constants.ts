import { Preset, PhaseType } from './types';

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