import { type Application, type Request, type Response, type NextFunction } from "express";
import type ApiController from "../controller/ApiController.js";
import type UserController from "../controller/UserController.js";
interface GlobalErrorHandler {
    handle(err: Error, req: Request, res: Response, next: NextFunction): void;
}
declare class ApiRoutes {
    app: Application;
    private port;
    private apiController;
    private userController;
    private errorHandler;
    constructor(port: number, apiController: ApiController, userController: UserController, errorHandler: GlobalErrorHandler);
    private route;
    /**
     * Express 애플리케이션 인스턴스를 반환
     */
    getApp(): Application;
}
export default ApiRoutes;
//# sourceMappingURL=ApiRoutes.d.ts.map