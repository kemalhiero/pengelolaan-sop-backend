import { Router } from 'express';
import * as relatedSopController from '../controllers/relatedSopController.js';

const router = Router();
router.route('/')
    .get(relatedSopController.getRelatedSop)
    .post(relatedSopController.addRelatedSop)
    .delete(relatedSopController.deleteRelatedSop);
    
export default router;
