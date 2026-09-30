import { useEffect, useState } from 'react';
import { createSocket, getSocket } from '../socket';
import { useGameStore, GameStateEnum, CompanyStats, GlobalMetrics, News, GameEvent, Decision } from '../stores/gameStore';
import { useDashboardStore } from '../stores/dashboardStore';

export const useSocket = (serverUrl: string, isDashboard: boolean = false) => {
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const gameStore = useGameStore();
  const dashboardStore = useDashboardStore();

  useEffect(() => {
    const socket = createSocket(serverUrl);

    const onConnect = () => {
      setIsConnected(true);
      setError(null);
    };

    const onDisconnect = () => {
      setIsConnected(false);
    };

    const onGameStateUpdate = (state: GameStateEnum) => {
      gameStore.setGameState(state);
    };

    const onCompanyUpdate = (company: Partial<CompanyStats>) => {
      gameStore.updateCompany(company);
    };

    const onWorldUpdate = (world: Partial<GlobalMetrics>) => {
      gameStore.updateWorld(world);
      if (isDashboard) {
        dashboardStore.updateGlobalWorld(world);
      }
    };

    const onNewsAdded = (news: News) => {
      gameStore.addNews(news);
      if (isDashboard) {
        dashboardStore.addNews(news);
      }
    };

    const onEventTriggered = (event: GameEvent) => {
      gameStore.addEvent(event);
      if (isDashboard) {
        dashboardStore.addEvent(event);
      }
    };

    const onError = (msg: string) => {
      setError(msg);
    };

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('gameStateUpdate', onGameStateUpdate);
    socket.on('companyUpdate', onCompanyUpdate);
    socket.on('worldUpdate', onWorldUpdate);
    socket.on('newsAdded', onNewsAdded);
    socket.on('eventTriggered', onEventTriggered);
    socket.on('error', onError);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('gameStateUpdate', onGameStateUpdate);
      socket.off('companyUpdate', onCompanyUpdate);
      socket.off('worldUpdate', onWorldUpdate);
      socket.off('newsAdded', onNewsAdded);
      socket.off('eventTriggered', onEventTriggered);
      socket.off('error', onError);
    };
  }, [serverUrl, isDashboard, gameStore, dashboardStore]);

  const joinGame = (gameId: string, playerId: string) => {
    const socket = getSocket();
    if (socket && isConnected) {
      socket.emit('joinGame', gameId, playerId);
      gameStore.joinGame(gameId, playerId);
    }
  };

  const submitDecision = (decision: Decision) => {
    const socket = getSocket();
    if (socket && isConnected) {
      socket.emit('submitDecision', decision);
      gameStore.setCurrentDecision(null); 
    }
  };

  return { isConnected, error, joinGame, submitDecision };
};
