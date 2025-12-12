class ApiController {
  constructor(service, sender) {
    this.service = service;
    this.sender = sender;
  }

  /* ========================================================= */
  /* API 처리 */
  /* ========================================================= */
  createRoom(req, res, next) {
    try {
      console.log(this.constructor.name, " : 방생성 요청");
      const { userId, nickname } = req.body;
      const result = this.service.createRoom(userId, nickname);
      res.status(201).json({
        success: true,
        roomId: result,
      });
    } catch (error) {
      next(error);
    }
  }
  checkRoom(req, res, next) {
    try {
      const roomId = req.query.roomId;
      if (!roomId) {
        console.log(this.constructor.name, " roomId 누락");
        next(new Error("roomId 누락"));
      }
      const result = this.service.checkRoom(roomId);
      if (!result) {
        return next(new Error("없는 방에 접근"));
      }
      console.log(result);
      const { players, game } = result;
      if (players.isFull()) {
        //클라이언트 강제 새로고침
        res.status(200).json({
          success: false,
        });
      } else {
        res.status(200).json({
          success: true,
        });
      }
    } catch (error) {
      next(error);
    }
  }
  getRoomList(req, res, next) {
    try {
      const result = this.service.getRoomList();

      res.status(200).json({
        success: true,
        roomList: result,
      });
    } catch (error) {
      next(error);
    }
  }

  /* ========================================================= */
  /* WS  처리                                                   */
  /* ========================================================= */
  handleJoin(message, connId) {
    // 클라이언트 새로 고침시 채팅내역,플레이어정보,log
    const { _, roomId, nickname, sender } = message;
    const { game, players } = this.service.checkRoom(roomId);
    if (!players) {
      this.sender.sendToUser(
        { type: "ERROR", message: "잘못된 방에 접근", sender: "system" },
        connId
      );
    }
    if (players.players.size === players.MAX_PLAYERS) {
      //새로고침 발생
      const allPlayersList = Array.from(players.players.entries()).map(
        ([userId, playerInfo]) => {
          return {
            type: "JOIN",
            userId: userId,
            nickname: playerInfo.nickname,
          };
        }
      );
      players.players.forEach((value, player) => {
        this.sender.sendToUser(allPlayersList, player);
      });
    } else {
      if (players.players.size === 1) {
        // 먼저온 플레이어에게 내정보 전하기
        players.players.forEach((value, player) => {
          this.sender.sendToUser(
            { type: "JOIN", userId: connId, nickname: message.nickname },
            player
          );
        });
      }
      const result = this.service.joinPlayer(roomId, sender, nickname);

      const re = result.map((element) => {
        return {
          type: "JOIN",
          ...element,
        };
      });
      this.sender.sendToUser(re, connId);
    }
  }
  handleChat(rawMessage) {
    // 새로고침시 채팅 내역 불러와야 되서 따로 저장필요
    const nickname = rawMessage.sender;
    const [roomId, message] = rawMessage.message;
    const { players, game } = this.service.checkRoom(roomId);
    if (!players) throw new Error("없는 방 조회");
    const stringifiedMessage = JSON.stringify({
      type: "CHAT",
      message,
      sender: nickname,
    });
    this.sender.sendToRoom(players.players, stringifiedMessage);
  }
  handleLeave(rawMessage, connId) {
    //게임 상태에 따라 다르게 처리
    //남아있는 사람에게 알림
    const roomId = rawMessage.message;
    const nickname = rawMessage.sender;
    console.log("leave :", roomId);
    const result = this.service.removePlayer(roomId, connId);
    // null 이면 메시지 x
    if (result) {
      const re = result.players;
      const sendMessage = {
        type: "LEAVE",
        message: [connId, nickname], //떠난사람
        sender: "system",
      };
      // 방안에 남아있는 사람에게 메시지 전송
      for (const [playerId, _] of re.entries()) {
        this.sender.sendToUser(sendMessage, playerId);
      }
    }
  }

  handleReady(rawMessage, connId) {
    const [roomId, status] = rawMessage.message;
    const nickname = rawMessage.sender;
    const [playerList, gameStart] = this.service.readyPlayer(
      roomId,
      connId,
      status
    );
    console.log("방안에 있는 사람 :", playerList);
    const readyMessage = {
      type: "READY",
      message: [connId, status],
      sender: "system",
    };
    for (const { connId, nickname, isReady } of playerList) {
      this.sender.sendToUser(readyMessage, connId);
    }
    //게임시작 확인
    if (gameStart) {
      //fsm on
      const state = this.service.gameStart(roomId);
      // console.log(state.status);
      // console.log(state.currentTurn);
      // console.log(state.players);

      //게임시작 메시지 전송
      const startMessage = {
        type: state.status,
        message: state.players[state.currentTurn],
        sender: "system",
      };
      console.log(startMessage);
      for (const { connId, nickname, isReady } of playerList) {
        this.sender.sendToUser(startMessage, connId);
      }
    }
  }
  handleMove(rawMessage, connId) {
    const result = this.service.move(rawMessage);
    const sender = rawMessage.sender;
    const [roomId, index] = rawMessage.message;
    const { game, players } = this.service.checkRoom(roomId);
    const state = game.getState();
    //
    if (result.success) {
      //move 브로드캐스트
      const moveMessage = {
        type: "MOVE",
        message: [sender, index],
        sender: "system",
      };
      //다음턴 이나 게임 결과 전송
      const nextTurnMessage = {
        type: state.status,
        message:
          state.status === "PLAYING"
            ? state.players[state.currentTurn % 2]
            : game.winner, // userId or 0
        sender: "system"
      };
      for (const [userId, _] of players.players) {
        this.sender.sendToUser(moveMessage, userId);
        this.sender.sendToUser(nextTurnMessage, userId);
      }
    } else {
      const errorMessage = {
        type: "ERROR",
        message: result.message,
        sender: "system",
      };
      this.sender.sendToUser(errorMessage, connId);
    }
  }
  handleReset(message, connId) {
    const result = this.service.reset(message, connId);
    const resetMessage = {
      type: "RESET",
      message: result,
      sender: "system",
    };
    this.sender.sendToUser(resetMessage, connId);
  }
}

export default ApiController;
