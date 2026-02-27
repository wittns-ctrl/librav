import {user,using,proceed,tokenize} from '../models/book.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
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
    return res.status(404).json("user exists");
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

export default createbook;
