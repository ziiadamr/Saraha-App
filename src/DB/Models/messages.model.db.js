import mongoose from "mongoose";
import {STATUS_ENUM} from "../../common/enums/index.js"
export const messagesSchema = new mongoose.Schema({
  content:{
    type: String,
    required:true
  },
  status:
  {
    type: String,
    enum: Object.values(STATUS_ENUM), 
    default:STATUS_ENUM.PRIVATE
  },
  receiverId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
},{
    timestamps:true
})

export const Messages = mongoose.model("Messages",messagesSchema)