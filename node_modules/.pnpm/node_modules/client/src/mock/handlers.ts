import { http, HttpResponse, delay } from "msw";

export const GAME_SERVERS = [
  { url: "ws://127.0.0.1:9001", users: 2 },
  { url: "ws://127.0.0.1:9002", users: 0 },
  { url: "ws://127.0.0.1:9003", users: 1 },
];

const delayTime = 2000;

export const handlers = [
  // POST /api/user - 사용자 생성
  http.post("/api/user", async ({ request }) => {
    const body = (await request.json()) as any;
    const { nickname, avatar } = body;

    if (!nickname || !avatar) {
      await delay(delayTime);
      return HttpResponse.json(
        { success: false, message: "닉네임과 프로필이 필요합니다." },
        { status: 400 },
      );
    }

    await delay(delayTime);
    return HttpResponse.json(
      {
        success: true,
        message: 123,
      },
      { status: 201 },
    );
  }),
  // POST /api/ticket - 멀티플레이 서버 입장 정보 요청
  http.post("/api/ticket", async () => {
    // 가장 접속자가 적은 서버 선택
    const bestServer = GAME_SERVERS.reduce((prev, curr) =>
      prev.users <= curr.users ? prev : curr,
    );
    // 임의의 티켓 생성
    const ticket = Math.random().toString(36).slice(2, 10);
    await delay(delayTime);
    return HttpResponse.json({
      success: true,
      gameServerUrl: bestServer.url,
      ticket,
    });
  }),

  // POST /api/room - 방 생성
  http.post("/api/room", async ({ request }) => {
    const body = (await request.json()) as any;
    const { userId } = body;

    if (!userId) {
      await delay(delayTime);
      return HttpResponse.json(
        { success: false, message: "사용자 ID가 필요합니다." },
        { status: 400 },
      );
    }

    const roomId = `room-${Date.now()}`;
    await delay(delayTime);
    return HttpResponse.json(
      {
        success: true,
        message: roomId,
      },
      { status: 201 },
    );
  }),

  // GET /api/room - 방 확인
  http.get("/api/room", ({ request }) => {
    const url = new URL(request.url);
    const roomId = url.searchParams.get("roomId");

    if (!roomId) {
      return (async () => {
        await delay(delayTime);
        return HttpResponse.json(
          { success: false, message: "roomId가 필요합니다." },
          { status: 400 },
        );
      })();
    }

    return (async () => {
      await delay(delayTime);
      return HttpResponse.json(
        {
          success: true,
          data: {
            roomId,
            ownerId: "owner-123",
            players: ["player-1", "player-2"],
            status: "waiting",
          },
        },
        { status: 200 },
      );
    })();
  }),

  // GET /api/roomList - 방 목록
  http.get("/api/roomList", () => {
    return (async () => {
      await delay(delayTime);
      return HttpResponse.json(
        {
          success: true,
          data: [
            {
              roomId: "room-1",
              ownerId: "user-1",
              nickname: "room owner 1",
              playerCount: 1,
              maxPlayers: 2,
              status: "waiting",
            },
            {
              roomId: "room-2",
              ownerId: "user-2",
              nickname: "room owner 2",
              playerCount: 2,
              maxPlayers: 2,
              status: "playing",
            },
          ],
        },
        { status: 200 },
      );
    })();
  }),
];
