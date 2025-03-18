import { nanoid } from 'nanoid';
import modelUser from '../models/users.js';
import modelFeedback from '../models/feedback.js';
import dateFormat from '../utils/dateFormat.js';

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

const getDraftFeedback = async (req, res, next) => {
    try {
        const { idsopdetail } = req.params;
        const feedback = await modelFeedback.findAll({
            where: {
                id_sop_detail: idsopdetail,
                is_internal: true
            },
            attributes: { exclude: ['id_feedback', 'id_sop_detail', 'id_user'] },
            include: {
                model: modelUser,
                attributes: ['name', 'email', 'photo'],
            },
            order: [['createdAt', 'DESC']]
        });
        
        // Format the dates in the feedback data
        const formattedFeedback = feedback.map(item => {
            const plainItem = item.get({ plain: true });
            return {
                ...plainItem,
                createdAt: dateFormat(plainItem.createdAt),
                updatedAt: dateFormat(plainItem.updatedAt)
            };
        });
        
        res.status(200).json({
            message: 'sukses mengambil data',
            data: formattedFeedback
        });
    } catch (error) {
        next(error);
    }
};

export { addDraftFeedback, getDraftFeedback };
