import { Router } from 'express';
import * as sopDetailController from '../controllers/sopDetailController.js';

const router = Router();
router.route('/')
    .post(sopDetailController.addSop)

export default router;
