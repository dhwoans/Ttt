# Socket.IO 책임 분리 리팩토링 문서

## 목표

`SocketIOManager`의 과도한 책임을 분리하여 다음을 달성한다.

- 인증/티켓 검증 로직 분리
- 방 입장/퇴장(프레즌스) 로직 분리
- 게임 진행(READY/MOVE/PLAYING/GAME_OVER) 로직 분리
- 에러 응답 및 운영 로깅 분리
- `SocketIOManager`는 조립(Composition Root) 역할만 수행

## 책임 매핑표

| 현재 책임                                                                          | 새 컴포넌트             | 설명                         |
| ---------------------------------------------------------------------------------- | ----------------------- | ---------------------------- |
| Socket.IO `Server` 생성, CORS 설정                                                 | `SocketServerFactory`   | Socket 서버 생성 책임 분리   |
| 엔진 이벤트(`connection_error`, `initial_headers`)                                 | `SocketMonitoringHook`  | 운영/관찰성 로깅 분리        |
| 주기적 connection count 출력                                                       | `SocketMetricsReporter` | 메트릭 리포팅 분리           |
| `ticket` 존재/유효성 확인, 파싱, 일회성 삭제                                       | `TicketAuthService`     | 인증/세션 발급 전담          |
| 분산된 `socket.emit("ERROR", ...)`                                                 | `SocketErrorResponder`  | 표준 에러 응답 전담          |
| 입장 동기화(`EXISTING_PLAYERS`, `PLAYER_JOINED`, `ROOM_ASSIGNED`)                  | `RoomPresenceGateway`   | 방 프레즌스 이벤트 전담      |
| 퇴장 처리(`LEAVE`, `disconnect`)                                                   | `RoomPresenceGateway`   | 공통 제거 로직 단일화        |
| 게임 이벤트 송신(`PLAYER_READY`, `MOVE_MADE`, `NEXT_TURN`, `GAME_OVER`, `PLAYING`) | `GameEventPublisher`    | 이벤트 전송 포맷/채널 단일화 |
| READY/MOVE 상태 전이 및 게임 시작                                                  | `GameFlowService`       | 도메인 규칙/상태 전이 전담   |
| 위 컴포넌트 연결                                                                   | `SocketIOManager`       | 조립자 역할만 수행           |

## 리팩토링 순서

1. `SocketErrorResponder`, `TicketAuthService` 추출
2. `RoomPresenceGateway` 추출 (`LEAVE`, `disconnect` 공통화)
3. `GameEventPublisher`, `GameFlowService` 추출
4. `SocketMonitoringHook`, `SocketMetricsReporter`, `SocketServerFactory` 추출
5. `SocketIOManager`는 연결 핸들러 조립만 남기고 경량화

## 산출물(파일)

- `src/routes/socketio/SocketServerFactory.ts`
- `src/routes/socketio/SocketMonitoringHook.ts`
- `src/routes/socketio/SocketMetricsReporter.ts`
- `src/routes/socketio/SocketErrorResponder.ts`
- `src/routes/socketio/TicketAuthService.ts`
- `src/routes/socketio/GameEventPublisher.ts`
- `src/routes/socketio/GameFlowService.ts`
- `src/routes/socketio/RoomPresenceGateway.ts`
- `src/routes/socketio/SocketIOManager.ts` (리팩토링)

## 주의사항

- 기존 이벤트 이름/페이로드는 변경하지 않는다.
- 기존 `LobbyIOManager`, `RoomIOManager`, `Receiver` 흐름은 유지한다.
- 기능 동작은 동일하게 유지하고 책임만 분리한다.
