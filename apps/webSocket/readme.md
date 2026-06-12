## 프로젝트 목적

이 프로젝트는 다음을 학습하기 위해 만들어졌습니다:

- **실시간 통신**: Socket.IO를 사용한 양방향 실시간 이벤트 처리
- **상태 패턴**: 게임 상태(대기/진행/종료) 전이를 상태 패턴으로 설계
- **방/세션 관리**: 여러 방에서 독립적으로 진행 중인 게임 세션 관리
- **TypeScript 활용**: 타입 안전성을 갖춘 백엔드 구조 구성

## 기술 스택

| 항목              | 기술          |
| ----------------- | ------------- |
| **런타임**        | Node.js (18+) |
| **언어**          | TypeScript    |
| **웹 프레임워크** | Express.js    |
| **실시간 통신**   | Socket.IO     |
| **데이터 저장소** | Redis         |
| **패키지 매니저** | npm / yarn    |
| **컨테이너화**    | Docker        |

## 파일 구조

```text
.
└─ src                     # 서버 애플리케이션 소스 루트
   ├─ controller           # 요청을 받아 서비스 계층으로 전달
   ├─ dtos                 # API/소켓 데이터 전송 객체 정의
   │  ├─ game              # 게임 관련 DTO 세부 구분
   │  └─ user              # 유저 관련 DTO 세부 구분
   ├─ game                 # 틱택토 핵심 도메인 로직
   ├─ gameState            # 게임 상태 전이(State 패턴)
   ├─ models               # Room/User 등 도메인 모델
   ├─ routes               # HTTP/Socket 엔트리 및 라우팅
   │  ├─ socketio          # Socket.IO 기반 실시간 통신 구성
   │  └─ ws                # WebSocket 세션/연결 관리(구버전)
   ├─ service              # 비즈니스 로직 계층
   │  └─ legacy            # 이전 구현
   ├─ share                # 클라이언트/서버 공용 타입 계약
   ├─ type                 # 전역/확장 타입 선언(d.ts)
   └─ utils                # 공통 유틸리티
```

### 배포 (Docker)

```bash
# Docker 이미지 빌드
docker build -t project-ttt-backend .

# 컨테이너 실행
docker run -p 3000:3000 --env-file .env project-ttt-backend
```

## 실시간 이벤트 요약

### 클라이언트 → 서버 이벤트

| 이벤트         | 설명             | 페이로드                               |
| -------------- | ---------------- | -------------------------------------- |
| `join_room`    | 게임 방 참여     | `{ roomId: string }`                   |
| `make_move`    | 게임 수 실행     | `{ roomId: string, position: number }` |
| `leave_room`   | 게임 방 나가기   | `{ roomId: string }`                   |
| `chat_message` | 채팅 메시지 전송 | `{ roomId: string, text: string }`     |

### 서버 → 클라이언트 이벤트

| 이벤트               | 설명             | 페이로드                                     |
| -------------------- | ---------------- | -------------------------------------------- |
| `game_state_updated` | 게임 상태 변화   | `{ roomId: string, state: GameState }`       |
| `room_users_changed` | 방의 사용자 변화 | `{ roomId: string, users: User[] }`          |
| `game_over`          | 게임 종료        | `{ roomId: string, winner: string \| null }` |
| `error`              | 오류 발생        | `{ code: string, message: string }`          |

## 주요 패치 이력

### v3 (tag: v3)

- Socket 이벤트 정리 및 개선

### v2 - 멀티플레이 티켓 시스템 구현

- **feat**: 멀티플레이 티켓 검증, 플레이어 정보 공유, 게임 시작 로직 구현
- **feat**: 멀티플레이 티켓 시스템 및 자동 방 배정 구현
- **feat**: Redis 연결 완료
- **feat**: User 관련 class 추가

### v1 - 기본 구조 및 TypeScript 전환

- **feat**: TypeScript 변경 완료
- **feat**: Dockerfile 추가
- **feat**: MOVE 발신 기능 완료
- **feat**: 게임오버 초기화 기능 추가
- **fix**: 게임오버 메시지 수정
- **fix**: 무승부 메시지 수정

### 최신 패치 (현재 진행 중)

- **refactor**: Socket/Game 서비스 리팩토링 및 @share export 수정
- **refactor**: SocketIOManager 책임 분리
- **refactor**: 전체 코드 품질 개선
- **style**: Magic string 제거
