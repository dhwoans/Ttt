import type { Socket } from "socket.io";

/**
 * Socket 에러 응답을 표준화하는 유틸리티.
 *
 * 분산된 ERROR emit 코드를 한 곳으로 모아 메시지 형식을 일관되게 유지한다.
 */
class SocketErrorResponder {
  /**
   * 클라이언트에 ERROR 이벤트만 전송한다.
   */
  emit(socket: Socket, message: string) {
    socket.emit("ERROR", { message });
  }

  /**
   * ERROR 이벤트 전송 후 즉시 연결을 종료한다.
   */
  emitAndDisconnect(socket: Socket, message: string) {
    this.emit(socket, message);
    socket.disconnect();
  }
}

export default SocketErrorResponder;


