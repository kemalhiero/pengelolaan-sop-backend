import { Router } from 'express';
import * as recordController from '../controllers/recordController.js';

const router = Router();
router.route('/')
    .get(recordController.getSopRecord)
    .post(recordController.addRecord)
    .delete(recordController.deleteSopRecord);
    
export default router;
