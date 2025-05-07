import { Router } from 'express';
import { verifyToken } from '../middlewares/auth.js';
import {
    nominalSopEachOrg, sopDistributionByStatus,
    nominalSopEachOrgByStatus, annualSopMakingTrend, nominalUserEachRole,
    nominalFeedbackTopSop, mostRevisedSop
} from '../controllers/dashboardController.js';

const router = Router();

router.get('/nominal-sop-each-org', nominalSopEachOrg);
router.get('/sop-dist-by-status', sopDistributionByStatus);

router.get('/most-revised-sop', verifyToken, mostRevisedSop);
router.get('/annual-sop-trend', verifyToken, annualSopMakingTrend);
router.get('/nominal-user-each-role', verifyToken, nominalUserEachRole);
router.get('/nominal-feedback-top-sop', verifyToken, nominalFeedbackTopSop);
router.get('/nominal-sop-each-org-by-status', verifyToken, nominalSopEachOrgByStatus);

export default router;
