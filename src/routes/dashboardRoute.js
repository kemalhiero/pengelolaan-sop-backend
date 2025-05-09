import { Router } from 'express';
import { verifyToken, authorizeRole } from '../middlewares/auth.js';
import {
    nominalSopEachOrg, sopDistributionByStatus,
    nominalSopEachOrgByStatus, annualSopMakingTrend, nominalUserEachRole,
    nominalFeedbackTopSop, mostRevisedSop, sopOrgDistributionByStatus
} from '../controllers/dashboardController.js';

const router = Router();

router.get('/nominal-sop-each-org', nominalSopEachOrg);
router.get('/sop-dist-by-status', sopDistributionByStatus);

router.get('/most-revised-sop', verifyToken, authorizeRole(['kadep', 'pj']), mostRevisedSop);
router.get('/annual-sop-trend', verifyToken, authorizeRole(['kadep', 'pj']), annualSopMakingTrend);
router.get('/nominal-user-each-role', verifyToken, authorizeRole(['kadep', 'pj']), nominalUserEachRole);
router.get('/sop-org-dist-by-status', verifyToken, authorizeRole(['kadep', 'pj']), sopOrgDistributionByStatus);
router.get('/nominal-feedback-top-sop', verifyToken, authorizeRole(['kadep', 'pj']), nominalFeedbackTopSop);
router.get('/nominal-sop-each-org-by-status', verifyToken, authorizeRole(['kadep', 'pj']), nominalSopEachOrgByStatus);

export default router;
