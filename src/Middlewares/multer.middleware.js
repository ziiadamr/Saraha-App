import multer from "multer";
import fs from "node:fs";
import { allowedFileExtensions, fileTypes } from "../common/constant/file.constant.js";

function checkOrCreateFolder(folderPath){
    if(!fs.existsSync(folderPath)){
        fs.mkdirSync(folderPath,{recursive:true});
    }
}

export const localUpload = ({
    folderPath = 'samples',
    limits={
    }
})=>{
    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            const fileDir = `uploads/${folderPath}`;
            checkOrCreateFolder(fileDir);
            cb(null, fileDir);
        },
        filename: (req, file, cb) => {
            const uniqueFileName = Date.now()+ "-" + Math.round(Math.random() * 1E9);
            cb(null, `${uniqueFileName}_${file.originalname}`);
        }
    })

    const fileFilter = (req, file, cb) => {

        const fileKey = file.mimetype.split('/')[0]
        const fileType = fileTypes[fileKey]

        if(!fileType){
            return cb(new Error("Invalid file type"), false)
        }

        const fileExtension = file.mimetype.split('/')[1]
        if(!allowedFileExtensions[fileType].includes(fileExtension)){
            return cb(new Error("Invalid file extension"), false)
        }
        return cb(null, true)
    }



    return multer({fileFilter,
        storage,
        limits:{
            fileSize:1024*1024*5,
            files:1
        }})
}