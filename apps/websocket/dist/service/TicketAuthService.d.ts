import type RedisManager from "../utils/redis.js";
type AuthenticatedTicket = {
    userId: string;
    nickname: string;
    avatar?: string;
};
type TicketValidationResult = {
    success: true;
    user: AuthenticatedTicket;
} | {
    success: false;
    message: string;
};
/**
 * Redis 기반 일회용 티켓 인증 서비스.
 *
 * ticket을 검증, 사용자 컨텍스트를 반환.
 * 검증이 끝난 티켓은 즉시 삭제.
 */
declare class TicketAuthService {
    private readonly redis;
    constructor(redis: RedisManager);
    /**
     * ticket 유효성 검증 + 파싱 + 소모(삭제)를 원자적 흐름으로 처리한다.
     */
    validateAndConsume(ticket: string): Promise<TicketValidationResult>;
}
export type { AuthenticatedTicket, TicketValidationResult };
export default TicketAuthService;
//# sourceMappingURL=TicketAuthService.d.ts.map