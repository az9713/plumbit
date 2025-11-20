import React from 'react';
import { AgentConfig } from '../types';
import { useGeminiLive } from '../hooks/useGeminiLive';

interface LiveAgentModalProps {
  isOpen: boolean;
  onClose: () => void;
  agent: AgentConfig | null;
}

export const LiveAgentModal: React.FC<LiveAgentModalProps> = ({ isOpen, onClose, agent }) => {
  const { isConnected, isTalking, error } = useGeminiLive({ agentConfig: agent, isOpen });

  if (!isOpen || !agent) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm transition-opacity">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden relative animate-fade-in-up">
        
        {/* Header */}
        <div className={`${agent.avatarColor} p-6 text-white text-center relative transition-colors duration-500`}>
          <h3 className="text-2xl font-bold mb-1">{agent.name}</h3>
          <p className="text-white/80 text-sm font-medium tracking-wide uppercase">{isConnected ? 'Connected' : 'Connecting...'}</p>
          
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-white/70 hover:text-white bg-black/10 hover:bg-black/20 rounded-full p-2 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body / Visualizer */}
        <div className="p-8 flex flex-col items-center justify-center min-h-[300px] bg-slate-50">
          
          {error ? (
             <div className="text-center text-red-600 bg-red-50 p-4 rounded-lg border border-red-100">
                <p className="font-semibold">Error</p>
                <p className="text-sm">{error}</p>
                <button onClick={onClose} className="mt-4 text-sm underline">Close</button>
             </div>
          ) : (
            <>
              <div className="relative w-32 h-32 mb-8 flex items-center justify-center">
                {/* Ripple Effect when talking */}
                {isTalking && (
                   <>
                     <div className={`absolute inset-0 rounded-full ${agent.avatarColor} opacity-20 animate-ping`}></div>
                     <div className={`absolute inset-2 rounded-full ${agent.avatarColor} opacity-30 animate-pulse`}></div>
                   </>
                )}
                
                {/* Central Icon */}
                <div className={`relative z-10 w-24 h-24 rounded-full shadow-lg flex items-center justify-center ${agent.avatarColor} text-white transition-all duration-300 ${isTalking ? 'scale-110' : 'scale-100'}`}>
                    {isTalking ? (
                        <div className="flex gap-1 h-8 items-center">
                           <div className="w-1 bg-white/80 rounded-full waveform-bar" style={{animationDelay: '0ms'}}></div>
                           <div className="w-1 bg-white/80 rounded-full waveform-bar" style={{animationDelay: '100ms'}}></div>
                           <div className="w-1 bg-white/80 rounded-full waveform-bar" style={{animationDelay: '200ms'}}></div>
                           <div className="w-1 bg-white/80 rounded-full waveform-bar" style={{animationDelay: '300ms'}}></div>
                        </div>
                    ) : (
                        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                        </svg>
                    )}
                </div>
              </div>

              <p className="text-slate-500 text-center mb-8 max-w-[80%]">
                {isConnected 
                  ? "Listening... Go ahead and speak." 
                  : "Establishing secure connection to HQ..."}
              </p>

              <button 
                onClick={onClose}
                className="w-full bg-slate-200 text-slate-700 py-3 rounded-lg font-semibold hover:bg-slate-300 transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 15v-1a4 4 0 00-4-4H8m0 0l3 3m-3-3l3-3m9 14V5a2 2 0 00-2-2H6a2 2 0 00-2 2v16l4-2 4 2 4-2 4 2z" />
                </svg>
                End Call
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};