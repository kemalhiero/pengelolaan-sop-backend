import { Router } from 'express';
import { verifyToken } from '../middlewares/auth.js';
import {
    addLegal, deleteLegal, getLegal, updateLegal,
    addSopLegal, deleteSopLegal, getSopLegal
} from '../controllers/legalBasisController.js';

const router = Router();
router.route('/')
    .get(verifyToken, getLegal)
    .post(verifyToken, addLegal);

router.route('/:id')
    .patch(verifyToken, updateLegal)
    .delete(verifyToken, deleteLegal);

router.get('/sop/:id', getSopLegal);
router.post('/sop', verifyToken, addSopLegal);

router.delete('/sop/:sopDetailId/:legalId', verifyToken, deleteSopLegal);

export default router;
