import { nanoid } from 'nanoid';
import { Op } from 'sequelize';

import modelUser from '../models/users.js';
import modelFeedback from '../models/feedback.js';
import modelRole from '../models/roles.js';
import modelSopDetail from '../models/sop_details.js';
import modelSop from '../models/sop.js';
import dateFormat from '../utils/dateFormat.js';
import { validateUUID } from '../utils/validation.js';

const addDraftFeedback = async (req, res, next) => {
    try {
        const { id_sop_detail, feedback, type } = req.body;
        const newFeedback = await modelFeedback.create({
            id: nanoid(15),
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
        const { id } = req.params;  // Assuming id is the sop_detail id
        if (!validateUUID(id)) {
            console.error('ID harus berupa UUID')
            return res.status(400).json({ message: 'ID harus berupa UUID' })
        }

        const feedback = await modelFeedback.findAll({
            where: {
                id_sop_detail: id,
                type: { [Op.ne]: 'umum' }
            },
            attributes: { exclude: ['id_sop_detail', 'id_user'] },
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

const getGeneralFeedback = async (req, res, next) => {
    try {
        const { idsopdetail } = req.params;
        const feedback = await modelFeedback.findAll({
            where: {
                id_sop_detail: idsopdetail,
                type: 'umum'
            },
            attributes: { exclude: ['id_sop_detail', 'id_user'] },
            include: {
                model: modelUser,
                attributes: [['identity_number', 'id_number'], 'name'],
                include: {
                    model: modelRole,
                    attributes: ['role_name'],
                }
            },
            order: [['createdAt', 'DESC']]
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

const getAllFeedback = async (req, res, next) => {
    try {
        const where = req.user.role === 'pj' ? { id_org: req.user.id_org_pic } : {};
        const feedback = await modelFeedback.findAll({
            where: {
                type: 'umum'
            },
            attributes: { exclude: ['id_sop_detail', 'id_user'] },
            include: [
                {
                    model: modelUser,
                    attributes: [['identity_number', 'id_number'], 'name'],
                    include: {
                        model: modelRole,
                        attributes: ['role_name'],
                    }
                },
                {
                    model: modelSopDetail,
                    attributes: ['id_sop_detail'],
                    required: true,
                    include: {
                        model: modelSop,
                        attributes: ['id_org', 'name'],
                        where
                    }
                }
            ],
            order: [['createdAt', 'DESC']]
        });

        // Format the dates in the feedback data
        const formattedFeedback = feedback.map(item => {
            const plainItem = item.get({ plain: true });
            plainItem.user_role = plainItem.user.role.role_name;
            plainItem.user_id_number = plainItem.user.id_number;
            plainItem.user_name = plainItem.user.name;
            plainItem.sop_name = plainItem.sop_detail.sop.name;
            delete plainItem.sop_detail;
            delete plainItem.user;
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

const deleteDraftFeedback = async (req, res, next) => {
    try {
        const { id } = req.params;
        const feedback = await modelFeedback.destroy({
            where: {
                id,
                // id_user: req.user.id_user
            }
        });
        if (!feedback) {
            return res.status(404).json({ message: 'Feedback not found' });
        }
        res.status(200).json({ message: 'Feedback deleted successfully' });
    } catch (error) {
        next(error);
    }
};

export { addDraftFeedback, getDraftFeedback, getGeneralFeedback, getAllFeedback, deleteDraftFeedback };
