import type { Request, Response, NextFunction } from "express";
import type UserService from "../service/UserService.js";
declare class UserController {
    userService: UserService;
    constructor(userService: UserService);
    /**
     * 사용자 생성
     * @param req
     * @param res
     * @param next
     */
    createUser(req: Request, res: Response, next: NextFunction): void;
}
export default UserController;
//# sourceMappingURL=UserController.d.ts.map