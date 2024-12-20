import { Router } from 'express';
import * as userController from '../controllers/userController.js';

const router = Router();
router.route('/drafter')
    .get(userController.getDrafter)

export default router;
