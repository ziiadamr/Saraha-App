import { Router } from "express";
import {updateService, deletedUser,
    listUsersService, updateEmailService,
    uploadAvatarService,
    changeRoleService} from "../Services/user.service.js";
import { USER_ENUM } from "../../../common/enums/user.enum.js";
import { updateServiceSchema, updateEmailServiceSchema } from "../../../Validators/Schemas/user.schema.js";
import {validationMiddleware, authenticationMiddleware, authorizationMiddleware, localUpload} from "../../../Middlewares/index.js";
export const userRouter = Router();

userRouter.put("/update",validationMiddleware(updateServiceSchema),authenticationMiddleware, updateService)
userRouter.put("/update-email",validationMiddleware(updateEmailServiceSchema),authenticationMiddleware, updateEmailService)
userRouter.delete("/delete", authenticationMiddleware ,deletedUser)
userRouter.get("/list",
    authenticationMiddleware,
    authorizationMiddleware([USER_ENUM.ADMIN]),
    listUsersService)

userRouter.post("/upload-avatar",authenticationMiddleware,localUpload({
    folderPath:"avatar"}).single("avatar"),uploadAvatarService)
userRouter.put("/change-role",authenticationMiddleware,authorizationMiddleware([USER_ENUM.ADMIN]),changeRoleService)
