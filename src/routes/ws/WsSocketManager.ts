import { type WebSocket, WebSocketServer } from "ws";
import type SocketManager from "../SocketManger.js";
import Receiver from "../Receiver.js";
import SessionManager from "./SessionManager.js";

import http from "http";

class WsSocketManager implements SocketManager {
  receiver: Receiver;
  sessionManger: SessionManager;

  private wss: WebSocketServer;
  private heartbeatInterval = 3000;

  constructor(
    server: http.Server,
    receiver: Receiver,
    sessionManger: SessionManager
  ) {
    this.wss = new WebSocketServer({ server });
    this.receiver = receiver;
    this.sessionManger = sessionManger;
  }
  init() {
    this.setupEventListeners();
    this.startHeartbeat();
  }
  setupEventListeners() {
    this.wss.on("connection", (ws: WebSocket) => {
      // 하트비트 초기화
      ws.isAlive = true;
      ws.on("pong", () => {
        console.log(`${ws.id} : 신호 받음`);
        ws.isAlive = true;
      });

      this.connection(ws);
    });
  }

  startHeartbeat() {
    setInterval(() => {
      this.wss.clients.forEach((ws: WebSocket) => {
        if (!ws.isAlive) {
          console.log(`${ws.id} terminated.`);
          return ws.terminate();
        }
        ws.isAlive = false;
        ws.ping();
      });
    }, this.heartbeatInterval);
  }

  connection(ws: WebSocket): void {
    ws.on("message", (rawMessage) => {
      let message;

      message = JSON.parse(rawMessage.toString());

      // 세션 관리
      if (message.type === "JOIN") {
        ws.id = message.sender;
        this.sessionManger.setConnId(message.sender, ws);
        console.log(`client ${ws.id} in`);
      }
      // ws.id가 없다면 비정상적 접속
      if (!ws.id) {
        throw new Error("Unauthorized: Login required.");
      }
      console.log(`${this.constructor.name} receive json`);
      console.log(`${JSON.stringify(message, null, 2)}`);
      const connId = ws.id || message.sender;
      this.receiver.handleMessage(message, connId);
    });

    // Close event handler
    ws.on("close", () => {
      const id = ws.id;

      if (id && this.sessionManger.getConnId(id)) {
        //게임 복구 로직

        // this.session.deleteConnId(id);

        console.log(`client ${id} out`);
      }
    });
  }
}

export default WsSocketManager;
