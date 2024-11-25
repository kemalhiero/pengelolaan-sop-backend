import modelSopDetail from '../models/sop_details.js';
import modelSop from '../models/sop.js';

const addSop = async (req, res, next) => {
    try {
        const { number, description } = req.body;
        const {id_sop} = req.query;

        const sop = await modelSop.findByPk(id_sop);
        if (!sop) {
            const error = new Error('Data sop tidak ditemukan');
            error.status = 404;
            throw error;
        }

        const dataSopDetail = await modelSopDetail.create({
            number, description, id_sop,
            version: 1, is_approved: false, status: 'processing'
        });
        console.log(dataSopDetail.dataValues.id_sop_detail);
        
        return res.status(200).json({
            data: dataSopDetail,
            message: 'sukses menambahkan data',
        });
    } catch (error) {
        next(error);
    }
};

export { addSop };
