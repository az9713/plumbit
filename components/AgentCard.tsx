import React from 'react';
import { AgentConfig } from '../types';

interface AgentCardProps {
  agent: AgentConfig;
  onCall: (agent: AgentConfig) => void;
}

export const AgentCard: React.FC<AgentCardProps> = ({ agent, onCall }) => {
  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100 hover:shadow-2xl transition-shadow duration-300 flex flex-col h-full">
      <div className={`${agent.avatarColor} p-6 flex items-center justify-center`}>
        <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
           <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
           </svg>
        </div>
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-slate-900 mb-1">{agent.name}</h3>
        <p className="text-sm font-medium text-slate-500 mb-4">{agent.role}</p>
        <p className="text-slate-600 mb-6 text-sm leading-relaxed flex-grow">
          {agent.type === 'SUPPORT' 
            ? "Need to schedule a maintenance check or have questions about our pricing? Chat with Sarah." 
            : "Burst pipe? Flooding? Don't wait. Dispatcher Dan will get a truck to you immediately."}
        </p>
        <button
          onClick={() => onCall(agent)}
          className={`w-full py-3 px-4 rounded-lg font-semibold text-white shadow-md hover:opacity-90 transition-all active:scale-95 flex items-center justify-center gap-2 ${
            agent.type === 'EMERGENCY' ? 'bg-red-600 shadow-red-200' : 'bg-blue-600 shadow-blue-200'
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
          Call Now
        </button>
      </div>
    </div>
  );
};