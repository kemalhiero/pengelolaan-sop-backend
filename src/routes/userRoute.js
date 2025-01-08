import { Router } from 'express';
import * as userController from '../controllers/userController.js';
import { verifyToken } from '../middlewares/auth.js';

const router = Router();

router.post('/regist', userController.registUser);
router.post('/login', userController.loginUser);
router.post('/logout', userController.logoutUser);

router.get('/lecturer', verifyToken, userController.getLecturerList);

export default router;
