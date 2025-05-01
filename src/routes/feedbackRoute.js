import { Router } from 'express';
import { verifyToken } from '../middlewares/auth.js';
import { addDraftFeedback, getDraftFeedback, getGeneralFeedback, getAllFeedback, deleteDraftFeedback } from '../controllers/feedbackController.js';

const router = Router();

router.route('/draft')
    .get(verifyToken, getAllFeedback) // Get all feedback
    .post(verifyToken, addDraftFeedback);

router.route('/draft/:id')
    .get(verifyToken, getDraftFeedback)
    .delete(verifyToken, deleteDraftFeedback);

router.get('/draft/:idsopdetail/general', getGeneralFeedback);

export default router;
