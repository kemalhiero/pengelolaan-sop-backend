import { Router } from 'express';
import { authorizeRole, verifyToken } from '../middlewares/auth.js';
import { addDraftFeedback, getDraftFeedback, getGeneralFeedback, getAllFeedback, deleteDraftFeedback } from '../controllers/feedbackController.js';

const router = Router();

router.route('/draft')
    .get(verifyToken, authorizeRole(['kadep', 'pj']), getAllFeedback) // Get all general feedback
    .post(verifyToken, addDraftFeedback);

router.route('/draft/:id')
    .get(verifyToken, getDraftFeedback)
    .delete(verifyToken, deleteDraftFeedback);

router.get('/draft/:idsopdetail/general', getGeneralFeedback);

export default router;
