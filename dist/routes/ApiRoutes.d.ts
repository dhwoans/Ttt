import { type Application, type Request, type Response, type NextFunction } from "express";
import type Controller from "../controller/Controller.js";
interface GlobalErrorHandler {
    handle(err: Error, req: Request, res: Response, next: NextFunction): void;
}
declare class ApiRoutes {
    app: Application;
    private port;
    private controller;
    private errorHandler;
    constructor(port: number, controller: Controller, errorHandler: GlobalErrorHandler);
    private route;
    /**
     * Express 애플리케이션 인스턴스를 반환합니다.
     */
    getApp(): Application;
}
export default ApiRoutes;
//# sourceMappingURL=ApiRoutes.d.ts.map