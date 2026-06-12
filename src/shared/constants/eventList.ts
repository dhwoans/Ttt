// 이벤트 이름을 지을 때 대상:액션

interface EventConfig {
  name: string;
  handler: string;
  log?: boolean;
}

export const GAME_EVENTS: EventConfig[] = [
  { name: "CONNECTED", handler: "handleConnected", log: true },
  { name: "ROOM_ASSIGNED", handler: "handleRoomAssigned", log: true },
  { name: "EXISTING_PLAYERS", handler: "handleExistingPlayers", log: true },
  { name: "PLAYER_JOINED", handler: "handlePlayerJoined", log: true },
  { name: "PLAYER_READY", handler: "handlePlayerReady", log: true },
  { name: "PLAYING", handler: "handlePlaying", log: true },
  {
    name: "READY_TIMEOUT_STARTED",
    handler: "handleReadyTimeoutStarted",
    log: true,
  },
  {
    name: "READY_TIMEOUT_CANCELED",
    handler: "handleReadyTimeoutCanceled",
    log: true,
  },
  {
    name: "READY_TIMEOUT_EXPIRED",
    handler: "handleReadyTimeoutExpired",
    log: true,
  },
  { name: "MOVE_MADE", handler: "handleMoveMade", log: true },
  {
    name: "TURN_TIMEOUT_STARTED",
    handler: "handleTurnTimeoutStarted",
    log: true,
  },
  { name: "NEXT_TURN", handler: "handleNextTurn", log: true },
  { name: "GAME_OVER", handler: "handleGameOver", log: true },
  { name: "LEAVE_SUCCESS", handler: "handleLeaveSuccess", log: true },
  { name: "PLAYER_LEFT", handler: "handlePlayerLeft", log: true },
  { name: "ERROR", handler: "handleError", log: true },
];

// LOBBY_EVENTS:
// export const LOBBY_EVENTS: EventConfig[] = [
//   { name: "connect", handler: "handleConnect", log: true },
//   { name: "joinLobby", handler: "handleJoinLobby", log: true },
//   { name: "ROOM_CREATE", handler: "handleRoomCreate", log: true },
//   { name: "ROOM_REMOVE", handler: "handleRoomRemove", log: true },
//   { name: "PLAYER_PLUS", handler: "handlePlayerPlus", log: true },
//   { name: "PLAYER_MINUS", handler: "handlePlayerMinus", log: true },
// ];
