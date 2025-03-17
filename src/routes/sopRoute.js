import { Router } from 'express';
import * as sopController from '../controllers/sopController.js';
import { verifyToken } from '../middlewares/auth.js';

const router = Router();
router.route('/')
    .get(sopController.getAllSop)
    .post(verifyToken, sopController.addSop);

router.get('/latest/sop', sopController.getLatestSopVersion);
router.get('/latest/year', sopController.getLatestSopInYear);

router.route('/detail')
    .get(sopController.getAllSopDetail)
    .post(verifyToken ,sopController.addSopDetail)
    .patch(verifyToken ,sopController.updateSopDetail);

router.get('/version', sopController.getSopVersion);

router.route('/step')
    .get(sopController.getSopStepbySopDetail)
    .post(verifyToken, sopController.addSopStep)
    .patch(verifyToken, sopController.updateSopStep)
    .delete(verifyToken, sopController.deleteSopStep);

router.route('/assignment')
    .get(verifyToken, sopController.getAssignedSop);

router.get('/managed', verifyToken, sopController.getManagedSop);

router.route('/assignment/:id')
    .get(verifyToken, sopController.getAssignedSopDetail);

router.get( '/info/:id', verifyToken,sopController.getSectionandWarning);

router.route('/:id')
    .get(sopController.getSopById);

export default router;
