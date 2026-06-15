import { type Request, type Response, type NextFunction } from "express";
/* ========================================================= */
/* 에러 관리 */
/* ========================================================= */

interface HttpError extends Error {
  status?: number;
  stack?: string;
}

class ErrorHandler {
  handle(err: HttpError, req: Request, res: Response, next: NextFunction) {
    console.error("에러 발생:", err.message);
    console.error(`Error Stack: \n ${err.stack}`);
    const status = err.status || 500;
    const message = err.message || "서버 내부 오류";

    res.status(status).json({
      success: false,
      message: message,
    });
  }
}

export default ErrorHandler;


