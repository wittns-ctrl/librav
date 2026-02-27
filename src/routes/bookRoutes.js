import express from  'express';
import {createbook,findbook,register,login,progress,refresh} from '../controllers/bookController.js'
import protect from '../middleware/protect.js'
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

