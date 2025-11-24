/* ========================================================= */
/* 에러 관리 */
/* ========================================================= */
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
  handleWS(err, ws, originalMsg = {}) {
    if (ws.readyState === ws.OPEN) {
      ws.send(
        JSON.stringify({
          type: "ERROR",
          payload: {
            message: err.message,
            requestType: originalMsg.type || "UNKNOWN",
          },
        })
      );
    }
  }
}

export default ErrorHandler;
