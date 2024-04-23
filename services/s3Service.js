// const { path } = require('@ffmpeg-installer/ffmpeg');
const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');
const path=require("path");




const s3 = new AWS.S3({
    accessKeyId: process.env.ID,
    secretAccessKey: process.env.KEY
})

const fileUploadS3=(file)=>{

    // Writing out logic for file upload


    // const fileType = file.originalname.split(".")[1];

    const params = {
        Bucket: "uploaded-project-videos",
        Key: `${uuidv4()}.mp3`,
        Body:file,
        ContentType:'audio/mpeg',
        ACL: 'public-read-write'
    }



    return new Promise((res,rej)=>{

        s3.upload(params,(err,result)=>{

            if(err){
                rej(err);
            }

           res(result)
    
        })

    })


  

}

module.exports={
    fileUploadS3,s3
}