import type WSController from "../controller/WSContrller.js";
import type SocketMessage from "../dtos/SocketMessage.dto.js";
interface RoutesMap {
    [key: string]: (message: SocketMessage, connId: string) => void;
}
declare class Receiver {
    controller: WSController;
    routes: RoutesMap;
    constructor(controller: WSController);
    /**
     * @description 흐름제어
     */
    handleMessage(message: SocketMessage, connId: string): void;
}
export default Receiver;
//# sourceMappingURL=Receiver.d.ts.map