import books from '../models/book.js';
export const createbook = async (req,res) => {
    try{
   const book = new books(req.body);
   const newbook = await book.save();
   res.status(201).json({newbook});
    }catch(error){
      res.status(400).send('bad request');
      console.error(error);
    }
}
export default createbook;