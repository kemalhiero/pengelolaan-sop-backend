import { Router } from 'express';
import * as equipmentController from '../controllers/equipmentController.js';
import { verifyToken } from '../middlewares/auth.js';

const router = Router();
router.route('/')
    .get(verifyToken, equipmentController.getSopEquipment)
    .post(verifyToken, equipmentController.addEquipment)
    .delete(verifyToken, equipmentController.deleteEquipment);
    
export default router;
