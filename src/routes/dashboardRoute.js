import { Router } from 'express';
import { verifyToken } from '../middlewares/auth.js';
import {
    nominalSopEachOrg, sopDistributionByStatus
} from '../controllers/dashboardController.js';

const router = Router();

router.get('/nominal-sop-each-org', nominalSopEachOrg);
router.get('/sop-dist-by-status', sopDistributionByStatus);

export default router;
