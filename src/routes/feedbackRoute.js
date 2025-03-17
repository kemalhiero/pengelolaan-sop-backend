import { Router } from 'express';
import * as feedbackController from '../controllers/feedbackController.js';
import { verifyToken } from '../middlewares/auth.js';

const router = Router();

router.route('/draft')
    .post(verifyToken, feedbackController.addDraftFeedback);

export default router;
