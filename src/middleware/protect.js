import jwt from 'jsonwebtoken';
export const protect = (req,res,next)=> {
const token = req.headers.authorization?.split(' ')[1];
console.log(req.headers.authorization)
if(!token){
    return res.status(401).json({msg:'no token'});
}
try{
const decoded  = jwt.verify(token,process.env.JWT_SECRET);
req.user = {id : decoded._id};
next();
}catch(err){
    console.error("protection error:",err.message)
}
}