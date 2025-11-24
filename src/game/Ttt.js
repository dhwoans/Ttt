import whoWin from "../../utils/whoWin.js";
class Ttt {
  constructor(roomId) {
    this.roomId = roomId;
    //(waiting, playing, finished)
    this.status = "WAITING";
    this.logs = [];
    this.board = [
      ["", "", ""],
      ["", "", ""],
      ["", "", ""],
    ];
    this.players = [];
    this.winner = null;
  }
  /**
   * 
   * @param {string} symbol - 마지막 수를 둔 심볼
   */
  setPlayer(userId, nickname) {
    const playerInfo = {
      userId,
      nickname,
    };
    this.players.push(playerInfo);
    return true;
  }
  /**
   * 게임 안에 있는 플레이어 반환
   * @param {string} symbol 
   */
  getPlayers(){
    return this.players
  }
  /**
   * 유효성 검사 착수 로그 기록
   * @param {string} symbol - 놓을 심볼 ('X' 또는 'O')
   * @param {number} x
   * @param {number} y
   * @returns {object} { success: boolean, message: string }
   */
  makeMove(symbol, x, y) {
    if (symbol !== this.getTurn()) {
      return { success: false, message: `현재 ${this.getTurn()}의 턴입니다.` };
    }

    if (this.board[x][y] !== "") {
      return { success: false, message: "잘못된 위치입니다." };
    }
    this.board[x][y] = symbol;
    this.logs.push({ symbol, x, y, timestamp: Date.now() });

    //승리 또는 무승부 체크
    this.updateGameStatus(symbol);

    return { success: true, message: "수가 성공적으로 놓여졌습니다." };
  }

  /**
   * 승리 또는 무승부 확인
   * @param {string} symbol - 마지막 수를 둔 심볼
   */
  updateGameStatus() {
    result = whoWin();
    if (result !== -1) {
      this.status = "FINISHED";
      this.winner = result;
      return;
    }

    if (this.logs.length === 9 && result === -1) {
      this.status = "FINISHED";
      this.winner = "DRAW";
      return;
    }

    // 게임이 진행 중일 경우
    this.status = "PLAYING";
  }
  /**
   * 게임 상태 반환
   * @returns {Array} [게임상태,승리자]
   */
  getStatus() {
    return [this.status, this.winner];
  }

  /**
   * 차례 반환
   * @returns {string} 'X' 또는 'O'
   */
  getTurn() {
    return this.logs.length % 2 === 0 ? "X" : "O";
  }
}

export default Ttt;
