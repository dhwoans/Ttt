import whoWin from "../utils/whoWin.js"

class Service {
  constructor() {
    this.logs = new Map();
    this.rooms = new Map();
    this.board = [
      ["", "", ""],
      ["", "", ""],
      ["", "", ""],
    ];
  }
  // 플레이어 관련 로직
  managePlayer(data) {
    const {type,status,sender} = data
    const {roomNum,player} = sender
    if(status === 'in'){
      if(!this.rooms.get(roomNum)){
        this.rooms.set(roomNum,new Map([player,'O']))
      }else{
        this.rooms.get(roomNum).set(player, "X");
      }
    }else if(status === 'out'){
      this.players.get(roomNum).delete(player);
    }
    return [true, data, this.players];
  }
  // 보드판 관련 로직
  manageBoard(data) {
    const [roomNum,player] = data.sender
    const  symbol =this.rooms.get(roomNum).get(player)
    //유효성 검사
    const [x,y] = data.move;
    
    if (turn != sysmbol) return [false, "invalid symbol"];
    this.logs.push(data);
    //보드 업데이트
    this.board[x][y] = symbol;
    // 승리판정
    const result = whoWin(this.board);
    if (this.logs.length === 9 && result === -1) return [true, 0];
    return [true, result, this.players];
  }
  //채팅 관련 로직
  manageChat(message) {
    return [true, message, this.players];
  }
}


export default Service;