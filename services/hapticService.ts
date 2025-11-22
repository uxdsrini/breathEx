
/**
 * Haptic Feedback Service
 * Uses the navigator.vibrate API to provide tactile feedback during meditation.
 * Note: This primarily works on Android devices. iOS Safari support is limited/non-existent for this API.
 */

export const HapticPatterns = {
  Soft: 20,          // A tiny tick for buttons
  PhaseChange: 70,   // A gentle nudge for breathing phase changes
  Success: [50, 50, 50], // A small pulse pattern for completion
  BreathIn: [30, 50, 100], // Rising vibration (simulated)
};

export const triggerHaptic = (pattern: number | number[]) => {
  if (typeof navigator !== 'undefined' && navigator.vibrate) {
    try {
      navigator.vibrate(pattern);
    } catch (e) {
      // Fail silently if API is blocked or throws
    }
  }
};
