import { Router } from 'express';
import * as implementerController from '../controllers/implementerController.js';
import { verifyToken } from '../middlewares/auth.js';

const router = Router();
router.route('/')
    .get(implementerController.getImplementer);

router.route('/sop')
    .get(verifyToken, implementerController.getSopImplementer)
    .post(verifyToken, implementerController.addSopImplementer)
    .delete(verifyToken, implementerController.deleteSopImplementer);

export default router;
