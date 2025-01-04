import { Router } from 'express';
import * as relatedSopController from '../controllers/relatedSopController.js';
import { verifyToken } from '../middlewares/auth.js';

const router = Router();
router.route('/')
    .get(verifyToken, relatedSopController.getRelatedSop)
    .post(verifyToken, relatedSopController.addRelatedSop)
    .delete(verifyToken, relatedSopController.deleteRelatedSop);

export default router;
