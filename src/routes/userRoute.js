import { Router } from 'express';
import * as controller from '../controllers/userController.js';
import { verifyToken } from '../middlewares/auth.js';

const router = Router();

router.get('/', verifyToken, controller.getUserByRole)

router.route('/drafter')
    .get(verifyToken, controller.getAllDrafter)
    .post(verifyToken, controller.addDrafter);

router.post('/drafter/sop', verifyToken, controller.addSopDrafter);
router.get('/drafter/sopdetail/:id', controller.getDrafterByIdDetail);
router.get('/drafter/:id', controller.getDrafterDetail);

router.route('/hod')
    .get( verifyToken, controller.getAllHod)
    .post( verifyToken, controller.addHod);

router.get('/hod/candidate', verifyToken, controller.getHodCandidate);

router.route('/pic')
    .get(verifyToken, controller.getAllPic)
    .post(verifyToken, controller.addPic);

router.get('/pic/candidate', verifyToken, controller.getPicCandidate);
router.get('/pic/unassigned', verifyToken, controller.getUnassignedPic);
router.get('/pic/:id', verifyToken, controller.getPicDetail);

export default router;
