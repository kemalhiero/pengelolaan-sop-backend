import { Router } from 'express';
import * as lawTypeController from '../controllers/lawTypeController.js';
import { verifyToken } from '../middlewares/auth.js';

const router = Router();
router.route('/')
    .get(verifyToken ,lawTypeController.getLawType)
    .post(verifyToken ,lawTypeController.addLawType)
    .delete(verifyToken ,lawTypeController.deleteLawType)
    .patch(verifyToken ,lawTypeController.updateLawType)

export default router;
