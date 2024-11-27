import modelSop from '../models/sop.js';
import modelSopDetail from '../models/sop_details.js';
import modelOrganization from '../models/organization.js';

import dateFormat from '../utils/dateFormat.js';

const addSop = async (req, res, next) => {
    try {
        const { id_org, name } = req.body;

        const data = await modelSop.create({
            id_org, name, is_active : 2
        });

        return res.status(200).json({
            data,
            message: 'sukses menambahkan data'
        });

    } catch (error) {
        next(error);
    }
};

const getAllSop = async (req, res, next) => {
    try {
        const dataSop = await modelSop.findAll({
            attributes: ['name', 'is_active', 'creation_date'],
            include: [
                // {
                //     model: modelSopDetail,
                //     attributes: ['number', 'is_approved', 'status', 'version']
                // }, 
                {
                    model: modelOrganization,
                    attributes: ['org_name']
                }
            ] 
        });

        const data = dataSop.map(item => {
            const formattedCreationDate = dateFormat(item.creation_date)

            return {
                name: item.name,
                is_active: item.is_active,
                creation_date: formattedCreationDate, // Gunakan tanggal yang sudah diformat
                org_name: item.organization.org_name,
            };
        });

        return res.status(200).json({
            message: 'sukses mendapatkan data',
            data
        });
    } catch (error) {
        next(error);
    }
};

export { addSop, getAllSop };
