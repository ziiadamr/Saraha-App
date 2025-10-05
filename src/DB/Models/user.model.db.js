    import mongoose from "mongoose";
import { GENDER_ENUM, USER_ENUM } from "../../common/enums/user.enum.js";
export const userSchema = new mongoose.Schema({

        firstName:{
            type:String,
            required:true,
            minLength:[3,"Name must be at least 3 characters long"],
            maxLength: 20,
            lowercase:true, //converts to lowercase
            trim:true,  //removes extra spaces
        },
        lastName:{
            type:String,
            required:true,
            minLength:[3,"Name must be at least 3 characters long"],
            maxLenght: 20,
            lowercase:true, //converts to lowercase
            trim:true,  //removes extra spaces
        },
        age:{
            type: Number,
            require:true,
            min:[18,"Age must be at least 18"],
            max:[120,"Age must be at most 120"],
            index:{
                name: "AgeIndex",
            }
        },
        gender:{
            type: String,
            enum:GENDER_ENUM,
            default:GENDER_ENUM.MALE
        },
        email:{
            type:String,
            required:true,
            index:{
                unique:true,
                name:"emailIndex"   
            }
        },
        password:{
            type: String,
            required: true,
        },
        
        phoneNumber:{
            type: String,
            required:true,
            unique:true
        },
        otps:{
            confirmation:String,
            resetPassword:String,
            expiryDate:Date
        },
        isConfirmed:{
            type:Boolean,
            default:false
        },
        role:{
            type:String,
            enum:USER_ENUM,
            default:USER_ENUM.USER
        },
        sessions: [
            {
              refreshToken: String,
              createdAt: { type: Date, default: Date.now },
            },
          ],
          avatar:String
    },{
        timestamps:true,
        toJSON:{
            virtuals:true
        },
        virtuals:
        {
            fullName:{
                type:String,
                get(){
                    return `${this.firstName} ${this.lastName}`
                }
            }
        }
    });

    userSchema.virtual("messages",{
        ref:"Messages",
        localField:"_id",
        foreignField:"receiverId"
    })

  export const User =  mongoose.model("User",userSchema);
