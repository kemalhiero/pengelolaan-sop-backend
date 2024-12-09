import { Router } from 'express';
import * as equipmentController from '../controllers/equipmentController.js';

const router = Router();
router.route('/')
    .get(equipmentController.getSopEquipment)
    .post(equipmentController.addEquipment);
    
export default router;
