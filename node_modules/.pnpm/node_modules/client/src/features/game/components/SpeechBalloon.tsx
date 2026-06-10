// import { useUserStore } from "@/stores/useUserStore";

// // 채팅박스 안 메시지 UI
// export default function SpeechBalloon({ type, message, sender }) {
//   const myNickname = useUserStore((state) => state.currentUser?.nickname);
//   const isSystem = sender === "system";
//   const iscurrentUser = sender === myNickname;

//   if (isSystem) {
//     return (
//       <li className="flex justify-center">
//         <p className="px-4 py-2 bg-gray-200 text-gray-700 rounded-full text-sm border-2 border-gray-300">
//           {message}
//         </p>
//       </li>
//     );
//   }

//   if (type === "CHAT") {
//     if (iscurrentUser) {
//       return (
//         <li className="flex justify-end items-end gap-2">
//           <small className="text-xs text-gray-600 mb-1">{sender}</small>
//           <p className="px-4 py-2 bg-accent text-black rounded-2xl rounded-br-none border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] wrap-break-word">
//             {message}
//           </p>
//         </li>
//       );
//     } else {
//       return (
//         <li className="flex justify-start items-end gap-2">
//           <p className="px-4 py-2 bg-white text-black rounded-2xl rounded-bl-none border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] wrap-break-word">
//             {message}
//           </p>
//           <small className="text-xs text-gray-600 mb-1">{sender}</small>
//         </li>
//       );
//     }
//   }

//   return (
//     <li className="flex justify-center">
//       <p className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm border-2 border-blue-300">
//         {message}
//       </p>
//     </li>
//   );
// }
