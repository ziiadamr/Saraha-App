import User from "../../../DB/Models/user.model.db.js";
import Messages from "../../../DB/Models/messages.model.db.js";


export const sendMessagesService = async(req,res)=>{
    const {content} = req.body;
    const{reciverId} = req.params

    const user = await User.findById(reciverId)
    if (!user){
        return res.status(404).json({message:"User not found"})
    }
    
    const message = new Messages({
        content,
        receiver:reciverId
    })
    await message.save()
    
    res.status(200).json({message:"Message sent successfully",messageContent:message.content})    
}
