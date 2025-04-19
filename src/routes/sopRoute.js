import { Router } from 'express';
import * as sopController from '../controllers/sopController.js';
import { verifyToken } from '../middlewares/auth.js';

const router = Router();
router.route('/')
    .get(sopController.getAllSop)
    .post(verifyToken, sopController.addSop);

router.get('/latest/sop/:id', sopController.getLatestSopVersion);
router.get('/latest/year/:year', sopController.getLatestSopInYear);

router.get('/detail', sopController.getAllSopDetail);
router.route('/detail/:id')
    .post(verifyToken, sopController.addSopDetail)
    .patch(verifyToken, sopController.updateSopDetail)
    .delete(verifyToken, sopController.deleteSopDetail);

router.get('/version/:id', sopController.getSopVersion);

router.post('/step', verifyToken, sopController.addSopStep);

router.route('/step/:id')
    .get(sopController.getSopStepbySopDetail)
    .patch(verifyToken, sopController.updateSopStep)
    .delete(verifyToken, sopController.deleteSopStep);

router.route('/assignment')
    .get(verifyToken, sopController.getAssignedSop);

router.get('/managed', verifyToken, sopController.getManagedSop);
router.patch('/confirm/:id', verifyToken, sopController.confirmSopandBpmn);

router.route('/assignment/:id')
    .get(verifyToken, sopController.getAssignedSopDetail);

router.get('/info/:id', sopController.getSectionandWarning);

router.route('/:id')
    .get(sopController.getSopById)
    .delete(verifyToken, sopController.deleteSop)
    .patch(verifyToken, sopController.updateSop);

export default router;
