import type { Dispatch, SetStateAction } from "react";
import type { GamePlayerInfo, RoomPhase } from "./TicTacToeGameTypes";

export type SetPlayersInfos = Dispatch<SetStateAction<GamePlayerInfo[]>>;
export type SetPlayersReadyStatus = Dispatch<
  SetStateAction<Record<string, boolean>>
>;

export interface GameRestartConfig {
  setPhase: (phase: RoomPhase) => void;
  triggerReady: () => void;
}

export interface UseMultiPlayProps {
  phase: RoomPhase;
  setPhase: (phase: RoomPhase) => void;
  setPlayersInfos: SetPlayersInfos;
}

export interface UseSingleNextTurnConfig {
  isPlayerTurn: boolean;
  playersInfos: GamePlayerInfo[];
  moveHistory: any[];
  board: string[][];
  isGameOver: boolean;
}

export interface UseMultiNextTurnConfig {
  currentTurnPlayerId: string | null;
  isGameOver: boolean;
}

export interface UseReceiveMoveMadeConfig {
  playersInfos: GamePlayerInfo[];
}

export interface UseTicTacToeProps {
  playersInfos: GamePlayerInfo[];
  onExit?: () => void;
}

export interface UseSinglePlayProps {
  setPhase: (phase: RoomPhase) => void;
  playersInfos: GamePlayerInfo[];
  setPlayersInfos: SetPlayersInfos;
}

export interface UseSingleInitialBotSetupProps {
  playersInfos: GamePlayerInfo[];
  setPlayersInfos: SetPlayersInfos;
}
