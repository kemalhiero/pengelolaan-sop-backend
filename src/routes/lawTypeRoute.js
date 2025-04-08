import { Router } from 'express';
import { verifyToken } from '../middlewares/auth.js';
import { addLawType, deleteLawType, getLawType, updateLawType } from '../controllers/lawTypeController.js';

const router = Router();
router.route('/')
    .get(verifyToken, getLawType)
    .post(verifyToken, addLawType)

router.route('/:id')
    .patch(verifyToken, updateLawType)
    .delete(verifyToken, deleteLawType);

export default router;
