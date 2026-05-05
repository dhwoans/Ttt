import { animalList } from "../constants/avatarCandidates";
import { useTicTacToeGameStore } from "@/stores/ticTacToeGameStore";
import type { IssueTicketRequest, IssueTicketResponse } from "@share";

interface CreateUserResponse {
  success: boolean;
  message: string;
}
/* ========================================================= */
/* API 통신 관리 */
/* ========================================================= */
class ApiManager {
  private basePath: string;

  constructor(basePath: string = "") {
    this.basePath = basePath;
  }

  async request<T>(path: string, options: RequestInit = {}): Promise<T | null> {
    try {
      const res = await fetch(this.basePath + path, options);
      const data = await res.json();
      return data;
    } catch (err) {
      console.error(`[network] request error ${path}:`, err);
      return null;
    }
  }
  // GET /api/room - 멀티플레이 서버 입장 정보 요청
  // 접속가능한 게임서버주소,입장티켓 리턴
  async joinRoom(): Promise<IssueTicketResponse | null> {
    const myPlayer = useTicTacToeGameStore.getState().myPlayer;
    const userId = myPlayer?.userId ?? null;
    const nickname = myPlayer?.nickname ?? "";
    const avatarIndex = myPlayer?.avatarIndex ?? 0;
    const avatar = animalList[avatarIndex]?.[0];

    if (!userId) {
      console.error("[API] userId not found in store");
      return null;
    }

    const body: IssueTicketRequest = { userId, nickname, avatar };

    return await this.request<IssueTicketResponse>("/api/ticket", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
  }
  // POST /api/user - 사용자 생성
  async createUser(userData: {
    nickname: string;
    avatar?: string;
  }): Promise<CreateUserResponse | null> {
    return await this.request("/api/user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });
  }
}

export const apiManager = new ApiManager();
