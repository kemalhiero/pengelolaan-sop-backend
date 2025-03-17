import { nanoid } from 'nanoid';
import modelFeedback from '../models/feedback.js';

const addDraftFeedback = async (req, res, next) => {
    try {
        const { id_sop_detail, feedback } = req.body;
        const newFeedback = await modelFeedback.create({
            id_feedback: nanoid(15),
            id_user: req.user.id_user,
            id_sop_detail,
            feedback,
            is_internal: true
        });
        res.status(201).json(newFeedback);
    } catch (error) {
        next(error);
    }
};

export { addDraftFeedback };
