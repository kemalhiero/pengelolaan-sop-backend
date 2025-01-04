import { Router } from 'express';
import * as recordController from '../controllers/recordController.js';
import { verifyToken } from '../middlewares/auth.js';

const router = Router();
router.route('/')
    .get(verifyToken, recordController.getSopRecord)
    .post(verifyToken, recordController.addRecord)
    .delete(verifyToken, recordController.deleteSopRecord);
    
export default router;
