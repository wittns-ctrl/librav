import multer from 'multer'
const storage = multer.diskStorage({
    destination: (req,file,cb) => {
        cb(null,"./uploading/cover")
    },
    filename: (req,file,cb) => {
        const filename = Date.now + "-" + file.originalname;
        cb(null,filename)
    }
});
export const upload = multer(
    {
        storage : storage,
        limits: {fileSize : 1024*1024*5},
        fileFilter: (req,file,cb) => {
            if(file.mimetype == 'image/jpen' || file.mimetype == 'image/png'){
                cb(null,true)
            }
            else {
                cb(new Error ('only png and jpeg images allowend'),false)
            }
        }
        
})