import mongoose from "mongoose";

export const blackListedTokensSchema = new mongoose.Schema({
    tokenId:{
        type:String,
        required:true,
        unique:true
    },
    expirationDate:{
        type: Date,
        required:true
    }
})

export const BlackListedTokens = mongoose.model("BlackListedTokens",blackListedTokensSchema)
