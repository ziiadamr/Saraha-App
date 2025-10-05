import Joi from "joi";

export const signUpSchema = {
  body: Joi.object({
    firstName: Joi.string().required().min(3).max(20)
    .messages({
        "string.min": "First name must be at least 3 characters long",
        "string.max": "First name must be at most 20 characters long",
        "any.required": "First name is required"
    }),
    lastName: Joi.string().required().min(3).max(20)
    .messages({
        "string.min": "Last name must be at least 3 characters long",
        "string.max": "Last name must be at most 20 characters long",
        "any.required": "Last name is required"
    }),
    age: Joi.number().required().min(18).max(120).messages({
        "number.min": "Age must be at least 18",
        "number.max": "Age must be at most 120",
        "any.required": "Age is required"
    }),
    gender: Joi.string().optional(),
    email: Joi.string().required().email().messages({
        "string.email": "Email must be a valid email address",
        "any.required": "Email is required"
    }),
    password: Joi.string().required().pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
    .messages({
        "string.pattern.base": "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
        "any.required": "Password is required"
    }),
    confirmPassword: Joi.string().required().valid(Joi.ref('password'))
    .messages({
        "any.only": "Confirm password must match password",
        "string.pattern.base": "Confirm password must match password"
    }),
    phoneNumber: Joi.string()
    .pattern(/^01[0-2,5][0-9]{8}$/)
    .required()
    .messages({
      "string.pattern.base": "Phone number must be a valid Egyptian number",
      "any.required": "Phone number is required"
    }),
  })
}

export const confirmOTPSchema = {
  body : Joi.object({
    email: Joi.string().required().email().messages({
        "string.email": "Email must be a valid email address",
        "any.required": "Email is required"
    }),
    otp: Joi.string().required().length(4).messages({
      "any.required": "OTP is required",
      "string.length": "OTP must be exactly 4 characters long"
    })
  })
}

export const resendOTPSchema = {
  body : Joi.object({
    email: Joi.string().required().email().messages({
        "string.email": "Email must be a valid email address",
        "any.required": "Email is required"
    })
  })
}

export const signInServiceSchema ={
  body : Joi.object({
    email: Joi.string().required().email().messages({
        "string.email": "Email must be a valid email address",
        "any.required": "Email is required"
    }),
    password: Joi.string().required().messages({
        "any.required": "Password is required"
    })
  })
}

export const updateServiceSchema = {
  body : Joi.object({
    firstName: Joi.string().optional(),
    lastName: Joi.string().optional(),
    age: Joi.number().optional(),
    gender: Joi.string().optional()
  })
}

export const updatePasswordServiceSchema = {
  body : Joi.object({
    oldPassword: Joi.string().required(),
    newPassword: Joi.string().required().pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
    .messages({
        "string.pattern.base": "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
        "any.required": "Password is required"
    }),
    confirmPassword: Joi.string().required().valid(Joi.ref('newPassword'))
    .messages({
        "any.only": "Confirm password must match password",
        "string.pattern.base": "Confirm password must match password"
    })
  })
}

export const forgetPasswordServiceSchema = {
  body : Joi.object({
    email: Joi.string().required().email().messages({
        "string.email": "Email must be a valid email address",
        "any.required": "Email is required"
    })
  })
}

export const confirmResetPasswordOTPSchema = {
  body : Joi.object({
    email: Joi.string().required().email().messages({
        "string.email": "Email must be a valid email address",
        "any.required": "Email is required"
    }),
    otp: Joi.string().required().length(4).messages({
      "any.required": "OTP is required",
      "string.length": "OTP must be exactly 4 characters long"
    })
  })
}

export const resetPasswordServiceSchema = {
  body : Joi.object({
    email: Joi.string().required().email().messages({
        "string.email": "Email must be a valid email address",
        "any.required": "Email is required"
    }),
    password: Joi.string().required().pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
    .messages({
        "string.pattern.base": "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
        "any.required": "Password is required"
    }),
    confirmPassword: Joi.string().required().valid(Joi.ref('password'))
    .messages({
        "any.only": "Confirm password must match password",
        "string.pattern.base": "Confirm password must match password"
    })
  })
}

export const updateEmailServiceSchema = {
  body : Joi.object({
    email: Joi.string().required().email().messages({
        "string.email": "Email must be a valid email address",
        "any.required": "Email is required"
    })
  })
}
