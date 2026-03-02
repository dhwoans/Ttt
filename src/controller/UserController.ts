import type { Request, Response, NextFunction } from "express";
import type Service from "../service/UserService.js";

class UserController {
  constructor(public service: Service) {}

  /* ========================================================= */
  /* User API 처리 */
  /* ========================================================= */

  /**
   * 사용자 생성
   * @param req
   * @param res
   * @param next
   */
  createUser(req: Request, res: Response, next: NextFunction): void {
    try {
      console.log("[UserController] User creation request");
      const { nickname, avatar } = req.body;

      const result = this.service.createUser(nickname, avatar);

      if (!result.success || !result.message) {
        next(new Error("Failed to create user"));
        return;
      }

      res.status(201).json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      console.error("[UserController] Error:", error);
      next(error);
    }
  }
}
export default UserController;
