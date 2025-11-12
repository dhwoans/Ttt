import WebSocket, { WebSocketServer } from "ws";
class Socket {
  constructor(port) {
    this.wss = new WebSocketServer({ port:port });
    this.#setupEventListeners();
  }
  #setupEventListeners() {
    console.log("connecting start");
    this.wss.on("connection", (ws) => {
      console.log("New client connected");

      ws.on("message", (message) => {
        // 수신된 메시지를 문자열로 변환 (Buffer 형태일 수 있으므로)
        try {
          // 💡 3. JSON 파싱
          message = JSON.parse(message.toString());
        } catch (e) {
          ws.send(
            JSON.stringify({ type: "error", message: "Invalid JSON format." })
          );
          return;
        }
        if (message.type === "info") {
          this.#systemChat("info", { status: "connected" });
        } else if (message.type === "move") {
          this.#systemChat("move", { move: message.move });
        } else if (message.type === "chat") {
          this.#clientsChat(ws, "chat", { message: message.message });
        }
      });

      // Close event handler
      ws.on("close", () => {
        console.log("Client disconnected");
      });
    });
  }
  #systemChat(type, message) {
    this.wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        const sendMessage = {
          type: type,
          ...message,
        };
        client.send(JSON.stringify(sendMessage));
      }
    });
  }
  #clientsChat(ws, type, message) {
    this.wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        const sendMessage = {
          type: type,
          ...message,
        };
        client.send(JSON.stringify(sendMessage));
      }
    });
  }
}
export default Socket;
