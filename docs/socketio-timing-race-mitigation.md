# Socket.IO 타이밍 레이스 방지 설계

## 배경

현재 READY 타임아웃(`READY_TIMEOUT_STARTED/CANCELED/EXPIRED`)은 이벤트 기반으로 전달된다.
이 방식은 대부분 정상 동작하지만, 네트워크 지연/재연결/입장 타이밍에 따라 다음 레이스가 발생할 수 있다.

- 방 입장 직후 이벤트를 놓치거나 순서가 뒤집힘
- 구버전 상태를 늦게 받아 UI가 되돌아감
- 서버는 최신 상태인데 클라이언트는 오래된 상태를 렌더링

> 핵심 문제: "이벤트 전달" 자체를 신뢰하면 일관성을 보장하기 어렵다.

---

## 근본 원인

### 1) 이벤트만으로 상태를 복원하려는 구조

클라이언트가 "처음 상태" 없이 이벤트 스트림만으로 상태를 맞추면,
중간 이벤트 유실 시 영구적으로 상태가 틀어질 수 있다.

### 2) 순서/중복/유실에 대한 프로토콜 부재

이벤트 payload에 버전(`revision`)이나 이벤트 ID가 없어
클라이언트가 "이 이벤트를 적용해도 되는지" 판단하지 못한다.

### 3) 입장과 브로드캐스트의 경계 타이밍

소켓이 room join 되는 순간과 room 브로드캐스트 시점이 엇갈리면
입장 직후 1~2개의 이벤트를 못 받을 수 있다.

---

## 목표

- 최종 상태 정합성(Eventual Consistency) 보장
- 순서 뒤집힘/중복/유실에 안전한 프로토콜
- 입장/재연결 시 즉시 일관된 상태 복원
- 기존 이벤트(`READY_TIMEOUT_*`)는 최대한 호환 유지

---

## 해결 전략 (권장)

## 1) 서버 권위 상태 + 스냅샷 우선

서버가 방 상태를 단일 소스로 보유하고, 입장 시 클라이언트에 현재 상태를 먼저 전달한다.

- 신규 이벤트: `ROOM_STATE_SNAPSHOT`
- 포함 정보(예시)
  - `roomId`
  - `revision` (서버 상태 버전)
  - `players` / `readyStates`
  - `readyTimeout` 상태 (`active`, `remainingMs`, `expiresAt`)
  - `gamePhase` (`LOBBY`/`PLAYING`/`GAME_OVER`)

클라이언트는 스냅샷 수신 전까지 READY 타이머 UI를 확정 렌더링하지 않는다.

## 2) 모든 변경 이벤트에 `revision` 포함

서버 상태 변경마다 revision을 1 증가시키고, 이벤트 payload에 포함한다.

- `READY_TIMEOUT_STARTED`, `READY_TIMEOUT_CANCELED`, `READY_TIMEOUT_EXPIRED`
- `PLAYER_READY`, `PLAYER_LEFT`, `PLAYING` 등 상태에 영향이 있는 이벤트

클라이언트 적용 규칙:

- 이벤트 `revision < localRevision`: 버림(지연 도착)
- 이벤트 `revision = localRevision + 1`: 정상 적용
- 이벤트 `revision > localRevision + 1`: 즉시 `ROOM_STATE_SNAPSHOT` 재요청

## 3) Join-Ack 핸드셰이크

입장 절차를 아래 순서로 고정한다.

1. 서버: room join 처리
2. 서버: `ROOM_STATE_SNAPSHOT` 개별 전송
3. 서버: `ROOM_STATE_READY`(선택) 또는 ack 대기
4. 서버: 이후 증분 이벤트 브로드캐스트

이렇게 하면 "연결되기 전에 시작 이벤트 발행" 레이스를 구조적으로 차단할 수 있다.

## 4) Self-heal(자가 복구) 경로

네트워크 이상 대비로 상태 복구 경로를 항상 제공한다.

- 클라이언트 요청: `REQUEST_ROOM_STATE`
- 서버 응답: `ROOM_STATE_SNAPSHOT`
- 트리거: revision gap 감지, 탭 복귀, 재연결 직후

---

## 적용 설계안 (현재 코드 기준)

### A. 타입 확장

`src/share/socket-server-events.types.ts`

추가 권장:

- `RoomStateSnapshotEvent`
- 각 상태변경 이벤트에 `revision: number`

### B. 서버 상태 저장소

`GameFlowService` 혹은 별도 `RoomStateStore`에 아래 보유:

- `roomRevision: Map<roomId, number>`
- `readyTimeoutExpiresAt`
- `readyTimeoutActive`

상태 변경 시 공통 함수로 revision 증가 후 emit.

### C. Publisher 단일화

`GameEventPublisher`에서만 상태변경 이벤트 전송.

- 브로드캐스트용 메서드
- 소켓 단건 동기화(`emitRoomStateSnapshotToSocket`) 메서드
- 동일 포맷 강제

---

## 단계별 마이그레이션 계획

### Phase 1 (저위험)

- `ROOM_STATE_SNAPSHOT` 이벤트 추가
- 입장 직후 스냅샷 1회 전송
- 현재 `READY_TIMEOUT_*` 유지

### Phase 2 (정합성 강화)

- `revision` 도입
- 클라이언트 적용 규칙(버림/재요청) 구현

### Phase 3 (복구 자동화)

- `REQUEST_ROOM_STATE` 추가
- reconnect/visibilitychange에서 자동 복구

---

## 트레이드오프

장점:

- 타이밍 레이스에 구조적으로 강함
- 디버깅이 쉬움(revision으로 원인 추적 가능)
- 재연결 UX 개선

비용:

- 이벤트 스키마와 프론트 핸들러 수정 필요
- 상태 저장/버전 관리 로직 증가

---

## 결론

타이밍 레이스의 근본 해결책은
**"이벤트 전달 성공"을 전제로 하지 않고,
"스냅샷 + 버전(revision) + 복구 경로"를 프로토콜에 내장하는 것**이다.

현재 코드의 `READY_TIMEOUT_*` 개선은 좋은 1차 대응이며,
위 설계를 적용하면 입장/재연결/지연 환경에서도 상태 일관성을 안정적으로 보장할 수 있다.
