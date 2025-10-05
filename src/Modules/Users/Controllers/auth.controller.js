import { Router } from "express";
import { signUpService,
    signInService, confirmOTP, resendOTP, 
    refreshTokenService} from "../Services/auth.service.js";
import {validationMiddleware, authenticationMiddleware} from "../../../Middlewares/index.js";
import { signUpSchema, signInServiceSchema, 
    confirmOTPSchema, resendOTPSchema } from "../../../Validators/Schemas/user.schema.js";
import { logOut } from "../Services/auth.service.js";

export const authRouter = Router();

authRouter.post("/signup",validationMiddleware(signUpSchema),signUpService);
authRouter.post("/signin",validationMiddleware(signInServiceSchema),signInService)
authRouter.post("/refresh",refreshTokenService)
authRouter.put("/confirm",validationMiddleware(confirmOTPSchema),confirmOTP)
authRouter.put("/resend",validationMiddleware(resendOTPSchema),resendOTP)
authRouter.post("/logout",authenticationMiddleware,logOut)

