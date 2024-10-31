import { Router } from 'express';
import * as organizationController from '../controllers/organizationController.js';

const router = Router();
router.route('/')
    .get(organizationController.getOrg)
    .post(organizationController.addOrg)
    .delete(organizationController.deleteOrg)
    .patch(organizationController.updateOrg)

export default router;
