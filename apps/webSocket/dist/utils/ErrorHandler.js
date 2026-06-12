import {} from "express";
class ErrorHandler {
    handle(err, req, res, next) {
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
//# sourceMappingURL=ErrorHandler.js.map