import { Router } from 'express';
import * as relatedSopController from '../controllers/relatedSopController.js';

const router = Router();
router.route('/')
    .post(relatedSopController.addRelatedSop);
    
export default router;
