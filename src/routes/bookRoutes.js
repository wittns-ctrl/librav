import express from  'express';
import {createbook,findbook,register,login,progress,refresh,search,registerAu,Aulogin,image} from '../controllers/bookController.js'
import {protect} from '../middleware/protect.js'
import {upload} from '../middleware/upload.js'
export const router = express.Router();
router.route('/')
.post(protect,createbook);
router.route('/find')
.get(protect,findbook);
export default router;
router.route('/register')
.post(register)
router.route('/login')
.post(login)
router.route('/progress')
.post(protect,progress)
router.route('/refresh')
.post(refresh)
router.route('/search')
.get(protect,search)
router.route('/author')
.post(registerAu)
.get(Aulogin)
router.route('/')
.post(upload.single('images'),image)
