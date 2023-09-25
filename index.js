const express = require("express")
const app = express();
const  multipart = require('connect-multiparty');
const path=require("path");
const cors = require("cors")




app.use(express.json())
app.use(cors())


const fs = require("fs")

const  multipartMiddleware = multipart({ uploadDir: `${path.join(__dirname,"./uploads")}` });



const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegPath);


app.post("/upload",multipartMiddleware,(req,res)=> {

    var arg = ""

    fs.readdir('./uploads',(err,data)=> {
        data.forEach((ele)=> {
            console.log(ele)
            arg = ele
            var base = new String(ele).substring(ele.lastIndexOf("/") + 1)

    if(base.lastIndexOf(".") != -1) {
        base = base.substring(0,base.lastIndexOf("."))
        console.log(base)
    }

        })


        ffmpeg(`./uploads/${arg}`).
        toFormat('mp3').
        saveToFile('converted.mp3',()=> {

        })

        res.json({
            "message":"success"
        })
        
    })

    


        
        
        
})


app.get('/converted',(req,res)=> {
    res.sendFile(path.join(__dirname, 'converted.mp3'))
})

app.put('/unlink',(req,res)=> {
    fs.unlink(path.join(__dirname, 'converted.mp3'),()=> {
        console.log("ok")
    })
    res.json({
        message:"done"
    })
})


app.listen("8090",()=> {
    console.log("server started on 8090")
})