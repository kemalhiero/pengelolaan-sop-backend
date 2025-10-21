import { Router } from 'express';
import { verifyToken } from '../middlewares/auth.js';
import { addRelatedSop, deleteRelatedSop, getRelatedSop } from '../controllers/relatedSopController.js';

const router = Router();

router.post('/', verifyToken, addRelatedSop);
router.get('/:id', getRelatedSop);
router.delete('/:id_sop_detail/:id_sop', verifyToken, deleteRelatedSop);

export default router;
