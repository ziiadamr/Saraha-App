import {User, Messages} from "../../../DB/Models/index.js";
import {STATUS_ENUM} from "../../../common/enums/index.js"

export const sendMessagesService = async(req,res)=>{
    const {content} = req.body;
    const{receiverId} = req.params

    const user = await User.findById(receiverId)
    if (!user){
        return res.status(404).json({message:"User not found"})
    }

    if(user._id.toString() === req.loggedInUser.user._id.toString()){
        return res.status(400).json({message:"You can't send message to yourself"})
    }
    if(user.isConfirmed === false){
        return res.status(400).json({message:"User is not confirmed"})
    }
    
    const message = new Messages({
        content,
        receiverId
    })
    await message.save()
    
    res.status(200).json({message:"Message sent successfully",message})    
}


export const listMessagesService = async(req,res)=>{
    const {user:{_id}} = req.loggedInUser;

    const messages = await Messages.find({receiverId:_id}).populate([
        {
            path: 'receiverId',
            select: 'firstName lastName'
        }
    ])
    if (messages.length===0){
        return res.status(404).json({message:"No messages found"})
    }
    return res.status(200).json({message:"Messages listed successfully",messages})
}

export const changeMessageStatusService = async(req,res)=>{
    const {_messageid} = req.params
    const {status} = req.body
    const specificMessage= await Messages.findById(_messageid)
    if (!specificMessage){
        return res.status(404).json({message:"Message not found"})
    }
    specificMessage.status = status
    await specificMessage.save()
    return res.status(200).json({message:"Message status changed successfully",specificMessage})
}

//List Public Message of user
export const listPublicMessagesService = async(req,res)=>{
    const {_id} = req.params
    const messages = await Messages.find({receiverId:_id,status:STATUS_ENUM.PUBLIC}).populate([
        {
            path: 'receiverId',
            select: 'firstName lastName'
        }
    ])
    if (messages.length===0){
        return res.status(404).json({message:"No public messages found"})
    }
    return res.status(200).json({message:"Public messages listed successfully",messages})
}

export const deleteMessageService = async(req,res)=>{

    const {_messageid}=req.params

    const specificMessage = await Messages.findById(_messageid)
    if (!specificMessage){
        return res.status(404).json({message:"Message not found"})
    }
    if (specificMessage.receiverId._id.toString() !== req.loggedInUser.user._id.toString()){
        return res.status(400).json({message:"You are not authorized to delete this message"})
    }
    await specificMessage.deleteOne()
    return res.status(200).json({message:"Message deleted successfully",specificMessage})
}