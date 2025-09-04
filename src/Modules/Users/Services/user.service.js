import { compare, compareSync, hashSync } from "bcrypt";
import User from "../../../DB/Models/user.model.db.js";
import BlackListedTokens from "../../../DB/Models/black-listed-tokens.model.db.js";
import { decrypt, encrypt } from "../../../Utils/encryption.utils.js";
import { emitter, sendEmail } from "../../../Utils/send-email-utils.js";
import {customAlphabet} from "nanoid"
import { generateToken, verifyToken } from "../../../Utils/token.utils.js";
import { v4 as uuidv4 } from 'uuid';

export const uniqueOTP = customAlphabet("0123456789",4)

export const signUpService = async (req,res) => {
    const {firstName,lastName,age,gender,email,password, phoneNumber} = req.body;
    const isEmailExist = await User.findOne({email})
    if(isEmailExist){
        return res.status(409).json({message:"Email already exists"})
    }
    const isNameExist = await User.findOne({firstName,lastName})
    if(isNameExist){
        return res.status(409).json({message:"Name already exists"})
    }

    let users = await User.find()
    users= users.map((user)=>{
        return {
            ...user._doc,
            phoneNumber:decrypt(user.phoneNumber)
        }
    })
    if(users.some((user)=>user.phoneNumber===phoneNumber)){
        return res.status(409).json({message:"Phone number already exists"})
    }        

    
        
        //Hash Password
        const hashedPassword = hashSync(password, Number(process.env.SALT_ROUNDS))
        
        const encryptedPhoneNumber = encrypt(phoneNumber)
        
    const OTP = uniqueOTP()
    const user = await User.create({
        firstName,
        lastName,
        age,
        gender,
        email,
        password:hashedPassword,
        phoneNumber:encryptedPhoneNumber,
        otps:{confirmation:hashSync(OTP, Number(process.env.SALT_ROUNDS)),
            expiryDate: new Date(Date.now() + 60 * 10 * 1000)
        }
    })

emitter.emit("sendEmail",{
    to : email,
    subject : "Saraha app confirmation mail",
    content : `<h1> Confirm your email
    <p> Your OTP is : ${OTP}</p></h1>`
})

return res.status(201).json({message:"User created successfully",user})
}

export const confirmOTP = async (req,res)=>{

        const {email, otp} = req.body
        const user = await User.findOne({email, isConfirmed:false})
        if(!user){
            return res.status(400).json({message:"User not found or already confirmed"})
        }
        const isOtpMatched = compareSync(otp, user.otps?.confirmation)
        if(!isOtpMatched){
            return res.status(400).json({message:"Invalid OTP"})
        }

        const isOTPExpired = user.otps?.expiryDate < Date.now()
        if(isOTPExpired){
            return res.status(408).json({message:"OTP expired"})
        }

        user.isConfirmed = true
        user.otps.confirmation= undefined

        await user.save();

        res.status(200).json({message:"confirmed"});
}

export const resendOTP = async (req,res)=>{
    const {email} = req.body
    const user = await User.findOne({email, isConfirmed:false})
    if(!email){
        return res.status(409).json({message:"User not found or already confirmed"})
    }

    const OTP = uniqueOTP()
    const hashedOTP = hashSync(OTP, process.env.SALT_ROUNDS)

    

    user.otps.confirmation = hashedOTP
    user.otps.expiryDate = new Date(Date.now() + 60 * 10 * 1000)

    await user.save()

    emitter.emit("sendEmail",{
        to : email,
        subject : "Saraha app confirmation mail",
        content : `<h1> Confirm your email
        <p> Your OTP is : ${OTP}</p></h1>`
    })

    return res.status(200).json({message:"OTP resend successfully"})
}

export const signInService = async (req,res)=>{
        const {email,password}= req.body;
        const user = await User.findOne({email})
        if(!user){
            return res.status(404).json({message:"Invalid email or password"})
        }
        const isPasswordMatched = compareSync(password,user.password)
        if(!isPasswordMatched){
            return req.status(404).json({message:"Invalid email or password"})
        }

        const accessToken = generateToken({
            userId:user._id,
            email:user.email,
        },process.env.ACCESS_TOKEN_SECRET,
        {expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
        jwtid:uuidv4()}
    )

    const refreshToken = generateToken({
        userId:user._id,
        email:user.email,
    },process.env.REFRESH_TOKEN_SECRET,
    {expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    jwtid:uuidv4()}
)
        return res.status(200).json({message:"User signed in successfully", accessToken,refreshToken})
}

export const updateService = async(req, res)=>{

    
    const {user:{_id}} = req.loggedInUser

        const {firstName,lastName,age,gender,email} = req.body;

        const isEmailExist = await User.findOne({email})
        if(isEmailExist){
            return res.status(409).json({message:"Email already exists"})
        }
        
        const user = await User.findByIdAndUpdate(
            _id,
            {
                firstName,
                lastName,
                age,
                gender,
                email
            },
            { new: true }
        );


        if(!user){
            return res.status(404).json({message:"User not found"})
        }

        return res.status(200).json({message:"User updated successfully", new:user})
}

export const deletedUser = async(req, res)=>{

    const {_id} = req.loggedInUser;
        const deletedUser = await User.findByIdAndDelete(_id)
        if(!deletedUser){
            return res.status(404).json({message:"User not found"})
        }
        return res.status(200).json({message:"User deleted successfully",deletedUser})

}

export const listUsersService = async(req, res)=>{
        let users = await User.find()
        users= users.map((user)=>{
            return {
                ...user._doc,
                phoneNumber:decrypt(user.phoneNumber)
            }
        })
        return res.status(200).json({message:"Users listed successfully",users})
}

export const logOut = async(req, res)=>{


    const {token:{tokenId, expirationDate}, user:{_id}} = req.loggedInUser

    await BlackListedTokens.create({
        tokenId,
        expirationDate: new Date(expirationDate),
        userId:_id
    })

    return res.status(200).json({message:"User logged out successfully"})
}

export const refreshTokenService = async(req,res)=>{
    const {refreshtoken} = req.headers
    const decodedToken = verifyToken(refreshtoken, process.env.REFRESH_TOKEN_SECRET)

    const accessToken = generateToken(
        {userId:decodedToken.userId,
        email:decodedToken.email},
        process.env.ACCESS_TOKEN_SECRET,
        {expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
        jwtid:uuidv4()}
    )

    return res.status(200).json({message:"Your token is refreshed successfully", accessToken})
}

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

    return res.status(200).json({message:"Password updated successfully",user})
}