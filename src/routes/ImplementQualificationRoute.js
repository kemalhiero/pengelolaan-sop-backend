import { Router } from 'express';
import { verifyToken } from '../middlewares/auth.js';
import { addSopIQ, deleteSopIQ, getSopIQ } from '../controllers/implementQualificationController.js';

const router = Router();

router.post('/', verifyToken, addSopIQ);

router.route('/:id')
    .get(verifyToken, getSopIQ)
    .delete(verifyToken, deleteSopIQ);

export default router;
