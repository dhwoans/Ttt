import crypto from "crypto";
class UserService {
    userModel;
    constructor(userModel) {
        this.userModel = userModel;
    }
    createUser(nickname, avatar) {
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
        }
        catch (error) {
            console.error("[UserService] Error creating user:", error);
            return {
                success: false,
                message: "Failed to create user",
            };
        }
    }
}
export default UserService;
//# sourceMappingURL=UserService.js.map