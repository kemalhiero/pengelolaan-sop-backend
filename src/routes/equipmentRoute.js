import { Router } from 'express';
import { verifyToken } from '../middlewares/auth.js';
import { addEquipment, deleteEquipment, getSopEquipment } from '../controllers/equipmentController.js';

const router = Router();
router.route('/')
    .post(verifyToken, addEquipment);

router.route('/:id')
    .get(verifyToken, getSopEquipment)
    .delete(verifyToken, deleteEquipment);

export default router;
