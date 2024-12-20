import { Router } from 'express';
import * as sopController from '../controllers/sopController.js';

const router = Router();
router.route('/')
    .get(sopController.getAllSop)
    .post(sopController.addSop);

router.route('/detail')
    .get(sopController.getAllSopDetail)
    .post(sopController.addSopDetail)
    .patch(sopController.updateSopDetail);

router.route('/step')
    .get(sopController.getSopStepbySopDetail)
    .post(sopController.addSopStep)
    .patch(sopController.updateSopStep)
    .delete(sopController.deleteSopStep);

router.route('/assignment/:id')
    .get(sopController.getAssignedSopDetail);

router.get('/info/:id', sopController.getSectionandWarning);

router.route('/:id')
    .get(sopController.getSopById);

export default router;
