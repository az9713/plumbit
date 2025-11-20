export enum AgentType {
  SUPPORT = 'SUPPORT',
  EMERGENCY = 'EMERGENCY'
}

export interface ServiceItem {
  title: string;
  description: string;
  icon: React.ReactNode;
}

export interface AgentConfig {
  type: AgentType;
  name: string;
  role: string;
  voiceName: string; // 'Puck', 'Charon', 'Kore', 'Fenrir', 'Zephyr'
  systemInstruction: string;
  avatarColor: string;
}

export interface AudioVisualizerState {
  isTalking: boolean;
  volume: number;
}