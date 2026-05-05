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

export interface UseSingleNextTurnConfig {
  isPlayerTurn: boolean;
  moveHistory: any[];
  board: string[][];
  isGameOver: boolean;
}

export interface UseMultiNextTurnConfig {
  currentTurnPlayerId: string | null;
  isGameOver: boolean;
}

export interface UseTicTacToeProps {
  onExit?: () => void;
}

export interface UseSingleInitialBotSetupProps {
  placeholder?: never;
}
