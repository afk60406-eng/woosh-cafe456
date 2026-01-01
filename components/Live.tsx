import React, { useEffect, useRef, useState } from 'react';
import { X, Mic, Loader2, Play, Square } from './icons';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import { MENU_DATA } from '../data/menu';

interface LiveProps {
  onClose: () => void;
  isGuest: boolean;
}

export const Live: React.FC<LiveProps> = ({ onClose, isGuest }) => {
  const [status, setStatus] = useState<'connecting' | 'connected' | 'error' | 'closed'>('connecting');
  const [isMuted, setIsMuted] = useState(false);
  const [visualizerData, setVisualizerData] = useState<number[]>(new Array(5).fill(20));
  
  // Refs for audio handling
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const inputContextRef = useRef<AudioContext | null>(null);
  const sessionRef = useRef<any>(null); // To store the active session
  const nextStartTimeRef = useRef<number>(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

  // Menu context string for the AI
  const menuContext = JSON.stringify(MENU_DATA);

  useEffect(() => {
    let mounted = true;

    const startSession = async () => {
      try {
        if (!process.env.API_KEY) {
            console.error("API_KEY is missing");
            setStatus('error');
            return;
        }

        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        
        // Audio Context Setup
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        const inputCtx = new AudioContextClass({ sampleRate: 16000 });
        const outputCtx = new AudioContextClass({ sampleRate: 24000 });
        
        inputContextRef.current = inputCtx;
        audioContextRef.current = outputCtx;

        // Microphone Stream
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        
        // Determine System Instruction based on Role
        const systemInstruction = isGuest
            ? `You are a friendly, warm, and knowledgeable barista at WOOSH CAFE. 
               Here is the menu data: ${menuContext}.
               Your job is to recommend drinks, explain flavors (e.g., Anaerobic sun-dried coffee tastes fruity), 
               and help guests feel relaxed. Keep answers concise and spoken naturally.`
            : `You are the AI Chief Operating Officer (COO) for WOOSH CAFE.
               Here is the current menu data: ${menuContext}.
               Your job is to analyze business performance, suggest inventory optimizations, 
               discuss ESG goals, and help the store manager make decisions. 
               Tone: Professional, data-driven, yet supportive.`;

        const sessionPromise = ai.live.connect({
          model: 'gemini-2.5-flash-native-audio-preview-09-2025',
          config: {
            responseModalities: [Modality.AUDIO],
            systemInstruction: systemInstruction,
            speechConfig: {
              voiceConfig: { prebuiltVoiceConfig: { voiceName: isGuest ? 'Kore' : 'Fenrir' } },
            },
          },
          callbacks: {
            onopen: () => {
              if (mounted) setStatus('connected');
              
              // Input Audio Processing
              const source = inputCtx.createMediaStreamSource(stream);
              const scriptProcessor = inputCtx.createScriptProcessor(4096, 1, 1);
              
              scriptProcessor.onaudioprocess = (e) => {
                if (!mounted) return;
                const inputData = e.inputBuffer.getChannelData(0);
                
                // Simple visualizer update
                const volume = inputData.reduce((acc, val) => acc + Math.abs(val), 0) / inputData.length;
                if (volume > 0.01) {
                   setVisualizerData(prev => prev.map(() => Math.random() * 50 + 10));
                }

                const pcm16 = floatTo16BitPCM(inputData);
                const base64Data = arrayBufferToBase64(pcm16);
                
                sessionPromise.then(session => {
                    session.sendRealtimeInput({
                        media: {
                            mimeType: 'audio/pcm;rate=16000',
                            data: base64Data
                        }
                    });
                });
              };

              source.connect(scriptProcessor);
              scriptProcessor.connect(inputCtx.destination);
            },
            onmessage: async (msg: LiveServerMessage) => {
              if (!mounted) return;
              
              const audioData = msg.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
              if (audioData) {
                 // Simulate AI talking visualizer
                 setVisualizerData(prev => prev.map(() => Math.random() * 80 + 20));

                 const audioCtx = audioContextRef.current!;
                 nextStartTimeRef.current = Math.max(nextStartTimeRef.current, audioCtx.currentTime);
                 
                 const audioBuffer = await decodeAudioData(base64ToArrayBuffer(audioData), audioCtx);
                 const source = audioCtx.createBufferSource();
                 source.buffer = audioBuffer;
                 source.connect(audioCtx.destination);
                 
                 source.addEventListener('ended', () => {
                    sourcesRef.current.delete(source);
                    setVisualizerData([20, 20, 20, 20, 20]); // Reset visualizer
                 });

                 source.start(nextStartTimeRef.current);
                 nextStartTimeRef.current += audioBuffer.duration;
                 sourcesRef.current.add(source);
              }
            },
            onclose: () => {
              if (mounted) setStatus('closed');
            },
            onerror: (err) => {
              console.error(err);
              if (mounted) setStatus('error');
            }
          }
        });
        
        sessionRef.current = sessionPromise;

      } catch (err) {
        console.error("Connection failed", err);
        if (mounted) setStatus('error');
      }
    };

    startSession();

    return () => {
      mounted = false;
      // Cleanup Audio Contexts
      inputContextRef.current?.close();
      audioContextRef.current?.close();
      // Stop all playing sources
      sourcesRef.current.forEach(source => source.stop());
    };
  }, [isGuest, menuContext]);

  // --- Helper Functions ---

  const floatTo16BitPCM = (float32Array: Float32Array) => {
    const buffer = new ArrayBuffer(float32Array.length * 2);
    const view = new DataView(buffer);
    for (let i = 0; i < float32Array.length; i++) {
        let s = Math.max(-1, Math.min(1, float32Array[i]));
        view.setInt16(i * 2, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
    }
    return buffer;
  };

  const arrayBufferToBase64 = (buffer: ArrayBuffer) => {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  };

  const base64ToArrayBuffer = (base64: string) => {
    const binaryString = window.atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  };

  const decodeAudioData = async (arrayBuffer: ArrayBuffer, audioCtx: AudioContext) => {
      // Raw PCM decoding for 24000Hz (Gemini output)
      const dataView = new DataView(arrayBuffer);
      const numSamples = arrayBuffer.byteLength / 2;
      const audioBuffer = audioCtx.createBuffer(1, numSamples, 24000);
      const channelData = audioBuffer.getChannelData(0);
      
      for (let i = 0; i < numSamples; i++) {
         const sample = dataView.getInt16(i * 2, true);
         channelData[i] = sample / 32768;
      }
      return audioBuffer;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className={`w-full max-w-md rounded-3xl shadow-2xl overflow-hidden transition-colors duration-500 ${isGuest ? 'bg-white' : 'bg-stone-900'}`}>
        {/* Header */}
        <div className={`flex items-center justify-between p-6 border-b ${isGuest ? 'border-gray-100' : 'border-stone-800'}`}>
           <h3 className={`font-serif font-bold text-lg ${isGuest ? 'text-stone-800' : 'text-stone-200'}`}>
               {isGuest ? 'Woosh Barista' : 'Woosh COO'}
           </h3>
           <button onClick={onClose} className={`p-2 rounded-full transition-colors ${isGuest ? 'hover:bg-gray-100 text-gray-500' : 'hover:bg-stone-800 text-stone-400'}`}>
             <X size={20} />
           </button>
        </div>

        {/* Content */}
        <div className="p-8 flex flex-col items-center justify-center space-y-8 min-h-[300px]">
           
           {/* Visualizer Circle */}
           <div className="relative w-40 h-40 flex items-center justify-center">
              {/* Outer pulsing rings */}
              <div className={`absolute inset-0 rounded-full animate-ping opacity-20 ${status === 'connected' ? (isGuest ? 'bg-[#b45309]' : 'bg-blue-600') : 'bg-gray-400'}`}></div>
              <div className={`absolute inset-4 rounded-full animate-pulse opacity-30 ${status === 'connected' ? (isGuest ? 'bg-[#b45309]' : 'bg-blue-600') : 'bg-gray-400'}`}></div>
              
              {/* Core */}
              <div className={`relative z-10 w-24 h-24 rounded-full flex items-center justify-center shadow-lg transition-colors duration-500 ${
                  status === 'connected' 
                    ? (isGuest ? 'bg-gradient-to-br from-[#b45309] to-[#78350f]' : 'bg-gradient-to-br from-blue-600 to-indigo-900') 
                    : 'bg-gray-200'
              }`}>
                  {status === 'connecting' ? (
                      <Loader2 className="animate-spin text-white" size={32} />
                  ) : status === 'error' ? (
                      <X className="text-white" size={32} />
                  ) : (
                      <Mic className="text-white animate-pulse" size={32} />
                  )}
              </div>
           </div>

           {/* Audio Bars Visualizer */}
           <div className="flex gap-2 h-12 items-center">
              {visualizerData.map((h, i) => (
                  <div 
                    key={i} 
                    className={`w-2 rounded-full transition-all duration-100 ${isGuest ? 'bg-stone-300' : 'bg-stone-600'}`}
                    style={{ height: `${status === 'connected' ? h : 10}px` }}
                  ></div>
              ))}
           </div>

           <div className={`text-center space-y-2 ${isGuest ? 'text-stone-600' : 'text-stone-400'}`}>
              {status === 'connecting' && <p>正在連線至 Woosh AI...</p>}
              {status === 'connected' && <p>{isGuest ? '請直接說話，我在聽...' : '營運長在線，請下達指令...'}</p>}
              {status === 'error' && <p className="text-red-500">連線失敗，請檢查網路或 API Key</p>}
           </div>

        </div>

        {/* Footer Controls */}
        <div className={`p-6 border-t flex justify-center gap-6 ${isGuest ? 'border-gray-100 bg-gray-50' : 'border-stone-800 bg-stone-950'}`}>
             <button onClick={() => setIsMuted(!isMuted)} className={`p-4 rounded-full shadow-sm transition-all ${isMuted ? 'bg-red-100 text-red-600' : (isGuest ? 'bg-white text-stone-700 hover:scale-105' : 'bg-stone-800 text-stone-300 hover:scale-105')}`}>
                 {isMuted ? <Square size={20} fill="currentColor" /> : <Mic size={20} />}
             </button>
        </div>
      </div>
    </div>
  );
};