class Controller {
  constructor(service) {
    this.service = service;
  }

  sendService(rawMessage) {
    const { type, message, sender } = rawMessage;
    if (type === "info") {
      // 시스템 판정 - 들어오고 나감
      console.log(rawMessage)
      const [result,data,clients] = this.service.managePlayer(message);
      if(result)
      return [clients,
        {
          type: "info",
          message: data,
          sender: "system",
        }
      ]
    } else if (type === "move") {
      const [result,data,clients] = this.service.manageBoard(message);
      // -1 승자없음
      // 0 무승부
      // 1 x 승
      // 2 o 승
      if(result)
      return [clients,
        {
          type: "move",
          message: data,
          sender: "system",
        },
      ];
    } else if (type === "chat") {
      // 채팅
      const [result,data,clients] = this.service.manageChat(message);
      if(result)
        return [clients,{
        type: "chat",
        message : data,
        sender: sender
      },clients];
    }
  }
}


export default Controller