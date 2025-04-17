import { Router } from 'express';
import * as controller from '../controllers/userController.js';
import { verifyToken } from '../middlewares/auth.js';
import multer from 'multer';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get('/', verifyToken, controller.getUserByRole);
router.get('/profile', verifyToken, controller.getUserProfile);

router.route('/profile/photo')
    .post(verifyToken, upload.single('file'), controller.uploadProfilePhoto)
    .delete(verifyToken, controller.deleteProfilePhoto);

router.route('/signature')
    .post(verifyToken, upload.single('file'), controller.uploadSignatureFile)

router.route('/drafter')
    .get(verifyToken, controller.getAllDrafter)
    .post(verifyToken, controller.addDrafter);

router.post('/drafter/sop', verifyToken, controller.addSopDrafter)
router.delete('/drafter/sop/:userId/:sopDetailId', verifyToken, controller.removeSopDrafter);


router.get('/drafter/sopdetail/:id', controller.getDrafterByIdDetail);
router.get('/drafter/:id', controller.getDrafterDetail);

router.route('/hod')
    .patch(verifyToken, controller.updateHod);

router.get('/hod/current', controller.getCurrentHod);
router.get('/hod/candidate', verifyToken, controller.getHodCandidate);

router.route('/pic')
    .get(verifyToken, controller.getAllPic)
    .post(verifyToken, controller.addPic);

router.get('/pic/candidate', verifyToken, controller.getPicCandidate);
router.get('/pic/unassigned', verifyToken, controller.getUnassignedPic);
router.get('/pic/:id', verifyToken, controller.getPicDetail);

export default router;
