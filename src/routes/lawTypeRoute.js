import { Router } from 'express';
import * as lawTypeController from '../controllers/lawTypeController.js';

const router = Router();
router.route('/')
    .get(lawTypeController.getLawType)
    .post(lawTypeController.addLawType)
    .delete(lawTypeController.deleteLawType)
    .patch(lawTypeController.updateLawType)

export default router;
