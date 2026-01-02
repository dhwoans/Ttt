import type { Request, Response, NextFunction } from "express";
import type Service from "../service/UserService.js";


class UserController {
  constructor(public service: Service) {}

  /* ========================================================= */
  /* User API 처리 */
  /* ========================================================= */
  createUser(req: Request, res: Response, next: NextFunction): void {
    console.log("[ApiController] User creation request");
    const { nickname, avator } = req.body;
    const result = this.service.createUser(nickname, avator);
  }
}
export default UserController;
