import mongoose from 'mongoose';
const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required:[true, 'title is required'],
        trim: true,
        minlength: 1,
        maxlength: 20
    },
    author : {
     type: String,
     required: [true,'author required'],
     minlength: 1,
     maxlength: 10   
    },
    ISBN : {
        type: String,
        unique: true,
        sparse: true
    },
    publicationYear: {
    type : Number,
    min: 1000,
    max: new Date().getFullYear()+1,
    default : new Date().getFullYear
    },
    status : {
        type: String,
        enum : ['want-to-read','reading','finished','abandoned'],
        default : 'want-to-read'
    },
    rating : {
        type: Number,
        min: 1,
        max: 5
    },
    description: String,
    coverImage: String,
},
{
    timestamps: true
})
export const user = mongoose.model('user',bookSchema);
export default user;