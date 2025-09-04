import crypto from "node:crypto";
// Symmetric Encryption

const ENCRYPTION_SECRET_KEY = Buffer.from(process.env.ENC_KEY);
const IV_LENGHTH = Number(process.env.IV_LENGTH);

export const encrypt = (data)=>{
 
    const iv = crypto.randomBytes(IV_LENGHTH);

    const cipher = crypto.createCipheriv("aes-256-cbc", ENCRYPTION_SECRET_KEY, iv)

    let encyptedData = cipher.update(data, "utf-8", "hex");

    encyptedData += cipher.final("hex");

    return `${iv.toString("hex")}.${encyptedData}`

}

export const decrypt = (data)=>{
    //CREATE IV AND ENCRYPTED DATA
    const [iv, encyptedData]= data.split(".")
    
    const ivBuffer = Buffer.from(iv, "hex")

    const decipher = crypto.createDecipheriv("aes-256-cbc", ENCRYPTION_SECRET_KEY, ivBuffer)

    //UPDATE 
    let decryptedData = decipher.update(encyptedData, "hex", "utf-8")

    decryptedData += decipher.final("utf-8")

    return decryptedData
}