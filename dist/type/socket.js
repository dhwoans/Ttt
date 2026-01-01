export const SOCKET_EVENTS = [
  "JOIN",
  "LEAVE",
  "CHAT",
  "READY",
  "MOVE",
  "GAME_START",
];

export const EMIT_MODES = {
  UNICAST: "UNICAST",
  BROADCAST: "BROADCAST",
  EXCEPT_ME: "EXCEPT_ME",
};

export default {
  SOCKET_EVENTS,
  EMIT_MODES,
};
