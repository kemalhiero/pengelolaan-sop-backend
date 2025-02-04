import { Router } from 'express';
import * as implementerController from '../controllers/implementerController.js';
import { verifyToken } from '../middlewares/auth.js';

const router = Router();
router.route('/')
    .get(verifyToken, implementerController.getImplementer)
    .post(verifyToken, implementerController.addImplementer);

router.route('/sop')
    .get(verifyToken, implementerController.getSopImplementer)
    .post(verifyToken, implementerController.addSopImplementer)
    .delete(verifyToken, implementerController.deleteSopImplementer);

router.route('/:id')
    .patch(verifyToken, implementerController.updateImplementer)
    .delete(verifyToken, implementerController.deleteImplementer);

export default router;
