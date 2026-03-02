import {user,using,proceed,tokenize,tokeize,auth} from '../models/book.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import multer from 'multer'
import {hashToken} from '../middleware/protect.js'


export const createbook = async (req,res) => {
    try{
   const book = new user(req.body);
   const newbook = await book.save();
   res.status(201).json({newbook});
    }catch(error){
      res.status(400).send('bad request');
      console.error(error);
    }
}


export const findbook = async (req,res) => {
  try{
    const {
      page = 1,
      limit = 10,
      status,
      rating_gt,
      rating_gte,
      year,
      year_gte,
      year_lte,
      sort = '-createdAt'
    } = req.query;
    const query = {user:req.user._id}
    if (status) {
      query.status = status;
    }
    if (rating_gt) {
      query.rating = {$gt: parseInt(rating_gt)}
    }
    if (rating_gte) { 
      query.rating = {...query.rating, $gte: parseInt(rating_gte)}
    }
    if (year) {
      query.publicationYear = parseInt(year) 
    }
    if (year_gte || year_lte){
      query.publicationYear = {}
      if(year_gte){
        query.publicationYear.$gte= parseInt(year_gte)
      }
      if (year_lte) {
        query.publicationYear.$lte = parseInt(year_lte)
      }
    }
    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);
    const skip = (pageNumber-1)*limitNumber;
    const finder = await user.find(query)
    .sort(sort)
    .skip(skip)
    .limit(limitNumber)
    .populate("author","name")
    const total = await user.countDocuments(query)
    res.status(200).json({
    success : true,
    count : finder.length,
    total,
    totalpages: Math.ceil(total/ limitNumber),
    currentPage : pageNumber,
    data: finder
    });
    console.log("book found");
  }catch(error){
    console.error("finding error:",error.message)}
}


export const register = async (req,res)=> {
  try{
    const {name,email,password} = req.body;
  if(email == using.email){
    return res.status(409).json("user exists");
  }
  const newUSER = await using.create({
    name: name,
    email: email,
    password: password
  });
  res.status(201).json("user created successfully");
}catch(err){
  console.error("registration error: ",err.message);
}
}


export const login = async (req,res) => {
  try{
  const {email,password} = req.body;
  const loggedin = await using.findOne({email});
     if(!loggedin){
    return res.status(404).send("wrong credentials")
  }
  const ext_password =  loggedin.password
  const match = await bcrypt.compare(password,ext_password)
  if(!match) {
    res.status(401).send("invalid password")
  }

  const Accesstoken = jwt.sign(
    {email: loggedin.email,id: loggedin._id},
    process.env.JWT_SECRET,
    {expiresIn:'15m'}
  )
  const refreshtoken = jwt.sign(
    {id: loggedin._id},
    process.env.JWT_REFRESH,
    {expiresIn: '7d'}
  )
 const hashedToken = hashToken(refreshtoken)
  const store_token = await tokenize.create({
    user: loggedin._id,
    token: hashToken(refreshtoken)
  })
  res.json({Accesstoken});
  res.cookie("refreshToken", refreshtoken, {
    httpOnly: true,
    secure: true,
    samaSite: "strict",
    maxAge: 7*24*60*60*1000
  })
  }catch(err){
    console.error("login error:",err.message)
    res.status(500).send("server error")
  }
}


export const progress = async (req,res) => {
  try{
   const {name,book,currentpage,totalPages} = req.body;
   const namer = await using.findOne({name : name});
   const namer_id = await namer._id
    const booker = await user.findOne({title : book});
   const booker_id = await booker._id; 
    const progression = await new proceed({
      user: namer._id ,
      book: booker._id,
      currentPage: currentpage,
      totalPages: book.totalPages
    })
    const saved = await progression.save();
    res.status(200).send("this:",saved.percentage) 
  }catch(error){
  console.error("progress error:", error)
  }
}

export const refresh = async (req,res) => {
  try{
    const tokenRefreshed = req.cookies.refreshToken;
    if(!refreshToken) { 
      return res.status(401).json({ message: "no refresh token"})
    }
    const hashingToken = hashToken(tokenRefreshed);
    const tokenDoc = await tokenize.findOne({token: hashingToken})
  
  if(!tokenDoc){
    return res.status(403).json({ message: "invalid refresh token"})
  }
  jwt.verify(tokenRefreshed,process.env.JWT_REFRESH)
  const newAccessToken = jwt.sign(
    {id: tokenDoc.user},
    process.env.JWT_SECRET,
    {expiresIn: "15m"}
  )
    res.json({newAccessToken: newAccessToken})
  
  }catch (error){
    console.error("requestTokenError",error.message)
  }
}
export const search = async (req, res) => {
  const { title, author } = req.query;
if(!title && !author) return res.send("request not full");
  try {
    const searchString = `${title || ""}  ${author || ""} `.trim();
    const G_search = await user.find(
      {$text: { $search : searchString}},
      {score : { $meta : "textScore"}}
    )
    .sort({score :  { $meta : "textScore"}})
    .limit(1)
    res.status(200).json(G_search)
  } catch (err) {
    res.status(500).json({  searcherror: err.message });
  }
};


export const registerAu = async (req,res) =>{
  try{
   const {name,email,password} = req.body;
   const authExists = await auth.findOne({email})
   if(authExists) return res.status(409).send("user exists");
   const newauth = await auth.create({
    name : name,
    email : email,
    password : password
   })
   res.status(201).send("author created successfully")
  }catch(error) {
 console.error("author RegistrationError:",error.message)
  }
}



export const Aulogin = async (req,res) => {
  try{
  const {email,password} = req.body;
  const logedin = await auth.findOne({email});
     if(!logedin){
    return res.status(404).send("wrong credentials")
  }
  const ext_password =  logedin.password
  const match = await bcrypt.compare(password,ext_password)
  if(!match) {
    res.status(401).send("invalid password")
  }

  const Accesstoken = jwt.sign(
    {email: logedin.email,id: logedin.name},
    process.env.JWT_SECRET,
    {expiresIn:'15m'}
  )
  const refreshtoken = jwt.sign(
    {id: logedin.email},
    process.env.JWT_REFRESH,
    {expiresIn: '7d'}
  )
 const hashedToken = hashToken(refreshtoken)
  const store_token = await tokeize.create({
    user: logedin._id,
    token: hashedToken
  })
  res.cookie("refreshToken", refreshtoken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 7*24*60*60*1000
  })
  res.json({Accesstoken});

  }catch(err){
    console.error("login error:",err.message)
    res.status(500).send("auth server error")
  }
}

export const image = async(req,res) => {
  res.send(req.file)
}

export default createbook;
