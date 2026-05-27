import { apiManager } from "../../../shared/services/ApiManager";

interface JoinRoomResult {
  success: boolean;
  data?: any;
  error?: string;
}

export async function useJoinRoom(): Promise<JoinRoomResult> {
  try {
    const response = await apiManager.joinRoom();
    if (!response) {
      return {
        success: false,
        error: "티켓 발급 응답이 없습니다.",
      };
    }

    const resultObj: JoinRoomResult = { success: true, data: response };
    return resultObj;
  } catch (error: any) {
    const errorObj: JoinRoomResult = {
      success: false,
      error: error?.message || "Unknown error",
    };
    return errorObj;
  }
}
