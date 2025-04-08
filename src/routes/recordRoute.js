import { Router } from 'express';
import { verifyToken } from '../middlewares/auth.js';
import { addRecord, deleteSopRecord, getSopRecord } from '../controllers/recordController.js';

const router = Router();
router.route('/')
    .post(verifyToken, addRecord);

router.route('/:id')
    .get(verifyToken, getSopRecord)
    .delete(verifyToken, deleteSopRecord);

export default router;
