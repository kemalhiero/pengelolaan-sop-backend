import { Router } from 'express';
import * as sopImplementerController from '../controllers/sopImplementerController.js';

const router = Router();
router.route('/')
    .get(sopImplementerController.getImplementer)

export default router;
