import { Router } from 'express';
import * as drafterController from '../controllers/drafterController.js';

const router = Router();
router.route('/')
    .post(drafterController.addDrafter)

export default router;
