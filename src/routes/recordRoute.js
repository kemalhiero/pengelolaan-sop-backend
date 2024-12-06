import { Router } from 'express';
import * as recordController from '../controllers/recordController.js';

const router = Router();
router.route('/')
    .post(recordController.addRecord);
    
export default router;
