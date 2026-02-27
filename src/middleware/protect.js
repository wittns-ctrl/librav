import jwt from 'jsonwebtoken';
import crypto from 'crypto'
export const protect = (req,res,next)=> {
const token = req.headers.authorization?.split(' ')[1];
if(!token){
    return res.status(401).json({msg:'no token'});
}
try{
const decoded  = jwt.verify(token,process.env.JWT_SECRET);
req.user = {id : decoded._id};
next();
}catch(err){
    if(err.name === "TokenExpiredError"){
        return res.status(401).json({ success: false, error: "Token expired"})
    }
    return res.status(401).json({sucess: false, error: "invalid token"})
    
    console.error("protection error:",err.message)
}
}
export const hashToken = (token) => {
  crypto.createHash("sha256").update(token).digest("hex")
 }
export default protect;
