import { Router } from 'express';
import * as implementQualificationController from '../controllers/implementQualificationController.js';

const router = Router();
router.route('/')
    .get(implementQualificationController.getSopIQ)
    .post(implementQualificationController.addSopIQ)
    .delete(implementQualificationController.deleteSopIQ);
    
// router.route('/sop')
//     .post(implementQualificationController.addSopImplementer)

export default router;
