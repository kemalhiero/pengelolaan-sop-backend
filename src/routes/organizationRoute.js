import { Router } from 'express';
import { verifyToken } from '../middlewares/auth.js';
import { addOrg, deleteOrg, getOrg, updateOrg } from '../controllers/organizationController.js';

const router = Router();
router.route('/')
    .get(verifyToken, getOrg)
    .post(verifyToken, addOrg)

router.route('/:id')
    .patch(verifyToken, updateOrg)
    .delete(verifyToken, deleteOrg);

export default router;
