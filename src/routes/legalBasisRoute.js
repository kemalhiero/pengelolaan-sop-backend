import { Router } from 'express';
import * as legalBasisController from '../controllers/legalBasisController.js';

const router = Router();
router.route('/')
    .get(legalBasisController.getLegal)
    .post(legalBasisController.addLegal)
    .patch(legalBasisController.updateLegal)
    .delete(legalBasisController.deleteLegal);

router.route('/sop')
    .post(legalBasisController.addSopLegal);

export default router;
