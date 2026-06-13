import { type Request, type Response, type NextFunction } from "express";
interface HttpError extends Error {
    status?: number;
    stack?: string;
}
declare class ErrorHandler {
    handle(err: HttpError, req: Request, res: Response, next: NextFunction): void;
}
export default ErrorHandler;
//# sourceMappingURL=ErrorHandler.d.ts.map