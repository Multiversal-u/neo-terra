import { create } from 'zustand';
import { CompanyStats, GlobalMetrics, News, GameEvent } from './gameStore';

export interface CompanyData {
  id: string;
  name: string;
  stats: CompanyStats;
}

export interface RoundHistoryEntry {
  roundNumber: number;
  globalWorldAtEnd: GlobalMetrics;
  companiesAtEnd: CompanyData[];
  eventsTriggered: GameEvent[];
  newsPublished: News[];
}

export interface DashboardStoreState {
  allCompanies: CompanyData[];
  globalWorld: GlobalMetrics | null;
  events: GameEvent[];
  news: News[];
  roundHistory: RoundHistoryEntry[];

  // Actions
  setAllCompanies: (companies: CompanyData[]) => void;
  updateGlobalWorld: (metrics: Partial<GlobalMetrics>) => void;
  addEvent: (event: GameEvent) => void;
  addNews: (newsItem: News) => void;
  addRoundHistory: (historyEntry: RoundHistoryEntry) => void;
}

export const useDashboardStore = create<DashboardStoreState>((set) => ({
  allCompanies: [],
  globalWorld: null,
  events: [],
  news: [],
  roundHistory: [],
  
  setAllCompanies: (companies) => set({ allCompanies: companies }),
  updateGlobalWorld: (metrics) => set((state) => ({ globalWorld: state.globalWorld ? { ...state.globalWorld, ...metrics } : metrics as GlobalMetrics })),
  addEvent: (event) => set((state) => ({ events: [event, ...state.events] })),
  addNews: (newsItem) => set((state) => ({ news: [newsItem, ...state.news] })),
  addRoundHistory: (historyEntry) => set((state) => ({ roundHistory: [...state.roundHistory, historyEntry] })),
}));
