import { Router } from 'express';
import * as drafterController from '../controllers/drafterController.js';

const router = Router();
router.route('/')
    .get(drafterController.getDrafter)
    
router.route('/sop')
    .post(drafterController.addSopDrafter)

export default router;
