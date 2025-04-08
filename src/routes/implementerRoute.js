import { Router } from 'express';
import { verifyToken } from '../middlewares/auth.js';
import {
    addImplementer, getImplementer, updateImplementer, deleteImplementer,
    addSopImplementer, getSopImplementer, deleteSopImplementer
} from '../controllers/implementerController.js';

const router = Router();
router.route('/')
    .get(verifyToken, getImplementer)
    .post(verifyToken, addImplementer);

router.post('/sop', verifyToken, addSopImplementer);
router.get('/sop/:id',verifyToken, getSopImplementer)

router.delete('/sop/:sopDetailId/:implementerId', verifyToken, deleteSopImplementer)

router.route('/:id')
    .patch(verifyToken, updateImplementer)
    .delete(verifyToken, deleteImplementer);

export default router;
