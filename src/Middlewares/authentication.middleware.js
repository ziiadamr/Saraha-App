import {User,BlackListedTokens} from "../DB/Models/index.js"
import { verifyToken } from "../Utils/token.utils.js"

export const authenticationMiddleware = async(req,res,next)=>{

    const {accesstoken} = req.headers
    if(!accesstoken){
        return res.status(401).json({message:"Please provide an access token"})
    }

    //check if token starts with bearer
    if(!accesstoken.startsWith("bearer")){
        return res.status(401).json({message:"Invalid token"})
    }

    const token = accesstoken.split(" ")[1]

    // verify the token
    const decodedToken = verifyToken(token, process.env.ACCESS_TOKEN_SECRET)
    if(!decodedToken.jti){
        return res.status(401).json({message:"Invalid token"})
    }

    // check if the token is black listed
    const isTokenBlacklisted = await BlackListedTokens.findOne({tokenId: decodedToken.jti})
    if(isTokenBlacklisted){
        return res.status(401).json({message:"Token is blacklistd"})
    }
    
    // get user data from db
    const user = await User.findById(decodedToken.userId)
    if(!user){
        return res.status(404).json({message:"User not found"})
    }
    
    req.loggedInUser = {user:{_id:decodedToken.userId, role:user.role},
    token:{tokenId:decodedToken.jti,
    expirationDate:decodedToken.exp}}
    next()
}

