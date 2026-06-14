import type RedisManager from "../utils/redis.js";

type AuthenticatedTicket = {
  userId: string;
  nickname: string;
  avatar?: string;
};

type TicketValidationResult =
  | {
      success: true;
      user: AuthenticatedTicket;
    }
  | {
      success: false;
      message: string;
    };

/**
 * Redis 기반 일회용 티켓 인증 서비스.
 *
 * ticket을 검증, 사용자 컨텍스트를 반환.
 * 검증이 끝난 티켓은 즉시 삭제.
 */
class TicketAuthService {
  constructor(private readonly redis: RedisManager) {}

  /**
   * ticket 유효성 검증 + 파싱 + 소모(삭제)를 원자적 흐름으로 처리한다.
   */
  async validateAndConsume(ticket: string): Promise<TicketValidationResult> {
    console.log(`[TicketAuthService] Validating ticket: ${ticket}`);
    const ticketData = await this.redis.get(ticket);

    if (!ticketData) {
      return { success: false, message: "Invalid or expired ticket" };
    }

    try {
      const parsedData = JSON.parse(ticketData) as {
        userId?: string;
        nickname?: string;
        avatar?: string;
      };

      if (!parsedData.userId || !parsedData.nickname) {
        return { success: false, message: "Invalid ticket format" };
      }

      await this.redis.del(ticket);
      console.log(`[TicketAuthService] Ticket consumed: ${ticket}`);

      return {
        success: true,
        user: {
          userId: parsedData.userId,
          nickname: parsedData.nickname,
          ...(parsedData.avatar ? { avatar: parsedData.avatar } : {}),
        },
      };
    } catch (error) {
      console.error("[TicketAuthService] Failed to parse ticket data:", error);
      return { success: false, message: "Invalid ticket format" };
    }
  }
}

export type { AuthenticatedTicket, TicketValidationResult };
export default TicketAuthService;

