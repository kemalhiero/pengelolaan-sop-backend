import { Router } from 'express';
import { verifyToken } from '../middlewares/auth.js';
import { addDraftFeedback, getDraftFeedback } from '../controllers/feedbackController.js';

const router = Router();

router.post('/draft', verifyToken, addDraftFeedback);
router.get('/draft/:idsopdetail', getDraftFeedback);

export default router;
