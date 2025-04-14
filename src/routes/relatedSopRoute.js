import { Router } from 'express';
import { verifyToken } from '../middlewares/auth.js';
import { addRelatedSop, deleteRelatedSop, getRelatedSop } from '../controllers/relatedSopController.js';

const router = Router();
router.route('/')
    .post(verifyToken, addRelatedSop);

router.route('/:id')
    .get(getRelatedSop)
    .delete(verifyToken, deleteRelatedSop);

export default router;
