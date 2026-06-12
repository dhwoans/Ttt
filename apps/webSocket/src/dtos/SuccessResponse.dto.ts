export interface SuccessResponse<T = void> {
  success: true;
  message?: T;
}
