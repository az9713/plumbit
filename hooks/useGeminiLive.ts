import { useState, useRef, useEffect, useCallback } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import { AgentConfig } from '../types';
import { base64ToUint8Array, decodeAudioData, createPcmBlob } from '../utils/audioUtils';

interface UseGeminiLiveProps {
  agentConfig: AgentConfig | null;
  isOpen: boolean;
}

export const useGeminiLive = ({ agentConfig, isOpen }: UseGeminiLiveProps) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isTalking, setIsTalking] = useState(false); // Model is talking
  const [error, setError] = useState<string | null>(null);

  // Refs for cleanup and audio management
  const audioContextRef = useRef<AudioContext | null>(null);
  const inputAudioContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const sessionRef = useRef<any>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const inputSourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const isTalkingTimeoutRef = useRef<number | null>(null);

  const disconnect = useCallback(() => {
    console.log("Disconnecting session...");
    
    if (sessionRef.current) {
      // There is no explicit close() on the session object in some versions, 
      // but we drop the reference. Ideally the SDK handles cleanup on disconnect.
      // If the SDK provides a close method, use it. 
      // Based on guidance: "Use session.close() to close the connection"
      try {
          sessionRef.current.close();
      } catch (e) {
          console.warn("Could not close session explicitly", e);
      }
      sessionRef.current = null;
    }

    // Stop microphone
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    // Stop input processing
    if (processorRef.current) {
      processorRef.current.disconnect();
      processorRef.current = null;
    }
    if (inputSourceRef.current) {
      inputSourceRef.current.disconnect();
      inputSourceRef.current = null;
    }
    if (inputAudioContextRef.current) {
      inputAudioContextRef.current.close();
      inputAudioContextRef.current = null;
    }

    // Stop output audio
    sourcesRef.current.forEach(source => {
      try { source.stop(); } catch (e) {}
    });
    sourcesRef.current.clear();

    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }

    if (isTalkingTimeoutRef.current) {
        clearTimeout(isTalkingTimeoutRef.current);
    }

    setIsConnected(false);
    setIsTalking(false);
    setError(null);
  }, []);

  const connect = useCallback(async () => {
    if (!agentConfig || !process.env.API_KEY) {
      setError("Configuration missing.");
      return;
    }

    try {
      setError(null);
      
      // 1. Setup Audio Output
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      audioContextRef.current = new AudioContextClass({ sampleRate: 24000 });
      nextStartTimeRef.current = audioContextRef.current.currentTime;

      // 2. Setup Audio Input
      const InputAudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      inputAudioContextRef.current = new InputAudioContextClass({ sampleRate: 16000 });
      
      // Get Microphone
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      // 3. Initialize Gemini
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const config = {
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: agentConfig.voiceName } },
          },
          systemInstruction: agentConfig.systemInstruction,
        },
      };

      // 4. Connect to Live API
      const sessionPromise = ai.live.connect({
        ...config,
        callbacks: {
          onopen: () => {
            console.log("Session opened");
            setIsConnected(true);

            // Start Audio Input Processing inside onopen
            if (!inputAudioContextRef.current || !streamRef.current) return;

            const inputCtx = inputAudioContextRef.current;
            const source = inputCtx.createMediaStreamSource(streamRef.current);
            inputSourceRef.current = source;

            // Buffer size 4096 provides a balance between latency and performance
            const processor = inputCtx.createScriptProcessor(4096, 1, 1);
            processorRef.current = processor;

            processor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const pcmBlob = createPcmBlob(inputData);
              
              // Send to Gemini
              sessionPromise.then((session) => {
                session.sendRealtimeInput({ media: pcmBlob });
              });
            };

            source.connect(processor);
            processor.connect(inputCtx.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
            // Handle Audio Output
            const base64Audio = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
            
            if (base64Audio && audioContextRef.current) {
              // Update visual state
              setIsTalking(true);
              if (isTalkingTimeoutRef.current) clearTimeout(isTalkingTimeoutRef.current);
              isTalkingTimeoutRef.current = window.setTimeout(() => setIsTalking(false), 2000); // Fallback to stop talking animation

              const ctx = audioContextRef.current;
              const pcmData = base64ToUint8Array(base64Audio);
              const audioBuffer = await decodeAudioData(pcmData, ctx, 24000, 1);
              
              const source = ctx.createBufferSource();
              source.buffer = audioBuffer;
              source.connect(ctx.destination);
              
              // Queue playback
              // Ensure we don't schedule in the past
              const now = ctx.currentTime;
              // Add a small buffer (e.g. 50ms) if starting from "now" to prevent glitches
              const startTime = Math.max(nextStartTimeRef.current, now + 0.05);

              source.start(startTime);
              nextStartTimeRef.current = startTime + audioBuffer.duration;
              
              sourcesRef.current.add(source);
              source.addEventListener('ended', () => {
                sourcesRef.current.delete(source);
                if (sourcesRef.current.size === 0) {
                    setIsTalking(false);
                }
              });
            }

            // Handle Interruption
            if (message.serverContent?.interrupted) {
               console.log("Interrupted");
               sourcesRef.current.forEach(src => {
                 try { src.stop(); } catch(e) {}
               });
               sourcesRef.current.clear();
               if (audioContextRef.current) {
                 nextStartTimeRef.current = audioContextRef.current.currentTime;
               }
               setIsTalking(false);
            }
          },
          onclose: () => {
            console.log("Session closed");
            disconnect();
          },
          onerror: (err) => {
            console.error("Session error", err);
            setError("Connection error occurred.");
            disconnect();
          }
        }
      });

      // Store session reference via the promise (the robust way shown in guidelines)
      sessionRef.current = await sessionPromise;

    } catch (err) {
      console.error("Failed to connect", err);
      setError("Failed to access microphone or connect to AI.");
      disconnect();
    }
  }, [agentConfig, disconnect]);

  // Automatically connect/disconnect based on modal state
  useEffect(() => {
    if (isOpen) {
      connect();
    } else {
      disconnect();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]); // Intentionally excluding connect/disconnect from deps to avoid loops, standard pattern for open/close

  return { isConnected, isTalking, error };
};