import { describe, test, expect, beforeEach, vi } from "vitest";
import { randomUUID } from "node:crypto";
import Service from "../src/service/Service.js";

vi.mock("node:crypto", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    randomUUID: vi.fn(() => "mock-room-id-123"),
  };
});

describe("Service Class Test", () => {
  let managerMock;
  let service;

  beforeEach(() => {
    vi.clearAllMocks();

    managerMock = {
      createRoom: vi.fn(),
      getRoomData: vi.fn(),
      joinPlayer: vi.fn(),
      readyPlayer: vi.fn(),
    };

    service = new Service(managerMock);
  });

  describe("createRoom", () => {
    test("Given 필수 정보가 누락되면, When createRoom 호출 시, Then 400 에러를 던져야 함", () => {
      expect(() => service.createRoom(null, "testNick")).toThrow(
        "Service : 정보가 누락되었습니다."
      );
      expect(() => service.createRoom(1, null)).toThrow(
        "Service : 정보가 누락되었습니다."
      );

      expect(managerMock.createRoom).not.toHaveBeenCalled();
      expect(vi.mocked(randomUUID)).not.toHaveBeenCalled();
    });

    test("Given 유효한 userId와 nickname이 주어지면, When createRoom 호출 시, Then Manager 메서드를 올바른 인자로 호출하고 Room ID를 반환해야 함", () => {
      managerMock.createRoom.mockReturnValue("mock-room-id-123");
      const userId = 101;
      const nickname = "HostNick";

      const roomId = service.createRoom(userId, nickname);

      expect(vi.mocked(randomUUID)).toHaveBeenCalledTimes(1);
      expect(managerMock.createRoom).toHaveBeenCalledWith(
        "mock-room-id-123",
        userId,
        nickname
      );

      expect(roomId).toBe("mock-room-id-123");
    });
  });

  describe("checkRoom", () => {
    test("Given 방 정보가 존재하면, When checkRoom 호출 시, Then 해당 방 데이터를 반환해야 함", () => {
      const mockRoomData = { id: 1, players: [] };
      managerMock.getRoomData.mockReturnValue(mockRoomData);

      const result = service.checkRoom(1);

      expect(managerMock.getRoomData).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockRoomData);
    });

    test("Given 방 정보가 존재하지 않으면, When checkRoom 호출 시, Then 에러를 던져야 함", () => {
      managerMock.getRoomData.mockReturnValue(null);

      expect(() => service.checkRoom(999)).toThrow(
        "Service : room 정보 확인 불가"
      );
    });
  });

  describe("joinPlayer", () => {
    test("Given Manager가 Map 형태의 데이터를 반환하면, When joinPlayer 호출 시, Then 배열 형태로 변환하여 반환해야 함", () => {
      const mockPlayersMap = {
        players: new Map([
          [101, { nickname: "Host", connId: "c1" }],
          [202, { nickname: "Guest", connId: "c2" }],
        ]),
      };
      managerMock.joinPlayer.mockReturnValue(mockPlayersMap);

      const result = service.joinPlayer(1, "c3", "Newbie");

      expect(managerMock.joinPlayer).toHaveBeenCalledWith(1, "c3", "Newbie");
      expect(result).toEqual([
        { userId: 101, nickname: "Host" },
        { userId: 202, nickname: "Guest" },
      ]);
    });
  });

  describe("readyPlayer", () => {
    const createMockPlayersMap = (isFull, playersArray) => ({
      isFull: isFull,
      getAllPlayersData: vi.fn().mockReturnValue(playersArray),
    });

    test("Given 방이 꽉 찼고 모두 레디 상태이면, When readyPlayer 호출 시, Then [players, true]를 반환해야 함", () => {
      const allReadyPlayers = [
        { connId: "c1", nickname: "A", isReady: true },
        { connId: "c2", nickname: "B", isReady: true },
      ];
      managerMock.readyPlayer.mockReturnValue(
        createMockPlayersMap(true, allReadyPlayers)
      );

      const [players, canStart] = service.readyPlayer(1, "c1", true);

      expect(canStart).toBe(true);
      expect(players).toEqual(allReadyPlayers);
    });

    test("Given 방이 꽉 찼지만 한 명이라도 레디가 아니면, When readyPlayer 호출 시, Then [players, false]를 반환해야 함", () => {
      const notReadyPlayer = [
        { connId: "c1", nickname: "A", isReady: true },
        { connId: "c2", nickname: "B", isReady: false },
      ];
      managerMock.readyPlayer.mockReturnValue(
        createMockPlayersMap(true, notReadyPlayer)
      );

      const [players, canStart] = service.readyPlayer(1, "c1", true);

      expect(canStart).toBe(false);
      expect(players).toEqual(notReadyPlayer);
    });

    test("Given 방 인원이 부족하면, When readyPlayer 호출 시, Then [players, false]를 반환해야 함", () => {
      const notFullPlayers = [{ connId: "c1", nickname: "A", isReady: true }];
      managerMock.readyPlayer.mockReturnValue(
        createMockPlayersMap(false, notFullPlayers)
      );

      const [players, canStart] = service.readyPlayer(1, "c1", true);

      expect(canStart).toBe(false);
    });
  });
});
