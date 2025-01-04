import { Router } from 'express';
import * as implementQualificationController from '../controllers/implementQualificationController.js';
import { verifyToken } from '../middlewares/auth.js';

const router = Router();
router.route('/')
    .get(verifyToken, implementQualificationController.getSopIQ)
    .post(verifyToken, implementQualificationController.addSopIQ)
    .delete(verifyToken, implementQualificationController.deleteSopIQ);
    
// router.route('/sop')
//     .post(implementQualificationController.addSopImplementer)

export default router;
