import { compareSync, hashSync } from "bcrypt";
import {User, BlackListedTokens} from "../../../DB/Models/index.js";
import { generateToken, verifyToken, emitter, encrypt, decrypt } from "../../../Utils/index.js";
import {customAlphabet} from "nanoid"
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
    const hashedOTP = hashSync(OTP, Number(process.env.SALT_ROUNDS))

    

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

export const signInService = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
  
    if (!user) {
      return res.status(404).json({ message: "Invalid email or password" });
    }
  
    const isPasswordMatched = compareSync(password, user.password);
    if (!isPasswordMatched) {
      return res.status(404).json({ message: "Invalid email or password" });
    }
  
    // Clean expired refresh tokens before counting
    const validSessions = [];
    for (const s of user.sessions || []) {
      try {
        jwt.verify(s.refreshToken, process.env.REFRESH_TOKEN_SECRET);
        validSessions.push(s);
      } catch (err) {
        // ignore expired/invalid
      }
    }
    if (validSessions.length !== (user.sessions || []).length) {
      user.sessions = validSessions;
      await user.save();
    }
  
    // Check active sessions limit
    if (user.sessions.length >= 2) {
      return res
        .status(403)
        .json({ message: "You can only login from 2 devices at the same time." });
    }
  
    // Generate new tokens
    const accessToken = generateToken(
      {
        userId: user._id,
        email: user.email,
      },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
        jwtid: uuidv4(),
      }
    );
  
    const refreshToken = generateToken(
      {
        userId: user._id,
        email: user.email,
      },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
        jwtid: uuidv4(),
      }
    );
  
    // Save refreshToken in sessions
    user.sessions.push({
      refreshToken,
      createdAt: new Date(),
    });
    await user.save();
  
    return res.status(200).json({
      message: "User signed in successfully",
      accessToken,
      refreshToken,
    });
};

export const logOut = async (req, res) => {
    try {
      const {
        token: { tokenId, expirationDate },
        user: { _id },
      } = req.loggedInUser;
  
      const { refreshToken } = req.body; 
  
      await BlackListedTokens.create({
        tokenId,
        expirationDate: new Date(expirationDate),
        userId: _id,
      });
  
      const user = await User.findById(_id);
      user.sessions = user.sessions.filter(
        (session) => session.refreshToken !== refreshToken
      );
  
      await user.save();
  
      return res
        .status(200)
        .json({ message: "User logged out successfully" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Something went wrong", error });
    }
};
   
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
