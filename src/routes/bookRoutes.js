import express from  'express';
import createbook from '../controllers/bookController.js'
export const router = express.Router();
router.route('/')
.post(createbook);
export default router;

