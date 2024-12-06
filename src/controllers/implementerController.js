import modelSopDetail from '../models/sop_details.js';
import modelSopImplementer from '../models/sop_step_implementer.js';
import modelSopDetailImplementer from '../models/sop_detail_implementer.js';

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
            message: 'sukses mendapat data',
            data: implementer,
        });
        
    } catch (error) {
        next(error);
    }
};

const addSopImplementer = async (req, res, next) => {
    try {
        const {id_sop_detail, id_sop_implementer} = req.body;

        const dataImplementer = await modelSopImplementer.findByPk(id_sop_implementer);
        const dataSopDetail = await modelSopDetail.findByPk(id_sop_detail);

        if (!dataImplementer || !dataSopDetail) {
            const error = new Error('Data pelaksana atau sop detail tidak ditemukan');
            error.status = 404;
            throw error;
        };

        await modelSopDetailImplementer.create({
            id_sop_detail, id_sop_implementer
        });

        return res.status(201).json({
            message: 'sukses menambahkan data',
        });
    } catch (error) {
        next(error);
    }
};

export { getImplementer, addSopImplementer }
