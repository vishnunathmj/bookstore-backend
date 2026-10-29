const multer = require('multer')

// define storage for upload files
const storage = multer.diskStorage({
    destination:(req,file,callback)=>{
        callback(null,'./Uploads')
    },
    filename:(req,file,callback)=>{
        callback(null,`image-${Date.now()}-${file.originalname}`)
    }
})

const fileFilter = (req,file,callback)=>{
    if(file.mimetype.startsWith("image/")){
        callback(null,true)
    }else{
        callback(null,false)
    }
}

const MulterMiddleware = multer({
    storage,fileFilter
})

module.exports = MulterMiddleware