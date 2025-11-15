import WebSocket, { WebSocketServer } from "ws";
class Socket {
  constructor(port, controller) {
    this.wss = new WebSocketServer({ port: port });
    this.controller = controller;
    this.clientsId = new Map();
    this.#setupEventListeners();
  }
  #setupEventListeners() {
    this.wss.on("connection", (ws) => {this.connection(ws);});
  }
  connection(ws) {
    ws.on("message", (message) => {
      try {
        message = JSON.parse(message.toString());
      } catch (e) {
        ws.send(
          JSON.stringify({ type: "error", message: "Invalid JSON format." })
        );
        return;
      }
      if(!this.clientsId[message.message])this.clientsId.set(message.message,ws)
      const result = this.controller.sendService(message);
      this.#systemChat(result)
    });
    // Close event handler
    ws.on("close", () => {

      console.log("Client disconnected");
    });
  }
  #systemChat([clients,data]) {
    clients.forEach((id) => {
      const client = this.clientsId.get(id)
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(data));
      }
    });
  }
}
export default Socket;
