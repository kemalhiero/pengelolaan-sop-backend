import modelSop from '../models/sop.js';
import modelSopDetail from '../models/sop_details.js';
import modelOrganization from '../models/organization.js';
import modelUser from '../models/users.js';

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

const addSopDetail = async (req, res, next) => {
    try {
        const { number, description, version } = req.body;
        const {id_sop} = req.query;

        const sop = await modelSop.findByPk(id_sop);
        if (!sop) {
            const error = new Error('Data sop tidak ditemukan');
            error.status = 404;
            throw error;
        }

        const dataSopDetail = await modelSopDetail.create({
            number, description, id_sop, version, is_approved: false, status: 'processing',
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
        const dataSop = await modelSop.findAll({
            attributes: ['id_sop', 'name', 'is_active', 'creation_date'],
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
                id: item.id_sop,
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

const getAllSopDetail = async (req, res, next) => {
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

const getSopById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const dataSop = await modelSop.findByPk(id, {
            attributes: {exclude: ['id_org']},
            include: [
                {
                    model: modelOrganization,
                    attributes: ['org_name']
                }
            ]
        });

        if (!dataSop) return res.status(404).json({message: 'data tidak ditemukan'});

        const data = {
            id: dataSop.id_sop,
            name: dataSop.name,
            creation_date: dateFormat(dataSop.creation_date),
            is_active: dataSop.is_active,
            organization: dataSop.organization.org_name,
        };

        return res.status(200).json({
            message: 'sukses mendapatkan data',
            data
        });
    } catch (error) {
        next(error);
    }
};

const getAssignedSop = async (req, res, next) => {
    try {
        
    } catch (error) {
        next(error);
    }
};

const getAssignedSopDetail = async (req, res, next) => {      //ambil sop yang belum disetujui
    try {
        const { id } = req.params;

        const dataSop = await modelSop.findByPk(id, {
            attributes: {exclude: ['id_sop', 'id_org', 'is_active']},
            include: [
                {
                    model: modelOrganization,
                    attributes: ['org_name'],
                    include: {
                        model: modelUser,
                        attributes: ['identity_number', 'name']
                    }
                },
                {
                    model: modelSopDetail,
                    attributes: ['number', 'description'],
                    where: { is_approved: false },
                    include: {
                        model: modelUser,
                        attributes: ['identity_number', 'name']
                    }
                }
            ]
        });

        const data = {
            name: dataSop.name,
            creation_date: dateFormat(dataSop.creation_date),
            organization: dataSop.organization.org_name,
            pic_number:  dataSop.organization.user.identity_number,
            pic_name: dataSop.organization.user.name,
            number: dataSop.sop_details[0].number,
            description: dataSop.sop_details[0].description,
            drafter: dataSop.sop_details[0].users.map(item =>{
                return {
                    id_number: item.identity_number,
                    name: item.name
                }
            })
        };

        if (!dataSop) return res.status(404).json({message: 'data tidak ditemukan'});
        
        return res.status(200).json({
            message: 'sukses mendapatkan data',
            data
        });

    } catch (error) {
        next(error);
    }
};

export { addSop, addSopDetail, getAllSop, getAllSopDetail, getSopById, getAssignedSopDetail };
