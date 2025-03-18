import { Router } from 'express';
import * as feedbackController from '../controllers/feedbackController.js';
import { verifyToken } from '../middlewares/auth.js';

const router = Router();

router.post('/draft', verifyToken, feedbackController.addDraftFeedback);
router.get('/draft/:idsopdetail', feedbackController.getDraftFeedback);

export default router;
