import { Router } from 'express';
import * as sopController from '../controllers/sopController.js';

const router = Router();
router.route('/')
    .post(sopController.addSop)

export default router;
