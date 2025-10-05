import { compareSync, hashSync } from "bcrypt";
import {User} from "../../../DB/Models/index.js";
import { emitter } from "../../../Utils/index.js";
import {customAlphabet} from "nanoid"
export const forgetPasswordOTP = customAlphabet("0123456789",4)
export const uniqueOTP= customAlphabet("0123456789",4)

export const updatePasswordService = async(req, res)=>{
 
    const {user:{_id}} = req.loggedInUser

    const {oldPassword, newPassword} = req.body;

    // Is password and newPassword are provided
    if (!oldPassword || !newPassword) {
      return res.status(400).json({ message: "password and newPassword are required" });
    }

    // Is user exists
    const user = await User.findById(_id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Is oldPassword is correct
    const isMatch = compareSync(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Old password is incorrect" });
    }

    // Is newPassword is same as oldPassword
    const isSameAsOld = compareSync(newPassword, user.password);
    if (isSameAsOld) {
      return res.status(400).json({ message: "New password must be different from old password" });
    }

    // Okay update password with hashed value
    user.password = hashSync(newPassword, Number(process.env.SALT_ROUNDS));
    await user.save();

    return res.status(200).json({message:"Password updated successfully"})
}

export const forgetPasswordService = async(req, res)=>{
        const { email } = req.body;
        const user = await User.findOne({ email, isConfirmed: true });
        if (!user) {
          return res.status(404).json({ message: "User not found or not confirmed" });
        }

        const OTP = uniqueOTP();
        const hashedOTP = hashSync(OTP, Number(process.env.SALT_ROUNDS));
      
        user.otps = {
          resetPassword: hashedOTP,
          expiryDate: new Date(Date.now() + 10 * 60 * 1000), // 10 mins
        };
      
        await user.save();
      
        emitter.emit("sendEmail", {
          to: email,
          subject: "Reset your Saraha password",
          content: `<h1> Reset Password OTP
                    <p>Your OTP is: ${OTP}</p> </h1>`
        });
      
        return res.status(200).json({ message: "OTP sent to email" });      
}


export const resendPasswordOTP = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email, isConfirmed: true });

  if (!user) {
    return res.status(404).json({ message: "User not found or not confirmed" });
  }

  const OTP = uniqueOTP();
  const hashedOTP = hashSync(OTP, Number(process.env.SALT_ROUNDS));

  user.otps.resetPassword = hashedOTP;
  user.otps.expiryDate = new Date(Date.now() + 10 * 60 * 1000);

  await user.save();

  emitter.emit("sendEmail", {
    to: email,
    subject: "Reset your Saraha password",
    content: `<h1> Reset Password OTP
              <p>Your OTP is: ${OTP}</p> </h1>`
  });

  return res.status(200).json({ message: "OTP resent successfully" });
};



export const confirmResetPasswordOTP = async (req, res) => {
    const { email, otp } = req.body;
  
    const user = await User.findOne({ email, isConfirmed: true });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
  
    if (user.otps.expiryDate < Date.now()) {
      return res.status(400).json({ message: "OTP expired" });
    }
  
    const isMatch = compareSync(otp, user.otps.resetPassword);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid OTP" });
    }
  
    user.otps.resetPassword = undefined;
    await user.save();
  
    return res.status(200).json({ message: "OTP confirmed, now reset your password" });
};

export const resetPasswordService = async (req,res)=>{
    const {email, password}= req.body
    const user = await User.findOne({email})
    if(!user){
        return res.status(404).json({message:"User not found"})
    }
    user.password = hashSync(password, Number(process.env.SALT_ROUNDS))
    await user.save()
    return res.status(200).json({message:"Password reset successfully"})
}