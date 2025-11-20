import React from 'react';
import { AgentType, AgentConfig, ServiceItem } from './types';

export const AGENTS: Record<AgentType, AgentConfig> = {
  [AgentType.SUPPORT]: {
    type: AgentType.SUPPORT,
    name: "Sarah (Front Desk)",
    role: "General Inquiries & Scheduling",
    voiceName: "Kore",
    avatarColor: "bg-blue-500",
    systemInstruction: `You are Sarah, the friendly and professional front desk receptionist for Plumbit, a local plumbing company. 
    Your goal is to help customers schedule appointments, answer general questions about services, and provide pricing estimates (ranges only).
    
    Key Traits:
    - Tone: Warm, welcoming, patient, and helpful.
    - Services: We do drain cleaning ($150-$300), water heater repair ($200+), and general pipe maintenance.
    - Availability: We are open 8 AM to 6 PM, Monday through Saturday.
    - If they have a bursting pipe or flooding, politely transfer them to the Emergency Dispatch line (tell them to hang up and click the red button).
    
    Keep your responses concise and conversational, like a real phone operator.`
  },
  [AgentType.EMERGENCY]: {
    type: AgentType.EMERGENCY,
    name: "Dispatcher Dan",
    role: "Emergency Response",
    voiceName: "Fenrir",
    avatarColor: "bg-red-600",
    systemInstruction: `You are Dan, the emergency dispatcher for Plumbit. You handle urgent situations like burst pipes, major leaks, and sewage backups.
    
    Key Traits:
    - Tone: Calm, authoritative, efficient, and reassuring.
    - Priority: Get the customer's address immediately and understand the severity of the leak.
    - Instruction: Tell them how to shut off their main water valve if water is actively flowing.
    - Action: Assure them a technician is being routed to their location.
    - Do not waste time with pleasantries. This is an emergency line.
    
    Keep responses short and action-oriented.`
  }
};

export const SERVICES: ServiceItem[] = [
  {
    title: "Drain Cleaning",
    description: "Professional snaking and hydro-jetting to clear stubborn clogs instantly.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
      </svg>
    )
  },
  {
    title: "Water Heaters",
    description: "Repair, maintenance, and installation of tankless and traditional units.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
      </svg>
    )
  },
  {
    title: "Leak Detection",
    description: "Advanced electronic leak detection to find hidden leaks behind walls.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    )
  },
  {
    title: "Pipe Repair",
    description: "Full service repiping and spot repairs for copper, PVC, and PEX.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    )
  }
];