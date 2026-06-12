import { animalList } from "../constants/avatarCandidates";
import { useUserStore } from "@/stores/useUserStore";
import type { IssueTicketRequest, IssueTicketResponse } from "@contract";

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
      const text = await res.text();

      if (!text) {
        if (!res.ok) {
          console.error(
            `[network] request failed ${path}: ${res.status} ${res.statusText}`,
          );
        }
        return null;
      }

      let data: unknown;
      try {
        data = JSON.parse(text);
      } catch {
        console.error(`[network] non-json response ${path}:`, text);
        return null;
      }

      if (!res.ok) {
        console.error(
          `[network] request failed ${path}: ${res.status} ${res.statusText}`,
          data,
        );
        return null;
      }

      return data as T;
    } catch (err) {
      console.error(`[network] request error ${path}:`, err);
      return null;
    }
  }
  // GET /api/room - 멀티플레이 서버 입장 정보 요청
  // 접속가능한 게임서버주소,입장티켓 리턴
  async joinRoom(): Promise<IssueTicketResponse | null> {
    const currentUser = useUserStore.getState().currentUser;
    const userId = currentUser?.userId ?? null;
    const nickname = currentUser?.nickname ?? "";
    const avatarIndex = currentUser?.avatarIndex ?? 0;
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
