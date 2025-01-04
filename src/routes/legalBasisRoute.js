import { Router } from 'express';
import * as legalBasisController from '../controllers/legalBasisController.js';
import { verifyToken } from '../middlewares/auth.js';

const router = Router();
router.route('/')
    .get(verifyToken, legalBasisController.getLegal)
    .post(verifyToken, legalBasisController.addLegal)
    .patch(verifyToken, legalBasisController.updateLegal)
    .delete(verifyToken, legalBasisController.deleteLegal);

router.route(verifyToken, '/sop')
    .get(verifyToken, legalBasisController.getSopLegal)
    .post(verifyToken, legalBasisController.addSopLegal)
    .delete(verifyToken, legalBasisController.deleteSopLegal);

export default router;
