import type UserModel from "../models/UserModel.js";

class UserService {
  userModel: UserModel;
  constructor(userModel: UserModel) {
    this.userModel = userModel;
  }
  createUser(nickname:string,avator:string){
    
  }

}

export default UserService;
