import { nanoid } from 'nanoid';
import { Op } from 'sequelize';

import modelUser from '../models/users.js';
import modelFeedback from '../models/feedback.js';
import modelRole from '../models/roles.js';
import dateFormat from '../utils/dateFormat.js';

const addDraftFeedback = async (req, res, next) => {
    try {
        const { id_sop_detail, feedback, type } = req.body;
        const newFeedback = await modelFeedback.create({
            id_feedback: nanoid(15),
            id_user: req.user.id_user,
            id_sop_detail,
            feedback,
            type
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
                type: { [Op.ne]: 'umum' }
            },
            attributes: { exclude: ['id_feedback', 'id_sop_detail', 'id_user'] },
            include: {
                model: modelUser,
                attributes: ['name'],
                include: {
                    model: modelRole,
                    attributes: ['role_name'],
                }
            },
            order: [['createdAt', 'ASC']]
        });

        // Format the dates in the feedback data
        const formattedFeedback = feedback.map(item => {
            const plainItem = item.get({ plain: true });
            plainItem.user.role = plainItem.user.role.role_name;
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
