export interface FailureResponse {
  success: false;
  // 실패했을 때는 메시지가 반드시 있어야 함을 나타냄
  message: string;
}
