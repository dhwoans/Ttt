const WebSocket = require("ws");

// Create a WebSocket server on port 8080
const wss = new WebSocket.Server({ port: 8080 });
const player = [];
console.log("WebSocket server is running on ws://localhost:8080");

// Connection event handler
wss.on("connection", (ws) => {
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
      systemChat("info", { status: "connected" });
    } else if (message.type === "move") {
      systemChat("move", { move: message.move });
    } else if (message.type === "chat") {
      clientsChat(ws, "chat", { message: message.message });
    }
  });

  // Close event handler
  ws.on("close", () => {
    console.log("Client disconnected");
  });
});

function systemChat(type, message) {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      const sendMessage = {
        type: type,
        ...message,
      };
      client.send(JSON.stringify(sendMessage));
    }
  });
}
function clientsChat(ws, type, message) {
  wss.clients.forEach((client) => {
    if (client !== ws && client.readyState === WebSocket.OPEN) {
      const sendMessage = {
        type: type,
        ...message,
      };
      client.send(JSON.stringify(sendMessage));
    }
  });
}
