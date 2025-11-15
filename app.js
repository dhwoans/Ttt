import Socket from "./modules/WebSocket.js";
import Controller from "./modules/Controller.js"
import Service from "./modules/Service.js"

const service = new Service()
const controller = new Controller(service)
new Socket(8080,controller);
