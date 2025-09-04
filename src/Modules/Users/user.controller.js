import { Router } from "express";
import { signUpService, updateService, deletedUser, signInService, listUsersService, confirmOTP, resendOTP, logOut, refreshTokenService, updatePasswordService } from "./Services/user.service.js";
import authenticationMiddleware from "../../Middlewares/authentication.middleware.js";

const router = Router();

router.post("/signup",signUpService);
router.post("/signin",signInService)
router.put("/update",authenticationMiddleware, updateService)
router.post("/logout", authenticationMiddleware,logOut)
router.post("/refresh",refreshTokenService)
router.put("/update-password",authenticationMiddleware, updatePasswordService)

router.delete("/delete", authenticationMiddleware ,deletedUser)
router.get("/list",listUsersService)

router.put("/confirm",confirmOTP)
router.put("/resend",resendOTP)

export default router;