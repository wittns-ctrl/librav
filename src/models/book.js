import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
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
    totalPages : {
        type:Number,
        min: 0,
        required: true
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
});
export const user = mongoose.model('user',bookSchema);



const progress = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'customer',
    required: true
  },
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'bookSchema',
    required: true
  },
  currentPage: {
        type: Number,
        min: [0, 'current page cannot be negative'],
        default: 0
    },
    totalPages: {
        type: Number,
        min: [1, 'total pages must be atleast 1'],
    },
    percentage : {
        type: Number,
        min: 0,
        max: 100,
        requred: true
    },
    status: {
        type: String,
        enum: ['not started','reading','finished'],
        default: 'not started'
    }
},{timestamps: true})
progress.pre('save',function(next){
    this.percentage = Math.round((this.currentPage/this.totalPages)*100)
    if(this.currentPage == 0){
        this.status = 'not started';
    }else if (this.currentPage>=this.totalPages){
        this.status = 'finished'
        this.currentPage = this.totalPages
    }
    else{
        this.status = 'reading'
    }
})
progress.index({user: 1, book: 1},{unique: true});
export const proceed = mongoose.model('procedure', progress);



const customer = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlenght:3,
        maxlength: 20
    },
    email: {
        type: String,
        required: true,
        unique: true,
        sparse: true,
        lowercase: true,
        trim: true,
    },
    password : {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
},{timestamps: true});
customer.pre('save',async function(next){
    if(!this.isModified('password')){
         return next();
        }
        const salt = await bcrypt.genSalt(10);
        const password = await bcrypt.hash(this.password, salt);
        this.password = password;
    ;
});
customer.methods.matchPasword = async function(ent_password) {
    return await bcrypt.compare(ent_password, this.password);
}
export const using = mongoose.model('checker', customer);

