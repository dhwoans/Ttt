class GameManager{
  constructor(board,logs,player){
    this.board = board 
    this.logs = logs
    this.player = player
  }

  openSocket(socket){
    this.socket = socket
  }


}

export default GameManager