import { io, Socket } from 'socket.io-client';
import { CompanyStats, GlobalMetrics, News, GameEvent, GameStateEnum, Decision } from './stores/gameStore';

export interface ServerToClientEvents {
  gameStateUpdate: (state: GameStateEnum) => void;
  companyUpdate: (company: Partial<CompanyStats>) => void;
  worldUpdate: (world: Partial<GlobalMetrics>) => void;
  newsAdded: (news: News) => void;
  eventTriggered: (event: GameEvent) => void;
  error: (msg: string) => void;
}

export interface ClientToServerEvents {
  joinGame: (gameId: string, playerId: string) => void;
  submitDecision: (decision: Decision) => void;
}

let socket: Socket<ServerToClientEvents, ClientToServerEvents> | null = null;

export const createSocket = (serverUrl: string): Socket<ServerToClientEvents, ClientToServerEvents> => {
  if (!socket) {
    socket = io(serverUrl, {
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });
  }
  return socket;
};

export const getSocket = (): Socket<ServerToClientEvents, ClientToServerEvents> | null => {
  return socket;
};
