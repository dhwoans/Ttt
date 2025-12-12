export default interface SocketMessage {
  type: string;
  message: Array<string>;
  sender: string;
}
