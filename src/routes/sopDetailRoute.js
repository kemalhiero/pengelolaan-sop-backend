import { Router } from 'express';
import * as sopDetailController from '../controllers/sopDetailController.js';

const router = Router();
router.route('/')
    .post(sopDetailController.addSop)
    .get(sopDetailController.getAllSop)

export default router;
