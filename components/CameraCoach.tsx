import React, { useEffect, useRef, useState, useCallback } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality } from "@google/genai";

interface CameraCoachProps {
  isActive: boolean;
  onFeedback: (text: string) => void;
  onFinish: (duration: number, accuracy: number) => void;
}

const CameraCoach: React.FC<CameraCoachProps> = ({ isActive, onFeedback, onFinish }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [feedback, setFeedback] = useState<string>("Align yourself in the camera...");
  const [isConnected, setIsConnected] = useState(false);
  const sessionRef = useRef<any>(null);
  const [permissionError, setPermissionError] = useState(false);
  const streamRef = useRef<MediaStream | null>(null);

  // Initial Setup for Camera
  useEffect(() => {
    if (!isActive) return;

    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { 
            width: { ideal: 640 },
            height: { ideal: 480 },
            facingMode: "user"
          }, 
          audio: false 
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          streamRef.current = stream;
        }
        setPermissionError(false);
        connectToGemini();
      } catch (err) {
        console.error("Camera permission denied:", err);
        setPermissionError(true);
      }
    };

    startCamera();

    return () => {
      stopCamera();
      disconnectGemini();
    };
  }, [isActive]);

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  const connectToGemini = async () => {
    const apiKey = process.env.API_KEY;
    if (!apiKey) return;

    const ai = new GoogleGenAI({ apiKey });
    
    try {
      // Create session
      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        callbacks: {
          onopen: () => {
            setIsConnected(true);
            setFeedback("AI Coach Connected. Begin exercise.");
            startFrameStreaming(sessionPromise);
          },
          onmessage: (message: LiveServerMessage) => {
            // Handle transcription text
            if (message.serverContent?.outputTranscription) {
              const text = message.serverContent.outputTranscription.text;
              if (text) {
                setFeedback(prev => text); // Replace or append based on need
                onFeedback(text);
              }
            }
          },
          onclose: () => {
            setIsConnected(false);
          },
          onerror: (err) => {
            console.error("Gemini Live Error:", err);
            setFeedback("Connection interrupted.");
          }
        },
        config: {
          responseModalities: [Modality.AUDIO], // We use AUDIO modality to get real-time speech/transcription
          outputAudioTranscription: {}, // Request transcription text
          systemInstruction: `
            You are a calm, minimalist meditation and movement coach.
            Analyze the video stream of the user exercising.
            Provide very brief, encouraging, and corrective feedback (max 6 words).
            Focus on posture, alignment, and breathing cues.
            If the user is still, ask them to begin the movement.
            Do not be chatty. Be zen.
          `,
        }
      });
      
      sessionRef.current = sessionPromise;

    } catch (error) {
      console.error("Failed to connect to Gemini:", error);
    }
  };

  const disconnectGemini = () => {
    // No explicit disconnect method exposed on the promise wrapper easily, 
    // but stopping the stream stops inputs.
    // In a real app, we might handle cleanup more robustly.
    sessionRef.current = null;
  };

  const startFrameStreaming = (sessionPromise: Promise<any>) => {
    if (!canvasRef.current || !videoRef.current) return;
    
    const ctx = canvasRef.current.getContext('2d');
    const intervalId = setInterval(async () => {
      if (!isActive || !videoRef.current || !canvasRef.current || !ctx) {
        clearInterval(intervalId);
        return;
      }

      // Draw video frame to canvas
      canvasRef.current.width = videoRef.current.videoWidth;
      canvasRef.current.height = videoRef.current.videoHeight;
      ctx.drawImage(videoRef.current, 0, 0);

      // Convert to base64
      const base64 = canvasRef.current.toDataURL('image/jpeg', 0.5).split(',')[1];
      
      // Send to Gemini
      sessionPromise.then(session => {
        session.sendRealtimeInput({
          media: {
            mimeType: 'image/jpeg',
            data: base64
          }
        });
      }).catch(e => console.error("Send error", e));

    }, 1000); // 1 FPS is enough for posture check to save bandwidth
  };

  if (permissionError) {
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-6 text-center">
        <p className="text-xl mb-4">Camera Access Required</p>
        <p className="text-stone-400 mb-6">Please allow camera access to use the AI Coach feature.</p>
        <button 
          onClick={() => window.location.reload()}
          className="bg-teal-700 px-6 py-2 rounded-full"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden">
      {/* Video Feed */}
      <video 
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="absolute inset-0 w-full h-full object-cover opacity-50"
      />
      <canvas ref={canvasRef} className="hidden" />

      {/* Overlay UI */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full w-full p-6 space-y-8">
         {/* Connecting State */}
         {!isConnected && (
           <div className="flex items-center gap-2 bg-stone-900/50 px-4 py-2 rounded-full backdrop-blur-md">
             <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
             <span className="text-xs font-medium text-stone-200">Connecting to AI...</span>
           </div>
         )}

         {/* Live Feedback Text */}
         <div className="mt-auto mb-20 text-center max-w-md">
            <h3 className="text-2xl md:text-3xl font-light text-white drop-shadow-lg tracking-wide animate-in slide-in-from-bottom-2 duration-300 key={feedback}">
              {feedback}
            </h3>
         </div>
      </div>

      {/* Scanline Effect */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-teal-500/5 to-transparent h-full w-full animate-scan" />
    </div>
  );
};

export default CameraCoach;