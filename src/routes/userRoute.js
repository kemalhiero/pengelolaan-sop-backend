import { Router } from 'express';
import * as userController from '../controllers/userController.js';

const router = Router();

router.post('/regist',userController.registUser);
router.post('/login',userController.loginUser);
router.post('/logout',userController.logoutUser);

export default router;
