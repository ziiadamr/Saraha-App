import { Router } from "express";
import {updatePasswordService,
    forgetPasswordService,
    confirmResetPasswordOTP, resetPasswordService, 
    resendPasswordOTP} from "../Services/password.service.js";
import {validationMiddleware, authenticationMiddleware} from "../../../Middlewares/index.js";
import {updatePasswordServiceSchema, forgetPasswordServiceSchema, confirmResetPasswordOTPSchema, resetPasswordServiceSchema} from "../../../Validators/Schemas/user.schema.js";

export const passwordRouter = Router();

passwordRouter.put("/update-password",validationMiddleware(updatePasswordServiceSchema),authenticationMiddleware, updatePasswordService)
passwordRouter.put("/forget-password",validationMiddleware(forgetPasswordServiceSchema),authenticationMiddleware,forgetPasswordService)
passwordRouter.put("/confirm-reset-password-otp",validationMiddleware(confirmResetPasswordOTPSchema),authenticationMiddleware,confirmResetPasswordOTP)
passwordRouter.put("/reset-password",validationMiddleware(resetPasswordServiceSchema),authenticationMiddleware,resetPasswordService)
passwordRouter.put("/resend-password-otp",authenticationMiddleware,resendPasswordOTP)

