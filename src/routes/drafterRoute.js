import { Router } from 'express';
import * as drafterController from '../controllers/drafterController.js';
import { verifyToken } from '../middlewares/auth.js';

const router = Router();
router.route('/')
    .get(verifyToken, drafterController.getAllDrafter)
    .post(verifyToken, drafterController.addSopDrafter);

router.get('/sopdetail/:id', drafterController.getDrafterByIdDetail)

export default router;
