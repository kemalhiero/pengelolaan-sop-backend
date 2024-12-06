import { Router } from 'express';
import * as equipmentController from '../controllers/equipmentController.js';

const router = Router();
router.route('/')
    .post(equipmentController.addEquipment);
    
export default router;
