import { hashSync } from "bcrypt";
import {User, Messages} from "../../../DB/Models/index.js";
import {emitter} from "../../../Utils/index.js"
import mongoose from "mongoose";
import {customAlphabet} from "nanoid"
export const uniqueOTP = customAlphabet("0123456789",4)


export const updateService = async(req, res)=>{

    const {user:{_id}} = req.loggedInUser

        const {firstName,lastName,age,gender} = req.body;

        const user = await User.findByIdAndUpdate(
            _id,
            {
                firstName,
                lastName,
                age,
                gender
            });


        if(!user){
            return res.status(404).json({message:"User not found"})
        }

        return res.status(200).json({message:"User updated successfully", user})
}

export const deletedUser = async(req, res)=>{
        //start session
        const session = await mongoose.startSession()
        req.session=session
        
        const {user:{_id}} = req.loggedInUser;
        console.log(_id)
        
        //start transaction
        session.startTransaction()


        const deletedUser = await User.findByIdAndDelete(_id, {session})
        if(!deletedUser){
            return res.status(404).json({message:"User not found"})
        }
        await Messages.deleteMany({receiverId:_id}, {session})
        // delete avatar
        if(deletedUser.avatar){
            fs.unlinkSync(deletedUser.avatar)
        }
        
        //commit transaction
        await session.commitTransaction()
        // end session
        session.endSession()
        console.log("The transaction is committed")

        return res.status(200).json({message:"User deleted successfully",deletedUser})
}

export const listUsersService = async(req, res)=>{
        let users = await User.find()
        .select('-password -phoneNumber -__v -otps.expiryDate') 
        .populate([
            {
                path: 'messages',
                select: 'content receiverId'
            }
        ])

        return res.status(200).json({message:"Users listed successfully",users})
}


export const updateEmailService = async(req,res)=>{
    const {email}=req.body
    const isEmailExist = await User.findOne({email})

    if(isEmailExist){
        return res.status(409).json({message:"Email already exists"})
    }
    
    const {user:{_id}} = req.loggedInUser
    const user = await User.findByIdAndUpdate(_id,{email})
    if(!user){
        return res.status(404).json({message:"User not found"})
    }
    

    const otp = uniqueOTP()
    const hashedOTP = hashSync(otp, Number(process.env.SALT_ROUNDS))

    const updatedUser = await User.findByIdAndUpdate(_id,{
        email:email,
        isConfirmed:false,
        otps:{
            confirmation: hashedOTP,
            expiryDate: new Date(Date.now() + 10 * 60 * 1000), // 10 mins
        }},
        {new:true},        
    ).select ('email isConfirmed firstName lastName')


      emitter.emit("sendEmail", {
        to: email,
        subject: "Confirm your email",
        content: `<h1> Confirm your email
                  <p>Your OTP is: ${otp}</p> </h1>`
      });

      await updatedUser.save()
      
    

    return res.status(200).json({message:"Email updated successfully, OTP sent to email",updatedUser})
}

export const uploadAvatarService = async(req,res)=>{
    const {user:{_id}} = req.loggedInUser
    const {path}=req.file

    const user = await User.findByIdAndUpdate(_id,{avatar:path},{new:true})
    if(!user){
        return res.status(404).json({message:"User not found"})
    }

    return res.status(200).json({message:"Avatar uploaded successfully", user})
}