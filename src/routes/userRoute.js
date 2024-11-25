import { Router } from 'express';
import * as userController from '../controllers/userController.js';

const router = Router();
router.route('/employe')
    .get(userController.getEmploye)

export default router;
