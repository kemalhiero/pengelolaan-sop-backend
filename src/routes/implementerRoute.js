import { Router } from 'express';
import * as implementerController from '../controllers/implementerController.js';

const router = Router();
router.route('/')
    .get(implementerController.getImplementer);
    
router.route('/sop')
    .post(implementerController.addSopImplementer)

export default router;
