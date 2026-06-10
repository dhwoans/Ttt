// import { useEffect, useRef } from "react";
// import io from "socket.io-client";
// import { eventManager } from "@/shared/managers/EventManager";
// import { LOBBY_EVENTS } from "@/shared/constants/eventList";
// //
// export function useLobbySocket() {
//   const socketRef = useRef(null);

//   useEffect(() => {
//     const userId = "from-zustand";

//     // 소켓 연결
//     socketRef.current = io("/lobby", {
//       path: "/ws/",
//       auth: { userId },
//     });

//     const LOBBY_EVENT_NAMES = {
//       JOIN: "joinLobby",
//       CREATE: "ROOM_CREATE",
//       REMOVE: "ROOM_REMOVE",
//       PLUS: "PLAYER_PLUS",
//       MINUS: "PLAYER_MINUS",
//     };

//     // 연결 성공 핸들러
//     socketRef.current.on("connect", () => {
//       console.log("서버 연결 성공. ID:", socketRef.current.id);
//       socketRef.current.emit("joinLobby", socketRef.current.id);
//     });

//     // 메시지 핸들러 등록
//     LOBBY_EVENTS.forEach(({ name, handler, log }) => {
//       socketRef.current.on(name, (data) => {
//         if (log) {
//           console.log(`[${name}] Received:`, JSON.stringify(data, null, 2));
//         }

//         // 이벤트 버스로 보냄
//         switch (name) {
//           case "joinLobby":
//             eventManager.emit(LOBBY_EVENT_NAMES.JOIN, data);
//             console.log("로비 입장 완료");
//             break;
//           case "ROOM_CREATE":
//             eventManager.emit(LOBBY_EVENT_NAMES.CREATE, data);
//             break;
//           case "ROOM_REMOVE":
//             eventManager.emit(LOBBY_EVENT_NAMES.REMOVE, data);
//             break;
//           case "PLAYER_PLUS":
//             eventManager.emit(LOBBY_EVENT_NAMES.PLUS, data);
//             break;
//           case "PLAYER_MINUS":
//             eventManager.emit(LOBBY_EVENT_NAMES.MINUS, data);
//             break;
//           default:
//             console.warn(`[Warning] 알 수 없는 이벤트: ${name}`);
//         }
//       });
//     });

//     // 클린업
//     return () => {
//       if (socketRef.current) {
//         socketRef.current.disconnect();
//       }
//     };
//   }, []);

//   const disconnect = () => {
//     if (socketRef.current) {
//       socketRef.current.disconnect();
//     }
//   };

//   return {
//     socket: socketRef.current,
//     disconnect,
//   };
// }
