import modelSopImplementer from '../models/sop_step_implementer.js';

const getImplementer = async (req, res, next) => {
    try {
        const implementer = await modelSopImplementer.findAll({
            attributes: [
                ['id_sop_implementer', 'id'],
                ['implementer_name', 'name'],
                'description'
            ]
        });

        return res.status(200).json({
            message: 'sukes mendapat data',
            data: implementer,
        });
        
    } catch (error) {
        next(error);
    }
}

export {
    getImplementer
}
