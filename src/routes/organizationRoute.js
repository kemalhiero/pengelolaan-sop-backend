import { Router } from 'express';
import * as organizationController from '../controllers/organizationController.js';
import { verifyToken } from '../middlewares/auth.js';

const router = Router();
router.route('/')
    .get(verifyToken, organizationController.getOrg)
    .post(verifyToken, organizationController.addOrg)
    .delete(verifyToken, organizationController.deleteOrg)
    .patch(verifyToken, organizationController.updateOrg)

export default router;
