import modelSopDetail from '../models/sop_details.js';
import modelSop from '../models/sop.js';
import modelOrganization from '../models/organization.js';

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

const getAllSop = async (req, res, next) => {
    try {
        const dataSop = await modelSopDetail.findAll({
            attributes: ['number', 'is_approved', 'status', 'version'],
            include: [
                {
                    model: modelSop,
                    attributes: ['name', 'is_active'],
                    include: {
                        model: modelOrganization,
                        attributes: ['org_name']
                    }
                }, 
                
            ] 
        });

        const data = dataSop.map(item => ({
            name: item.sop.name,
            is_active: item.sop.is_active,
            number: item.number,
            version: item.version,
            is_approved: item.is_approved,
            status: item.status,
            org_name: item.sop.organization.org_name,
        }));

        return res.status(200).json({
            message: 'sukses mendapatkan data',
            data
        });
    } catch (error) {
        next(error);
    }
};

export { addSop, getAllSop };
