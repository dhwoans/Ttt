export interface TicketDto {
  ticket: string;
  wsUrl: string;
  expiresAt: number;
}

// 클라이언트가 기대하는 응답 형식
export interface TicketResponse {
  success: boolean;
  gameServerUrl?: string;
  ticket?: string;
  ttl?: number;
  message?: string;
}


