import { Router } from 'express';
import { verifyToken } from '../middlewares/auth.js';
import {
    loginUser, registUser, logoutUser,
    forgetPassword, resetPassword, updatePassword,
    sendCode, verifyCode, updateEmail
} from '../controllers/authController.js';

const router = Router();

router.post('/regist', registUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);

router.post('/password/forgot', forgetPassword);
router.post('/password/reset', resetPassword);
router.post('/password/update', verifyToken, updatePassword);

router.post('/send-code', verifyToken, sendCode);
router.post('/verify-code', verifyToken, verifyCode);
router.post('/update-email', verifyToken, updateEmail);

export default router;
