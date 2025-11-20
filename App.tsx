import React, { useState } from 'react';
import { AGENTS } from './constants';
import { AgentConfig } from './types';
import { AgentCard } from './components/AgentCard';
import { LiveAgentModal } from './components/LiveAgentModal';
import { Services } from './components/Services';

const App: React.FC = () => {
  const [activeAgent, setActiveAgent] = useState<AgentConfig | null>(null);

  const handleCall = (agent: AgentConfig) => {
    setActiveAgent(agent);
  };

  const handleCloseModal = () => {
    setActiveAgent(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Navbar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>
              <span className="font-bold text-xl tracking-tight text-slate-900">Plumbit</span>
            </div>
            <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-600">
              <a href="#" className="hover:text-blue-600">Services</a>
              <a href="#" className="hover:text-blue-600">About</a>
              <a href="#" className="hover:text-blue-600">Testimonials</a>
              <span className="text-blue-600 font-semibold">1-800-PLUMBIT</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="bg-slate-900 text-white py-20 sm:py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1603064752734-4c48eff53d05?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight mb-6">
            Plumbing problems <span className="text-blue-400">solved fast.</span>
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-10">
            From scheduling routine checks to 24/7 emergency dispatch, our AI-powered team is ready to help you instantly.
          </p>
        </div>
      </div>

      {/* Agents Section - The Call to Action */}
      <div className="relative -mt-20 z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-12">
          <AgentCard agent={AGENTS.SUPPORT} onCall={handleCall} />
          <AgentCard agent={AGENTS.EMERGENCY} onCall={handleCall} />
        </div>
      </div>

      {/* Services Section */}
      <Services />

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="mb-4">&copy; {new Date().getFullYear()} Plumbit Inc. All rights reserved.</p>
          <p className="text-sm text-slate-600">
            This is a demo application using Google Gemini Live API.
          </p>
        </div>
      </footer>

      {/* Active Call Modal */}
      <LiveAgentModal 
        isOpen={!!activeAgent} 
        agent={activeAgent} 
        onClose={handleCloseModal} 
      />
    </div>
  );
};

export default App;