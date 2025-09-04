import nodemailer from 'nodemailer';
import {EventEmitter} from "node:events"

export const sendEmail = async(
    {
        subject,
        content,
        to

    }
)=>{

    const transporter = nodemailer.createTransport({
        host : 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth:{
            user: process.env.EMAIL_USER, 
            pass: process.env.EMAIL_PASS   
        }
    })

    const info = await transporter.sendMail({
        from : process.env.EMAIL_USER,
        to : to, 
        subject : subject,
        html : content,  
    })

    console.log("info:", info);
    return info
}

export const emitter = new EventEmitter()

emitter.on("sendEmail",(args)=>{

    sendEmail(args)
    
    console.log(`The Sending Email Event Is Triggered`)
    console.log(args)
})
