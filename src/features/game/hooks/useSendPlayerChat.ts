// import { gameSocketManager } from "@/shared/managers/SocketManager";

// /**
//  * 채팅 메시지를 서버에 전송하는 훅
//  */
// export function useSendPlayerChat() {
//   const getSessionInfo = () => ({
//     roomId: sessionStorage.getItem("roomId"),
//     userId: "from-zustand",
//     nickname: "from-zustand",
//   });

//   const sendChat = (message: string) => {
//     const { roomId, userId, nickname } = getSessionInfo();
//     gameSocketManager.sendMessage("CHAT", {
//       type: "CHAT",
//       message: message,
//       sender: nickname,
//     });
//   };

//   return { sendChat };
// }
