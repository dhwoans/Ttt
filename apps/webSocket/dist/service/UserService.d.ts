import type UserModel from "../models/UserModel.js";
import type { SuccessResponse } from "../dtos/SuccessResponse.dto.js";
import type { FailureResponse } from "../dtos/FailureResponse.dto.js";
declare class UserService {
    userModel: UserModel;
    constructor(userModel: UserModel);
    createUser(nickname: string, avatar: string): SuccessResponse<string> | FailureResponse;
}
export default UserService;
//# sourceMappingURL=UserService.d.ts.map