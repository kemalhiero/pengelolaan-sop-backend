import { Router } from 'express';
import * as controller from '../controllers/userController.js';
import { verifyToken } from '../middlewares/auth.js';

const router = Router();

router.get('/', verifyToken, controller.getUserByRole)

router.route('/drafter')
    .get(verifyToken, controller.getAllDrafter)
    .post(verifyToken, controller.addSopDrafter);

router.get('/drafter/sopdetail/:id', controller.getDrafterByIdDetail);

router.post('/hod', verifyToken, controller.addHod);
router.get('/hod/candidate', verifyToken, controller.getHodCandidate);

router.get('/pic', verifyToken, controller.getAllPic);

export default router;
