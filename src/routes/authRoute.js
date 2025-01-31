import { Router } from 'express';
import * as controller from '../controllers/authController.js';
import { verifyToken } from '../middlewares/auth.js';

const router = Router();

router.post('/regist', controller.registUser);
router.post('/login', controller.loginUser);
router.post('/logout', controller.logoutUser);

router.post('/forget-pw', controller.forgetPassword);
router.post('/reset-pw', controller.resetPassword);
router.post('/update-pw', verifyToken, controller.updatePassword);

router.post('/send-verif-code', verifyToken, controller.sendEmailVerificationCode);
router.post('/verify-code', verifyToken, controller.verifyCode);
router.post('/update-email', verifyToken, controller.updateEmail);

export default router;
