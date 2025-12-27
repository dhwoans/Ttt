import type Controller from "../controller/Controller.js";
import type SocketMessage from "../dtos/SocketMessage.dto.js";
interface RoutesMap {
    [key: string]: (message: SocketMessage, connId: number) => void;
}
declare class Receiver {
    controller: Controller;
    routes: RoutesMap;
    constructor(controller: Controller);
    /**
     * @description 흐름제어
     */
    handleMessage(message: SocketMessage, connId: number): void;
}
export default Receiver;
//# sourceMappingURL=Receiver.d.ts.map