import {user,using,proceed} from '../models/book.js';
import jwt from 'jsonwebtoken';


export const createbook = async (req,res) => {
    try{
   const book = new user(req.body);
   const newbook = await book.save();
   res.status(201).json({newbook});
    }catch(error){
      res.status(400).send('hbad request');
      console.error(error);
    }
}


export const findbook = async (req,res) => {
  try{
    const finder = await user.find();
    res.status(200).json(finder);
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
  const {name,email,password} = req.body;
  const loggedin = await using.findOne({email});
   if(!loggedin){
    return res.status(404).send("wrong credentials")
  }
  const token = jwt.sign(
    {name: using.name,email: using.email,id: using._id},
    process.env.JWT_SECRET,
    {expiresIn:'1h'}
  )
  res.json({token});
  }catch(err){
    console.error("login error:",err.message)
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