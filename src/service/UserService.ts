import type UserModel from "../models/UserModel.js";
import crypto from "crypto";
import type { SuccessResponse } from "../dtos/SuccessResponse.dto.js";
import type { FailureResponse } from "../dtos/FailureResponse.dto.js";

class UserService {
  userModel: UserModel;
  constructor(userModel: UserModel) {
    this.userModel = userModel;
  }

  createUser(
    nickname: string,
    avatar: string,
  ): SuccessResponse<string> | FailureResponse {
    try {
      // 랜덤 userId 생성 (현재는 임시로 생성만, 추후 MongoDB에 저장 예정)
      const userId = `user_${crypto.randomBytes(8).toString("hex")}`;

      console.log("[UserService] User created:", { userId, nickname, avatar });

      // TODO: MongoDB에 사용자 정보 저장
      // await this.userModel.saveUser({ userId, nickname, avatar });

      return {
        success: true,
        message: userId,
      };
    } catch (error) {
      console.error("[UserService] Error creating user:", error);
      return {
        success: false,
        message: "Failed to create user",
      };
    }
  }
}

export default UserService;
