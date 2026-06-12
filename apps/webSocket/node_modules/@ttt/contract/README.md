# contract

OpenAPI 3.1 기반 계약 우선 설계(Contract-First) 명세 디렉토리.

`openapi-typescript` 를 사용해 YAML 명세에서 TypeScript 타입을 자동 생성합니다.

---

## 타입 생성

```bash
npm run generate
```

생성 결과:

| YAML | 출력 (client & backend) |
|---|---|
| `openapi.yaml` | `rest-api.types.ts` |
| `socket-client-events.yaml` | `socket-client-events.types.ts` |
| `socket-server-events.yaml` | `socket-server-events.types.ts` |

---

## 파일 구조

```
contract/
├── openapi.yaml                  # REST API 진입점
├── socket-client-events.yaml     # Socket Client → Server 이벤트 진입점
├── socket-server-events.yaml     # Socket Server → Client 이벤트 진입점
├── paths/
│   └── ticket.yaml               # POST /api/ticket
└── schemas/
    ├── rest.yaml                  # REST 요청/응답 스키마
    ├── common.yaml                # 공통 스키마 (PlayerData)
    ├── socket-client.yaml         # Client → Server 이벤트 스키마
    └── socket-server.yaml         # Server → Client 이벤트 스키마
```

---

## 각 파일 역할

### `openapi.yaml` — REST API 진입점

`POST /api/ticket` 엔드포인트와 REST 스키마를 조합합니다.

### `socket-client-events.yaml` — Socket Client 이벤트 진입점

클라이언트가 `socket.emit()` 으로 서버에 보내는 이벤트 스키마를 조합합니다.

### `socket-server-events.yaml` — Socket Server 이벤트 진입점

서버가 클라이언트에 보내는 이벤트 스키마 및 공통 타입(`PlayerData`)을 조합합니다.

---

### `paths/ticket.yaml` — HTTP 엔드포인트

| 메서드 | 경로 | 설명 |
|---|---|---|
| `POST` | `/api/ticket` | 게임 서버 입장 티켓 발급 |

요청 body, 응답 코드(200 / 400 / 500), 예시(example)를 포함합니다.
엔드포인트가 추가될 때 `paths/` 아래에 파일을 추가하고
`openapi.yaml` 에 `$ref` 만 추가하면 됩니다.

---

### `schemas/rest.yaml` — REST 스키마

HTTP 요청/응답에서만 사용하는 스키마를 정의합니다.

| 스키마 | 설명 |
|---|---|
| `IssueTicketRequest` | `POST /api/ticket` 요청 body |
| `IssueTicketResponse` | 티켓 발급 성공 응답 |
| `ApiErrorResponse` | 공통 에러 응답 |

---

### `schemas/common.yaml` — 공통 스키마

REST API 와 Socket.IO 이벤트 양쪽에서 공유하는 스키마를 정의합니다.

| 스키마 | 설명 |
|---|---|
| `PlayerData` | 플레이어 기본 정보 (userId, nickname, isReady, avatar, skilled) |

---

### `schemas/socket-client.yaml` — Client → Server 이벤트

클라이언트가 `socket.emit()` 으로 서버에 보내는 페이로드를 정의합니다.

| 스키마 | 이벤트 | 설명 |
|---|---|---|
| `ReadyEventPayload` | `READY` | 준비 상태 변경 |
| `MoveEventPayload` | `MOVE` | 보드에 수 놓기 (0-8 인덱스) |

> `LEAVE` 이벤트는 페이로드 없음 (빈 객체).

---

### `schemas/socket-server.yaml` — Server → Client 이벤트

서버가 `socket.emit()` / `io.to(room).emit()` 으로 클라이언트에 보내는
이벤트 페이로드를 정의합니다.

| 스키마 | 이벤트 | 발송 대상 | 설명 |
|---|---|---|---|
| `ConnectedEvent` | `CONNECTED` | 본인 | 소켓 연결 성공 |
| `RoomAssignedEvent` | `ROOM_ASSIGNED` | 본인 | 방 배정 완료 |
| `ExistingPlayersEvent` | `EXISTING_PLAYERS` | 본인 | 입장 시 기존 플레이어 목록 |
| `PlayerJoinedEvent` | `PLAYER_JOINED` | 기존 플레이어 | 새 플레이어 입장 알림 |
| `PlayerReadyEvent` | `PLAYER_READY` | 방 전체 | 준비 상태 변경 알림 |
| `ReadyTimeoutStartedEvent` | `READY_TIMEOUT_STARTED` | 방 전체 | 준비 카운트다운 시작 |
| `ReadyTimeoutExpiredEvent` | `READY_TIMEOUT_EXPIRED` | 방 전체 | 미준비 플레이어 강제 퇴장 |
| `ReadyTimeoutCanceledEvent` | `READY_TIMEOUT_CANCELED` | 방 전체 | 준비 카운트다운 중단 |
| `PlayingEvent` | `PLAYING` | 방 전체 | 게임 시작, 첫 턴 정보 |
| `TurnTimeoutStartedEvent` | `TURN_TIMEOUT_STARTED` | 방 전체 | 착수 제한시간 카운트다운 시작 |
| `MoveMadeEvent` | `MOVE_MADE` | 방 전체 | 수 착수 알림 |
| `NextTurnEvent` | `NEXT_TURN` | 방 전체 | 다음 턴 플레이어 알림 |
| `GameOverEvent` | `GAME_OVER` | 방 전체 | 게임 종료 (승패/무승부, 최종 보드) |
| `PlayerLeftEvent` | `PLAYER_LEFT` | 다른 플레이어 | 플레이어 퇴장 알림 |
| `LeaveSuccessEvent` | `LEAVE_SUCCESS` | 본인 | 방 퇴장 성공 확인 |
| `SocketErrorEvent` | `ERROR` | 본인 | 에러 발생 알림 |

