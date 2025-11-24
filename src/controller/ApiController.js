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

      // 서비스가 성공적으로 데이터를 리턴하면 여기서 응답 완료
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
      const { roomId } = req.query.roomId;
      const result = this.service.checkRoom(roomId);
      if (result) {
        res.status(201).json({
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

      res.status(201).json({
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
    // 새로 고침때 게임의 상태에 따라 채팅내역,게임 log 보내줘야됨
    const { _, roomId, nickname, sender } = message;
    const { game, players } = this.service.checkRoom(roomId);
    if (players.players) {
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
    console.log("result", re);
    re.map((element) => {
      this.sender.sendToUser(element, connId);
    });
  }
  handleChat(rawMessage) {
    // 새로고침때 채팅 내역 불러와야 되서 따로 저장필요
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
}

export default ApiController;
