    const express = require("express")
    const app = express();
    const  multipart = require('connect-multiparty');
    const path=require("path");
    const cors = require("cors")
    require('dotenv').config()
    const {fileUploadS3} = require('./services/s3Service')
    const AWS = require('aws-sdk');
    const multer = require('multer');



    
    app.use(express.json())
    app.use(cors())


    const fs = require("fs")

    const  multipartMiddleware = multipart({ uploadDir: `${path.join(__dirname,"./uploads")}` });

    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
          // Define the destination folder here
          cb(null, 'uploads/');
        },
        filename: function (req, file, cb) {
          // Define the filename here (you can use the original filename or generate a unique name)
          cb(null,file.originalname);
        }
      });

    const uploaded = multer({storage:storage});


    const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
    const ffmpeg = require('fluent-ffmpeg');
    ffmpeg.setFfmpegPath(ffmpegPath);

    let target = ""

    const convertToMp3 = (output) => {
        return new Promise((res,rej)=> {
            ffmpeg(`./uploads/${target[0]}`).
            toFormat('mp3').
            on('end', () => {
                res(output);
            }).
            saveToFile(output,()=> {
            })
        })
    }

    app.post("/upload",uploaded.single('file'),async (req,res)=> {

        fs.readdir('./uploads',async (err,data)=> {
            target = data.filter((ele)=> {
                return ele == req.file.originalname
            })
            
            
           
            let output = 'converted.mp3'

            try {

                await convertToMp3(output)

                fs.readFile(output,async (err,music)=> {

                    fileUploadS3(music).then((data)=> {
                        res.json({
                            message:"success",
                            data:data
                        })  


                    })
                })

                fs.unlink(output,(err)=> {
                    if(err) {
                        console.log(err)
                    }
                })
            }

            catch(err) {
                console.log(err)
            }
            
        })

    })

    app.listen("8090",()=> {
        console.log("server started on 8090")
    })