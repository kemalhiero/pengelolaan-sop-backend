import { Router } from 'express';
import * as sopController from '../controllers/sopController.js';

const router = Router();
router.route('/')
    .get(sopController.getAllSop)
    .post(sopController.addSop);

router.route('/detail')
    .get(sopController.getAllSopDetail)
    .post(sopController.addSopDetail);

router.route('/assignment/:id')
    .get(sopController.getAssignedSopDetail)

router.route('/:id')
    .get(sopController.getSopById);

export default router;
