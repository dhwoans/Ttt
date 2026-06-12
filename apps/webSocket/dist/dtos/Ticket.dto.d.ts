export interface TicketDto {
    ticket: string;
    wsUrl: string;
    expiresAt: number;
}
export interface TicketResponse {
    success: boolean;
    gameServerUrl?: string;
    ticket?: string;
    ttl?: number;
    message?: string;
}
//# sourceMappingURL=Ticket.dto.d.ts.map