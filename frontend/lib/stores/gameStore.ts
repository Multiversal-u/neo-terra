import { create } from 'zustand';

export interface CompanyStats {
  capital: number;
  employeeSatisfaction: number;
  publicPerception: number;
  marketShare: number;
  sustainabilityIndex: number;
  productQuality: number;
  innovationLevel: number;
  operationalEfficiency: number;
  resourceUsage: number;
  wasteProduced: number;
  riskExposure: number;
  complianceScore: number;
  carbonFootprint: number;
}

export interface GlobalMetrics {
  globalTemperature: number;
  seaLevelRise: number;
  atmosphericCO2: number;
  globalEconomy: number;
  socialStability: number;
  resourceAvailability: number;
  biodiversityIndex: number;
}

export type GameStateEnum = 'LOBBY' | 'PLAYING' | 'ROUND_END' | 'FINISHED';

export interface Decision {
  id: string;
  type: string;
  investmentAmount: number;
  description: string;
  targetMetric: keyof CompanyStats | keyof GlobalMetrics;
}

export interface News {
  id: string;
  headline: string;
  content: string;
  timestamp: number;
  impact: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL';
}

export interface GameEvent {
  id: string;
  title: string;
  description: string;
  severity: number;
  affectedMetrics: Array<keyof GlobalMetrics>;
}

export interface GameStoreState {
  gameId: string | null;
  playerId: string | null;
  companyState: CompanyStats | null;
  gameState: GameStateEnum;
  globalWorld: GlobalMetrics | null;
  currentDecision: Partial<Decision> | null;
  news: News[];
  events: GameEvent[];
  
  // Actions
  joinGame: (gameId: string, playerId: string) => void;
  submitDecision: (decision: Decision) => void;
  updateCompany: (stats: Partial<CompanyStats>) => void;
  updateWorld: (metrics: Partial<GlobalMetrics>) => void;
  addNews: (newsItem: News) => void;
  addEvent: (eventItem: GameEvent) => void;
  setCurrentDecision: (decision: Partial<Decision> | null) => void;
  setGameState: (state: GameStateEnum) => void;
}

export const useGameStore = create<GameStoreState>((set) => ({
  gameId: null,
  playerId: null,
  companyState: null,
  gameState: 'LOBBY',
  globalWorld: null,
  currentDecision: null,
  news: [],
  events: [],
  
  joinGame: (gameId, playerId) => set({ gameId, playerId }),
  submitDecision: (decision) => set((state) => ({ currentDecision: null })), 
  updateCompany: (stats) => set((state) => ({ companyState: state.companyState ? { ...state.companyState, ...stats } : stats as CompanyStats })),
  updateWorld: (metrics) => set((state) => ({ globalWorld: state.globalWorld ? { ...state.globalWorld, ...metrics } : metrics as GlobalMetrics })),
  addNews: (newsItem) => set((state) => ({ news: [newsItem, ...state.news] })),
  addEvent: (eventItem) => set((state) => ({ events: [eventItem, ...state.events] })),
  setCurrentDecision: (decision) => set({ currentDecision: decision }),
  setGameState: (gameState) => set({ gameState }),
}));
