// import { useState, useEffect, useRef } from "react";
// import { eventManager } from "@/shared/services/EventManager";
// import SpeechBalloon from "./SpeechBalloon";
// import { ChevronDown, X, MessageSquare } from "lucide-react";
// import { ImageManager } from "@/shared/services/ImageManger";

// export default function Chat({ sender }) {
//   const [message, setMessage] = useState("");
//   const [chatLogs, setChatLogs] = useState([]);
//   const [isExpanded, setIsExpanded] = useState(false);
//   const inputRef = useRef(null);
//   const messagesEndRef = useRef(null);

//   useEffect(() => {
//     const updateChat = (data) => {
//       const [type, messageText, senderName] = data;
//       setChatLogs((prev) => [
//         { type, message: messageText, sender: senderName, id: Date.now() },
//         ...prev,
//       ]);
//     };

//     eventManager.on("JOIN", updateChat);
//     eventManager.on("LEAVE", updateChat);
//     eventManager.on("CHAT", updateChat);
//     eventManager.on("MOVE", updateChat);

//     return () => {
//       eventManager.off("JOIN", updateChat);
//       eventManager.off("LEAVE", updateChat);
//       eventManager.off("CHAT", updateChat);
//       eventManager.off("MOVE", updateChat);
//     };
//   }, []);

//   const handleMessage = () => {
//     if (message.trim() === "") {
//       inputRef.current?.focus();
//       return;
//     }
//     eventManager.emit("CHAT", message);
//     setMessage("");
//   };

//   const handleKeyDown = (e) => {
//     if (e.key === "Enter") {
//       handleMessage();
//     }
//   };

//   return (
//     <div className="fixed bottom-4 right-4">
//       {/* Collapsed: circular trigger */}
//       {!isExpanded && (
//         <button
//           onClick={() => setIsExpanded(true)}
//           className="
//             h-16 w-16 rounded-full
//             bg-dark-2
//             border-4 border-black
//             shadow-[5px_5px_0px_0px_rgba(0,0,0,1)]
//             flex items-center justify-center
//             hover:shadow-none hover:translate-x-1 hover:translate-y-1
//             transition-all
//           "
//           aria-label="채팅 열기"
//         >
//           <img
//             src={ImageManager.thoughtBalloon}
//             alt="채팅"
//             className="h-8 w-8 object-contain"
//           />
//           {chatLogs.length > 0 && (
//             <span
//               className="
//               absolute -top-1 -right-1
//               px-2 py-0.5 rounded-full text-xs font-bold
//               bg-accent border-2 border-black text-dark-2
//             "
//             >
//               {chatLogs.length}
//             </span>
//           )}
//         </button>
//       )}

//       {/* Expanded: circular panel */}
//       {isExpanded && (
//         <div
//           className="
//             relative
//             h-80 w-96 rounded-2xl
//             bg-white
//             border-4 border-black
//             shadow-[5px_5px_0px_0px_rgba(0,0,0,1)]
//             overflow-hidden
//             transition-all
//             p-4
//             flex flex-col
//           "
//         >
//           {/* Close button */}
//           <button
//             onClick={() => setIsExpanded(false)}
//             className="
//               absolute top-3 right-3
//               h-8 w-8 rounded-full
//               border-2 border-black
//               flex items-center justify-center
//               hover:bg-dark-1 transition-colors group
//             "
//             aria-label="채팅 닫기"
//           >
//             <X
//               size={18}
//               strokeWidth={2.5}
//               className="text-dark-2 group-hover:text-white transition-colors"
//             />
//           </button>

//           {/* Messages */}
//           <div className="flex-1 min-h-0 overflow-y-auto space-y-2 pr-2">
//             {chatLogs.length === 0 ? (
//               <div className="flex flex-col items-center justify-center">
//                 <img
//                   className="w-30 h-30"
//                   src={ImageManager.writingHand}
//                   alt="writingHand"
//                 />
//                 <p className="text-sm text-gray-400 text-center mt-8">
//                   메시지가 없습니다
//                 </p>
//               </div>
//             ) : (
//               chatLogs.map((log) => (
//                 <SpeechBalloon
//                   key={log.id}
//                   type={log.type}
//                   message={log.message}
//                   sender={log.sender}
//                 />
//               ))
//             )}
//             <div ref={messagesEndRef} />
//           </div>

//           {/* Input */}
//           <div className="flex gap-2 pt-2">
//             <input
//               ref={inputRef}
//               type="text"
//               value={message}
//               onChange={(e) => setMessage(e.target.value)}
//               onKeyDown={handleKeyDown}
//               placeholder="메시지를 입력하세요"
//               className="
//                 flex-1 min-w-0 px-3 py-2
//                 border-3 border-black rounded-full
//                 text-base text-dark-2
//                 focus:outline-none
//                 focus:ring-2 focus:ring-accent
//                 placeholder:text-gray-400
//                 bg-white
//               "
//             />
//             <button
//               onClick={handleMessage}
//               className="
//                 px-3 py-2
//                 bg-accent
//                 border-3 border-black rounded-full
//                 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]
//                 hover:shadow-none
//                 hover:translate-x-0.75 hover:translate-y-0.75
//                 transition-all active:scale-95
//                 font-bold text-white
//               "
//             >
//               전송
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
