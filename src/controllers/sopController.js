import modelSop from '../models/sop.js';
import modelRole from '../models/roles.js';
import modelUser from '../models/users.js';
import modelSopStep from '../models/sop_step.js'
import modelSopDetail from '../models/sop_details.js';
import modelOrganization from '../models/organization.js';

import { nanoid } from 'nanoid';
import { literal } from 'sequelize';
import dateFormat from '../utils/dateFormat.js';

const currentYear = new Date().getFullYear();

const addSop = async (req, res, next) => {
    try {
        const { id_org, name } = req.body;

        const data = await modelSop.create({
            id_org, name, is_active: 2
        });

        return res.status(201).json({
            message: 'sukses menambahkan data',
            data,
        });
    } catch (error) {
        next(error);
    }
};

const addSopDetail = async (req, res, next) => {
    try {
        const { number, description, version, pic_position } = req.body;
        const { id } = req.query;

        const sop = await modelSop.findByPk(id);
        if (!sop) {
            const error = new Error('Data sop tidak ditemukan');
            error.status = 404;
            throw error;
        };

        const dataSopDetail = await modelSopDetail.create({
            number, description, id_sop: id, version,
            is_approved: 2, status: 2,
            revision_date: new Date(), pic_position
        });
        console.log(dataSopDetail.dataValues.id_sop_detail);

        return res.status(201).json({
            message: 'sukses menambahkan data',
            data: dataSopDetail,
        });
    } catch (error) {
        next(error);
    }
};

const getAllSop = async (req, res, next) => {       //ambil semua sop
    try {
        const dataSop = await modelSop.findAll({
            attributes: ['id_sop', 'name', 'is_active', 'createdAt'],
            include: [
                // {
                //     model: modelSopDetail,
                //     attributes: ['number', 'is_approved', 'status', 'version']
                // }, 
                {
                    model: modelOrganization,
                    attributes: ['name']
                }
            ]
        });

        const data = dataSop.map(item => {
            const formattedCreationDate = dateFormat(item.createdAt)

            return {
                id: item.id_sop,
                name: item.name,
                is_active: item.is_active,
                creation_date: formattedCreationDate, // Gunakan tanggal yang sudah diformat
                org_name: item.organization.name,
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

const getManagedSop = async (req, res, next) => {       //ambil semua sop
    try {
        let dataSop;
        if (req.user.dataValues.role == 'kadep') {
            dataSop = await modelSop.findAll({
                attributes: ['id_sop', 'name', 'is_active', 'createdAt'],
                include: [
                    {
                        model: modelOrganization,
                        attributes: ['name']
                    }
                ]
            });
        } else if (req.user.dataValues.role == 'pj') {
            dataSop = await modelSop.findAll({
                attributes: ['id_sop', 'name', 'is_active', 'createdAt'],
                include: [
                    {
                        model: modelOrganization,
                        attributes: ['name'],
                        required: true,
                        include: {
                            model: modelUser,
                            where: {
                                id_user: req.user.id_user
                            },
                            attributes: [],
                        }
                    },
                ]
            });
        };


        const data = dataSop?.map(item => {
            const formattedCreationDate = dateFormat(item.createdAt)
            return {
                id: item.id_sop,
                name: item.name,
                is_active: item.is_active,
                creation_date: formattedCreationDate, // Gunakan tanggal yang sudah diformat
                org_name: item.organization?.name,
            };
        }) || [];

        return res.status(200).json({
            message: 'sukses mendapatkan data',
            data
        });
    } catch (error) {
        next(error);
    }
};

const getAllSopDetail = async (req, res, next) => {    // ambil semua data tabel sop-detail
    try {
        const dataSop = await modelSopDetail.findAll({
            attributes: ['number', 'is_approved', 'status', 'version'],
            include: [
                {
                    model: modelSop,
                    attributes: ['name', 'is_active'],
                    include: {
                        model: modelOrganization,
                        attributes: ['name']
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
            name: item.sop.organization.name,
        }));

        return res.status(200).json({
            message: 'sukses mendapatkan data',
            data
        });
    } catch (error) {
        next(error);
    }
};

const getSopById = async (req, res, next) => {          //untuk ambil sop beserta detail-detailnya (versinya) berdasarkan id
    try {
        const { id } = req.params;
        if (!id) return res.status(404).json({ message: 'atribut id masih kosong!' });

        const dataSop = await modelSop.findByPk(id, {
            attributes: { exclude: ['id_org'] },
            include: [
                {
                    model: modelOrganization,
                    attributes: ['name']
                }
            ]
        });

        if (!dataSop) return res.status(404).json({ message: 'data tidak ditemukan!' });

        const dataSopDetail = await modelSopDetail.findAll({
            where: { id_sop: id },
            attributes: [
                ['id_sop_detail', 'id'],
                'number', 'version', 'revision_date', 'effective_date',
                'is_approved', 'status', 'warning', 'section',
                'description', 'pic_position'
            ],
            include: {
                model: modelUser,
                attributes: ['identity_number', 'name'],
                through: { attributes: [] }
            }
        });
        // Transform data untuk menghapus struktur nested yang tidak diinginkan
        const transformedSopDetail = dataSopDetail.map(detail => ({
            ...detail.get({ plain: true }),
            revision_date: dateFormat(detail.revision_date),
            effective_date: dateFormat(detail.effective_date)
        }));

        const data = {
            id: dataSop.id_sop,
            name: dataSop.name,
            creation_date: dateFormat(dataSop.createdAt),
            is_active: dataSop.is_active,
            organization: dataSop.organization.name,
            version: transformedSopDetail
        };

        return res.status(200).json({
            message: 'sukses mendapatkan data',
            data
        });
    } catch (error) {
        next(error);
    }
};

const getLatestSopVersion = async (req, res, next) => {
    try {
        const { id } = req.query;

        const latestSop = await modelSopDetail.findOne({
            order: [['version', 'DESC']],
            limit: 1,
            where: { id_sop: id },
            attributes: ['number', 'version'],
            // include: {
            //     model: modelUser,
            //     attributes: ['id_user', 'identity_number', 'name'],
            //     through: {attributes:[]}
            // }
        });

        return res.status(200).json({
            message: 'sukses mendapatkan data',
            data: latestSop
        });
    } catch (error) {
        next(error);
    }
};

const getLatestSopInYear = async (req, res, next) => {
    try {
        const { year } = req.query;

        // Validasi tahun
        const yearNumber = parseInt(year);
        if (isNaN(yearNumber) || yearNumber.toString().length !== 4) {
            return res.status(400).json({
                message: 'Format tahun tidak valid. Masukkan tahun dalam format YYYY (contoh: 2024)'
            });
        }

        // Validasi rentang tahun yang masuk akal (misalnya 1900-2100)
        if (yearNumber < 2010 || yearNumber > currentYear) {
            return res.status(400).json({
                message: `Tahun harus berada dalam rentang 1900-${currentYear}`
            });
        }

        const latestSop = await modelSopDetail.findOne({
            where: literal(`YEAR(createdAt) = ${year}`),
            order: [['createdAt', 'DESC']],
            attributes: ['number', 'version']
        });
        if (!latestSop) return res.status(404).json({ message: 'data tidak ditemukan' })

        return res.status(200).json({
            message: 'sukses mendapatkan data',
            data: latestSop
        });

    } catch (error) {
        next(error);
    }
};

// TODO tambahkan filter berdasarkan penyusun yang sedang login saat ini
const getAssignedSop = async (req, res, next) => {
    try {
        const dataSop = await modelSopDetail.findAll({
            attributes: ['number', 'is_approved', 'status', 'version'],
            include: [
                {
                    model: modelSop,
                    attributes: ['id_sop', 'name', 'is_active', 'createdAt'],
                    include: {
                        model: modelOrganization,
                        attributes: ['name']
                    }
                },
                {
                    model: modelUser,
                    attributes: ['identity_number', 'name'],
                    where: { email: req.user.email },
                    through: { attributes: [] }
                }
            ]
        });

        const data = dataSop.map(item => {
            const formattedCreationDate = dateFormat(item.sop.createdAt);

            return {
                id: item.sop.id_sop,
                name: item.sop.name,
                // is_active: item.sop.is_active,
                number: item.number,                 //ntar aktifin lagi kalau perlu
                // version: item.version,
                is_approved: item.is_approved,
                creation_date: formattedCreationDate,
                // status: item.status,
                org_name: item.sop.organization.name,
                // user: item.users
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

const getAssignedSopDetail = async (req, res, next) => {      //ambil sop yang belum disetujui
    try {
        const { id } = req.params;
        if (!id) return res.status(404).json({ message: 'atribut id masih kosong!' });

        const dataSop = await modelSop.findByPk(id, {
            attributes: { exclude: ['id_org', 'is_active'] },
            include: [
                {
                    model: modelOrganization,
                    attributes: ['name'],
                    include: {
                        model: modelUser,
                        attributes: ['identity_number', 'name'],
                        include: {
                            model: modelRole,
                            attributes: ['role_name']
                        },
                    }
                },
                {
                    model: modelSopDetail,
                    attributes: ['id_sop_detail', 'number', 'description'],
                    where: { is_approved: 2 },
                    include: {
                        model: modelUser,
                        attributes: ['identity_number', 'name'],
                        through: { attributes: [] }
                    }
                }
            ]
        });

        const data = {
            id: dataSop.id_sop,
            name: dataSop.name,
            creation_date: dateFormat(dataSop.createdAt),
            last_update_date: dateFormat(dataSop.updatedAt),
            organization: dataSop.organization.name,
            pic: dataSop.organization.users.map(item => {
                return {
                    id_number: item.identity_number,
                    name: item.name,
                    role: item.role.role_name,
                }
            }),
            number: dataSop.sop_details[0].number,
            description: dataSop.sop_details[0].description,
            drafter: dataSop.sop_details[0].users.map(item => {
                return {
                    id_number: item.identity_number,
                    name: item.name
                }
            }),
            id_sop_detail: dataSop.sop_details[0].id_sop_detail
        };

        if (!dataSop) return res.status(204).json({ message: 'data kosong!' });

        return res.status(200).json({
            message: 'sukses mendapatkan data',
            data
        });

    } catch (error) {
        next(error);
    }
};

const updateSopDetail = async (req, res, next) => {
    try {
        const { id } = req.query;
        const updateData = req.body;    // jadinya harus sama input yang ada sama penulisan atribut di model sop detail

        const [sop, sopDetail] = await Promise.all([
            modelSop.findByPk(id),
            modelSopDetail.findOne({ where: { id_sop: id } })
        ]);

        if (!sop || !sopDetail) {
            const error = new Error('Data sop tidak ditemukan');
            error.status = 404;
            throw error;
        }

        // Filter hanya field yang ada di request body
        const data_baru = Object.keys(updateData).reduce((acc, key) => {
            if (updateData[key] !== undefined) {
                acc[key] = updateData[key];
            }
            return acc;
        }, {});
        data_baru.revision_date = new Date()

        const data = await sopDetail.update(data_baru);

        return res.status(200).json({
            message: 'sukses memperbarui data',
            data
        });
    } catch (error) {
        next(error);
    }
};

const getSectionandWarning = async (req, res, next) => {
    try {
        const { id } = req.params;
        const dataSopDetail = await modelSopDetail.findByPk(id, {
            attributes: ['warning', 'section']
        });

        if (!dataSopDetail) {
            const error = new Error('Data sop tidak ditemukan');
            error.status = 404;
            throw error;
        };

        return res.status(200).json({
            message: 'sukses mendapatkan data',
            data: dataSopDetail
        });
    } catch (error) {
        next(error);
    }
};

const addSopStep = async (req, res, next) => {
    try {
        const { id_sop_detail, seq_number, name, type, id_implementer, fittings, time, time_unit, output, description } = req.body;

        await modelSopStep.create({
            id_step: nanoid(10),
            id_sop_detail, seq_number, name, type, id_implementer, fittings, time, time_unit, output, description
        });

        return res.status(200).json({
            message: 'sukses menambahkan data',
        });
    } catch (error) {
        next(error);
    }
};

const getSopStepbySopDetail = async (req, res, next) => {
    try {
        const { id } = req.query;
        const dataSopDetail = await modelSopDetail.findByPk(id, {
            attributes: [['id_sop_detail', 'id']]
        });

        if (!dataSopDetail) return res.status(404).json({ message: 'Data sop detail tidak ditemukan' });

        const dataStep = await modelSopStep.findAll({
            where: {
                id_sop_detail: id
            },
            attributes: { exclude: ['id_sop_detail'] }
        });

        return res.status(200).json({
            message: 'sukses mendapatkan data',
            data: dataStep
        });
    } catch (error) {
        next(error);
    }
};

const updateSopStep = async (req, res, next) => {
    try {
        const { id } = req.query;
        const updateData = req.body;
        const dataSopStep = await modelSopStep.findByPk(id);
        if (!dataSopStep) return res.status(404).json({ message: 'Data tahapan sop tidak ditemukan' });

        const data_baru = Object.keys(updateData).reduce((acc, key) => {
            if (updateData[key] !== undefined) {
                acc[key] = updateData[key];
            }
            return acc;
        }, {});

        await dataSopStep.update(data_baru);

        return res.status(200).json({
            message: 'sukses memperbarui data',
        });

    } catch (error) {
        next(error);
    }
};

const deleteSopStep = async (req, res, next) => {
    try {
        const { id } = req.query;
        const dataSopStep = await modelSopStep.findByPk(id);
        if (!dataSopStep) return res.status(404).json({ message: 'Data tahapan sop tidak ditemukan' });

        await dataSopStep.destroy();

        return res.status(200).json({
            message: 'sukses menghapus data',
        });
    } catch (error) {
        next(error);
    }
};

export {
    addSop, getAllSop, getSopById, getAssignedSop, getManagedSop,
    addSopDetail, getAllSopDetail, updateSopDetail, getSectionandWarning, getLatestSopVersion, getLatestSopInYear,
    getAssignedSopDetail,
    addSopStep, getSopStepbySopDetail, updateSopStep, deleteSopStep
};
