# 멀티플레이 방 매칭 및 플레이어 정보 공유 시스템

## 📋 개요

이 문서는 멀티플레이 게임에서 사용자가 입장할 때 자동으로 방을 배정하고, 같은 방에 있는 플레이어들끼리 서로의 정보를 공유하는 시스템을 설명합니다.

## 🔄 전체 흐름도

```
1. 클라이언트: POST /api/ticket 요청
   ↓
2. 서버: 게임 티켓 발급 및 WebSocket URL 반환
   ↓
3. 클라이언트: WebSocket 연결 (ws://localhost:8080)
   - auth: { userId, nickname, ticket }
   ↓
4. 서버: 티켓 검증 (TODO)
   ↓
5. 서버: 빈 방 찾기 또는 새 방 생성
   ↓
6. 서버: 방에 입장하기 전 기존 플레이어 정보 수집
   ↓
7. 서버: 새 플레이어를 방에 추가
   ↓
8. 서버: Socket.IO room에 조인
   ↓
9. 서버: 기존 플레이어들에게 새 플레이어 입장 알림
   - 이벤트: PLAYER_JOINED
   ↓
10. 서버: 새 플레이어에게 기존 플레이어 정보 전송
    - 이벤트: EXISTING_PLAYERS
   ↓
11. 서버: 방 배정 완료 알림
    - 이벤트: ROOM_ASSIGNED
   ↓
12. 게임 시작! 🎮
```

## 🎯 핵심 로직 상세 설명

### 1단계: 방 찾기 또는 생성

```typescript
// Manager.findOrCreateRoom()
findOrCreateRoom(): SuccessResponse<RoomId> | FailureResponse {
  // 1. 모든 방을 순회하며 빈 자리가 있는 방 찾기
  for (const [roomId, room] of this.rooms.entries()) {
    if (!room.isFull()) {
      console.log(`[Manager] Found available room: ${roomId}`);
      return { success: true, message: roomId };
    }
  }

  // 2. 빈 방이 없으면 새로운 방 생성
  const newRoomId = randomUUID();
  const result = this.createRoom(newRoomId);

  if (result.success) {
    console.log(`[Manager] Created new room: ${newRoomId}`);
    return { success: true, message: newRoomId };
  }

  return { success: false, message: "Failed to find or create room" };
}
```

**동작 방식:**

- `room.isFull()`: 방의 현재 인원이 최대 인원(MAX_PLAYERS)에 도달했는지 확인
- 빈 자리가 있는 방을 찾으면 즉시 해당 `roomId` 반환
- 모든 방이 꽉 차있으면 `randomUUID()`로 새 방 생성

---

### 2단계: 기존 플레이어 정보 수집

```typescript
// SocketIOManager.setupEventListeners()

// 방에 조인하기 전 기존 플레이어 정보 가져오기
const roomData = this.service.getRoomData(roomId);
const existingPlayers =
  roomData.success && roomData.message
    ? roomData.message.getAllPlayersData()
    : [];

console.log(
  `[SocketIOManager] Existing players in room: ${existingPlayers.length}`,
);
```

**중요한 이유:**

- **새 플레이어가 방에 추가되기 전**에 기존 플레이어 목록을 가져와야 함
- 나중에 가져오면 자기 자신도 포함되어 버림
- `getAllPlayersData()`는 `PlayerInfo[]` 형태로 반환:
  ```typescript
  [
    { connId: "user_123", nickname: "Player1", isReady: false },
    { connId: "user_456", nickname: "Player2", isReady: true },
  ];
  ```

---

### 3단계: 새 플레이어를 방에 추가

```typescript
// 새 플레이어를 방에 추가
const nickname = socket.handshake.auth?.nickname || "Anonymous";
const joinResult = this.service.joinPlayer(roomId, userId, nickname);

if (!joinResult.success) {
  console.error(`[SocketIOManager] ❌ Failed to join player to room`);
  socket.emit("ERROR", { message: "Failed to join room" });
  socket.disconnect();
  return;
}

// Socket.IO room에 조인
socket.join(roomId);
console.log(`[SocketIOManager] Socket ${socket.id} joined room ${roomId}`);
```

**동작 방식:**

1. `joinPlayer()`: 서버의 `Room` 객체에 플레이어 데이터 추가
   - `players.set(userId, { nickname, isReady: false })`
2. `socket.join(roomId)`: Socket.IO의 room 기능을 사용하여 실제 소켓을 그룹에 추가
   - 이후 `socket.to(roomId).emit()`으로 같은 방의 다른 플레이어들에게 메시지 전송 가능

---

### 4단계: 플레이어 정보 공유

#### A. 기존 플레이어들에게 새 플레이어 입장 알림

```typescript
// 새 플레이어 정보
const newPlayerInfo = {
  userId,
  nickname,
  isReady: false,
};

// 1. 기존 플레이어들에게 새 플레이어 입장 알림
if (existingPlayers.length > 0) {
  socket.to(roomId).emit("PLAYER_JOINED", {
    player: newPlayerInfo,
    roomId,
  });
  console.log(
    `[SocketIOManager] 📢 Notified ${existingPlayers.length} existing player(s)`,
  );
}
```

**`socket.to(roomId).emit()` 설명:**

- `socket.to(roomId)`: 해당 방에 있는 **나를 제외한** 모든 소켓
- 새로 입장한 본인은 제외하고 기존 플레이어들에게만 전송
- 기존 플레이어들은 `PLAYER_JOINED` 이벤트를 받아서 UI에 새 플레이어 추가

**클라이언트에서 받는 데이터:**

```json
{
  "player": {
    "userId": "user_abc123",
    "nickname": "홍길동",
    "isReady": false
  },
  "roomId": "uuid-1234-5678"
}
```

#### B. 새 플레이어에게 기존 플레이어 정보 전송

```typescript
// 2. 새 플레이어에게 기존 플레이어 정보 전송
socket.emit("EXISTING_PLAYERS", {
  players: existingPlayers,
  roomId,
});
console.log(
  `[SocketIOManager] 📤 Sent ${existingPlayers.length} existing player(s) info`,
);
```

**`socket.emit()` 설명:**

- 특정 소켓(새로 입장한 플레이어)에게만 전송
- 기존에 있던 모든 플레이어의 정보를 배열로 전달
- 새 플레이어는 `EXISTING_PLAYERS` 이벤트를 받아서 UI에 기존 플레이어들 표시

**클라이언트에서 받는 데이터:**

```json
{
  "players": [
    {
      "connId": "user_123",
      "nickname": "Player1",
      "isReady": false
    },
    {
      "connId": "user_456",
      "nickname": "Player2",
      "isReady": true
    }
  ],
  "roomId": "uuid-1234-5678"
}
```

---

### 5단계: 방 배정 완료 알림

```typescript
// 3. 방 배정 완료 알림
socket.emit("ROOM_ASSIGNED", { roomId });
console.log(`[SocketIOManager] ✅ Room assignment complete`);
```

**목적:**

- 클라이언트가 방 입장 프로세스가 완료되었음을 인지
- 게임 화면으로 이동: `navigate(/game/${roomId})`

---

### 6단계: 플레이어 퇴장 처리

```typescript
socket.on("disconnect", (reason) => {
  console.log(
    `[SocketIOManager] 🔌 Disconnect: ${socket.id}, reason: ${reason}`,
  );

  const roomId = socket.data.roomId;
  const userId = socket.data.userId;
  const nickname = socket.data.nickname;

  if (roomId && userId) {
    console.log(
      `[SocketIOManager] Removing player ${userId} from room ${roomId}`,
    );

    // 방에서 플레이어 제거
    const removeResult = this.service.removePlayer(roomId, userId);

    if (removeResult.success) {
      console.log(
        `[SocketIOManager] ✅ Player removed: ${removeResult.message}`,
      );

      // 같은 방의 다른 플레이어들에게 나간 플레이어 정보 전송
      socket.to(roomId).emit("PLAYER_LEFT", {
        userId,
        nickname,
        roomId,
      });
      console.log(
        `[SocketIOManager] 📢 Notified other players about ${nickname} leaving`,
      );
    }
  }
});
```

**동작 방식:**

1. `socket.data`에 저장된 roomId, userId, nickname 사용
2. `removePlayer()`: 서버의 Room 객체에서 플레이어 제거
3. 방이 비면 자동으로 삭제됨 (Manager 로직)
4. `socket.to(roomId).emit()`: 나간 플레이어를 제외한 같은 방의 모든 플레이어에게 전송

**클라이언트에서 받는 데이터:**

```json
{
  "userId": "user_abc123",
  "nickname": "홍길동",
  "roomId": "uuid-1234-5678"
}
```

---

## 🎬 시나리오 예시

### 시나리오 1: 첫 번째 플레이어 입장

1. **Player A** 입장 시도
2. 빈 방이 없음 → 새 방 생성: `room-001`
3. `existingPlayers = []` (빈 배열)
4. Player A를 `room-001`에 추가
5. Player A 소켓을 `room-001`에 join
6. **PLAYER_JOINED 전송 안 함** (기존 플레이어가 없으므로)
7. Player A에게 `EXISTING_PLAYERS` 전송: `{ players: [] }`
8. Player A에게 `ROOM_ASSIGNED` 전송: `{ roomId: "room-001" }`

**Player A가 받는 이벤트:**

- `CONNECTED`
- `EXISTING_PLAYERS`: `{ players: [] }`
- `ROOM_ASSIGNED`: `{ roomId: "room-001" }`

---

### 시나리오 2: 두 번째 플레이어 입장

1. **Player B** 입장 시도
2. `room-001`에 빈 자리 있음 (1/2) → `room-001` 반환
3. `existingPlayers = [{ connId: "userA", nickname: "PlayerA", isReady: false }]`
4. Player B를 `room-001`에 추가
5. Player B 소켓을 `room-001`에 join
6. **Player A에게 PLAYER_JOINED 전송**:
   ```json
   {
     "player": {
       "userId": "userB",
       "nickname": "PlayerB",
       "isReady": false
     },
     "roomId": "room-001"
   }
   ```
7. **Player B에게 EXISTING_PLAYERS 전송**:
   ```json
   {
     "players": [
       {
         "connId": "userA",
         "nickname": "PlayerA",
         "isReady": false
       }
     ],
     "roomId": "room-001"
   }
   ```
8. Player B에게 `ROOM_ASSIGNED` 전송

**Player A가 받는 이벤트:**

- `PLAYER_JOINED`: PlayerB 정보

**Player B가 받는 이벤트:**

- `CONNECTED`
- `EXISTING_PLAYERS`: PlayerA 정보
- `ROOM_ASSIGNED`: `{ roomId: "room-001" }`

**결과:** 두 플레이어 모두 서로의 정보를 알고 있음! ✅

---

### 시나리오 3: 세 번째 플레이어 입장 (방이 꽉 찬 경우)

1. **Player C** 입장 시도
2. `room-001`이 꽉 참 (2/2) → 새 방 생성: `room-002`
3. `existingPlayers = []`
4. Player C를 `room-002`에 추가
5. 시나리오 1과 동일하게 진행

---

### 시나리오 4: 플레이어 퇴장

**상황:** `room-001`에 Player A와 Player B가 있고, Player B가 나감

1. Player B의 브라우저를 닫거나 연결 종료
2. 서버에서 `disconnect` 이벤트 발생
3. `socket.data`에서 roomId, userId, nickname 조회
4. `room-001`에서 Player B 제거
5. **Player A에게 PLAYER_LEFT 전송**:
   ```json
   {
     "userId": "userB",
     "nickname": "PlayerB",
     "roomId": "room-001"
   }
   ```
6. `room-001`에 Player A만 남음 (1/2)

**Player A가 받는 이벤트:**

- `PLAYER_LEFT`: PlayerB 정보

**Player A의 UI 동작:**

- PlayerB를 플레이어 목록에서 제거
- "PlayerB님이 나가셨습니다" 메시지 표시

**방 상태 변화:**

- 방에 1명만 남아있으므로 다시 입장 가능 상태가 됨
- 새로운 플레이어가 `room-001`에 입장 가능

---

## 🧩 관련 파일 및 메서드

### 파일 구조

```
src/
├── routes/
│   └── socketio/
│       └── SocketIOManager.ts    # WebSocket 연결 및 이벤트 처리
├── service/
│   ├── Manager.ts                # 방 관리 로직
│   └── Service.ts                # 비즈니스 로직 레이어
└── models/
    └── Room.ts                   # 방 데이터 모델
```

### 주요 메서드

#### `SocketIOManager.setupEventListeners()`

- WebSocket 연결 처리
- 플레이어 정보 공유 로직 실행

#### `Manager.findOrCreateRoom()`

- 빈 방 찾기 또는 생성
- 반환: `SuccessResponse<RoomId>` 또는 `FailureResponse`

#### `Manager.joinPlayer(roomId, userId, nickname)`

- 플레이어를 방에 추가
- `Room.addPlayer()` 호출

#### `Room.getAllPlayersData()`

- 방의 모든 플레이어 정보를 배열로 반환
- 반환 타입: `PlayerInfo[]`

#### `Room.addPlayer(connId, nickname)`

- 플레이어 정보를 `players` Map에 추가
- 반환: `User` 객체

---

## 🔧 클라이언트 구현 가이드

### 이벤트 리스너 등록

```typescript
// 연결 성공
socket.on("CONNECTED", (data) => {
  console.log("✅ Socket connected:", data.socketId);
});

// 기존 플레이어 정보 수신
socket.on("EXISTING_PLAYERS", (data) => {
  console.log(`📥 Received ${data.players.length} existing players`);

  // UI에 기존 플레이어 추가
  data.players.forEach((player) => {
    addPlayerToUI(player);
  });
});

// 새 플레이어 입장 알림 수신
socket.on("PLAYER_JOINED", (data) => {
  console.log("🆕 New player joined:", data.player.nickname);

  // UI에 새 플레이어 추가
  addPlayerToUI(data.player);
});

// 플레이어 퇴장 알림 수신
socket.on("PLAYER_LEFT", (data) => {
  console.log("👋 Player left:", data.nickname);

  // UI에서 플레이어 제거
  removePlayerFromUI(data.userId);
});

// 방 배정 완료
socket.on("ROOM_ASSIGNED", (data) => {
  console.log("✅ Room assigned:", data.roomId);
  sessionStorage.setItem("roomId", data.roomId);

  // 게임 화면으로 이동
  navigate(`/game/${data.roomId}`, { state: { mode: "multi" } });
});
```

### 연결 시 필수 데이터

```typescript
const socket = io("ws://localhost:8080", {
  path: "/socket.io", // 또는 생략 (기본값)
  auth: {
    userId: "user_abc123", // 필수
    nickname: "홍길동", // 필수
    ticket: "ticket_xyz789", // 선택 (추후 검증 구현)
  },
});
```

---

## 🎯 핵심 포인트 요약

1. **타이밍이 중요**: 새 플레이어를 방에 추가하기 **전에** 기존 플레이어 정보를 수집해야 함

2. **양방향 정보 공유**:
   - 기존 플레이어 → 새 플레이어 정보 받음 (`PLAYER_JOINED`)
   - 새 플레이어 → 기존 플레이어 정보 받음 (`EXISTING_PLAYERS`)

3. **Socket.IO room 활용**:
   - `socket.join(roomId)`: 소켓을 그룹에 추가
   - `socket.to(roomId).emit()`: 그룹 내 다른 소켓들에게 전송
   - `socket.emit()`: 특정 소켓에게만 전송

4. **빈 방 우선 배정**: 새 방을 무분별하게 생성하지 않고 기존 빈 방을 먼저 찾음

5. **에러 처리**: 방 입장 실패 시 `ERROR` 이벤트 전송 후 연결 종료

---

## 🐛 디버깅 로그

서버에서 정상 동작 시 다음과 같은 로그가 출력됩니다:

```
[SocketIOManager] Finding or creating room...
[Manager] Found available room: room-001
[SocketIOManager] ✅ Room assigned: room-001 to user: user_abc123
[SocketIOManager] Existing players in room: 1
[SocketIOManager] Socket xyz123 joined room room-001
[SocketIOManager] 📢 Notified 1 existing player(s) about new player
[SocketIOManager] 📤 Sent 1 existing player(s) info to new player
[SocketIOManager] ✅ Room assignment complete
```

---

## 📝 TODO

- [ ] Redis를 사용한 티켓 검증 구현
- [x] 플레이어 disconnect 시 `PLAYER_LEFT` 이벤트 전송
- [ ] 방이 비었을 때 자동 삭제 로직 개선
- [ ] 최대 방 개수 제한 설정

---

**작성일**: 2026-03-02  
**버전**: 1.1.0  
**작성자**: Backend Team
