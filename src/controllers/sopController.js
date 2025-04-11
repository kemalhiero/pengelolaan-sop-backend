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
        if (!id_org || !name) return res.status(404).json({ message: 'pastikan data tidak kosong!' });

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
        const { id } = req.params;
        if (!id) return res.status(404).json({ message: 'atribut id masih kosong!' });

        const { number, description, version, signer } = req.body;
        if (!number || !description || !version) return res.status(404).json({ message: 'pastikan data tidak kosong!' });

        const sop = await modelSop.findByPk(id, { attributes: ['id_sop'] });
        if (!sop) return res.status(404).json({ message: 'sop tidak ditemukan!' });

        const dataSopDetail = await modelSopDetail.create({
            number, description, id_sop: id, version,
            status: 2, signer
        });

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
                //     attributes: ['number', 'status', 'version']
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

const deleteSop = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (isNaN(Number(id))) {
            console.error('ID harus berupa angka')
            return res.status(400).json({ message: 'ID harus berupa angka' })
        };

        const deletedCount = await modelSop.destroy({ where: { id_sop: id } });
        if (deletedCount === 0) {
            console.error('Data tidak ditemukan');
            return res.status(404).json({ message: 'Data tidak ditemukan' });
        }

        return res.status(200).json({ message: 'sukses menghapus data' });
    } catch (error) {
        next(error);
    }
};

const updateSop = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { id_org, name, is_active } = req.body;

        if (!id) return res.status(404).json({ message: 'atribut id masih kosong!' });
        if (isNaN(Number(id))) {
            console.error('ID harus berupa angka')
            return res.status(400).json({ message: 'ID harus berupa angka' })
        };

        const data = await modelSop.update({ id_org, name, is_active }, { where: { id_sop: id } });
        if (data[0] === 0) {
            console.error('Data tidak ditemukan');
            return res.status(404).json({ message: 'Data tidak ditemukan' });
        }

        return res.status(200).json({
            message: 'sukses memperbarui data',
            data
        });
    } catch (error) {
        next(error);
    }
};

const getAllSopDetail = async (req, res, next) => {    // ambil semua data tabel sop-detail
    try {
        const dataSop = await modelSopDetail.findAll({
            attributes: ['number', 'status', 'version'],
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
                    attributes: [['id_org', 'id'], 'name']
                }
            ]
        });

        if (!dataSop) return res.status(404).json({ message: 'data tidak ditemukan!' });

        const dataSopDetail = await modelSopDetail.findAll({
            where: { id_sop: id },
            attributes: [
                ['id_sop_detail', 'id'],
                'number', 'version', 'effective_date',
                'status', 'warning', 'section',
                'description', 'updatedAt'
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
            revision_date: dateFormat(detail.updatedAt),
            effective_date: dateFormat(detail.effective_date)
        }));

        const data = {
            id: dataSop.id_sop,
            name: dataSop.name,
            creation_date: dateFormat(dataSop.createdAt),
            is_active: dataSop.is_active,
            organization: dataSop.organization,
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

const getSopVersion = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!id) return res.status(404).json({ message: 'atribut id masih kosong!' });

        const dataSopDetail = await modelSopDetail.findByPk(id, {
            attributes: [
                ['id_sop_detail', 'id'],
                'number', 'version', 'effective_date',
                'status', 'warning', 'section',
                'description', 'updatedAt'
            ],
            include: [
                {
                    model: modelUser,
                    attributes: [['id_user', 'id'], 'identity_number', 'name'],
                    through: { attributes: [] }
                },
                {
                    model: modelSop,
                    attributes: ['id_sop', 'name', 'is_active'],
                    include: {
                        model: modelOrganization,
                        attributes: [['id_org', 'id'], 'name']
                    }
                }

            ]
        });
        if (!dataSopDetail) return res.status(404).json({ message: 'data tidak ditemukan!' });

        // Transform data untuk menghapus struktur nested yang tidak diinginkan
        const transformedSopDetail = {
            ...dataSopDetail.get({ plain: true }),
            revision_date: dateFormat(dataSopDetail.updatedAt),
            effective_date: dateFormat(dataSopDetail.effective_date),
            name: dataSopDetail.sop.name,
            id_sop: dataSopDetail.sop.id_sop,
            is_active: dataSopDetail.sop.is_active,
            organization: dataSopDetail.sop.organization
        };

        // Remove nested sop object since we've flattened it
        delete transformedSopDetail.sop;

        return res.status(200).json({
            message: 'sukses mendapatkan data',
            data: transformedSopDetail
        });

    } catch (error) {
        next(error);
    }
};

const getLatestSopVersion = async (req, res, next) => {
    try {
        const { id } = req.params;

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
        const { year } = req.params;

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
                message: `Tahun harus berada dalam rentang 2010-${currentYear}`
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
            attributes: ['id_sop_detail', 'number', 'status', 'version'],
            include: [
                {
                    model: modelSop,
                    attributes: ['name', 'is_active', 'createdAt'],
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
                id: item.id_sop_detail,
                name: item.sop.name,
                // is_active: item.sop.is_active,
                number: item.number,                 //ntar aktifin lagi kalau perlu
                // version: item.version,
                creation_date: formattedCreationDate,
                status: item.status,
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

        const dataSop = await modelSopDetail.findByPk(id, {
            attributes: [
                'number', 'description',
                'effective_date', 'createdAt', 'updatedAt',
            ],
            include: [
                {
                    model: modelSop,
                    attributes: ['name'],
                    include: {
                        model: modelOrganization,
                        attributes: ['name'],
                        include: {
                            model: modelUser,
                            attributes: ['identity_number', 'name'],
                            include: {
                                model: modelRole,
                                attributes: ['role_name'],
                            },
                        }
                    }
                },
                {
                    model: modelUser,
                    attributes: ['identity_number', 'name'],
                    through: { attributes: [] }
                }
            ]
        });
        if (!dataSop) return res.status(404).json({ message: 'data tidak ditemukan!' });

        // Transform data untuk menghapus struktur nested yang tidak diinginkan
        const data = {
            name: dataSop.sop.name,
            creation_date: dateFormat(dataSop.createdAt),
            last_update_date: dateFormat(dataSop.updatedAt),
            organization: dataSop.sop.organization.name,
            pic: dataSop.sop.organization.users.map(item => {
                return {
                    id_number: item.identity_number,
                    name: item.name,
                    role: item.role.role_name,
                }
            }),
            number: dataSop.number,
            description: dataSop.description,
            drafter: dataSop.users.map(item => {
                return {
                    id_number: item.identity_number,
                    name: item.name
                }
            }),
        };

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
        const { id } = req.params;
        const updateData = req.body;    // semua atribut yang ada di tabel sop detail

        // Filter hanya field yang ada di request body
        const data_baru = Object.keys(updateData).reduce((acc, key) => {
            if (updateData[key] !== undefined) {
                acc[key] = updateData[key];
            }
            return acc;
        }, {});

        const data = await modelSopDetail.update(data_baru, { where: { id_sop_detail: id } });

        return res.status(200).json({
            message: 'sukses memperbarui data',
            data
        });

    } catch (error) {
        next(error);
    }
};

const deleteSopDetail = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (isNaN(Number(id))) {
            console.error('ID harus berupa angka')
            return res.status(400).json({ message: 'ID harus berupa angka' })
        };

        const deletedCount = await modelSopDetail.destroy({ where: { id_sop_detail: id } });
        if (deletedCount === 0) {
            console.error('Data tidak ditemukan');
            return res.status(404).json({ message: 'Data tidak ditemukan' });
        }

        return res.status(200).json({ message: 'sukses menghapus data' });

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
        const { id } = req.params;
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
        const { id } = req.params;
        const updateData = req.body;
        const dataSopStep = await modelSopStep.findByPk(id);
        if (!dataSopStep) return res.status(404).json({ message: 'Data tahapan sop tidak ditemukan' });

        const data_baru = Object.keys(updateData).reduce((acc, key) => {
            if (updateData[key] !== undefined) {
                acc[key] = updateData[key];
            }
            return acc;
        }, {});

        // Check if type is being changed from 'decision' to something else
        if (dataSopStep.type === 'decision' && updateData.type && updateData.type !== 'decision') {
            data_baru.id_next_step_if_no = null; // Reset id_next_step to null
            data_baru.id_next_step_if_yes = null;
        }

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
        const { id } = req.params;
        if (isNaN(Number(id))) {
            console.error('ID harus berupa angka')
            return res.status(400).json({ message: 'ID harus berupa angka' })
        };

        const deletedCount = await modelSopStep.destroy({ where: { id_step: id } });
        if (deletedCount === 0) {
            console.error('Data tidak ditemukan');
            return res.status(404).json({ message: 'Data tidak ditemukan' });
        }

        return res.status(200).json({ message: 'sukses menghapus data' });

    } catch (error) {
        next(error);
    }
};

export {
    addSop, getAllSop, getSopById, getAssignedSop, getManagedSop, deleteSop, updateSop, getSopVersion,
    addSopDetail, getAllSopDetail, updateSopDetail, deleteSopDetail, getSectionandWarning, getLatestSopVersion, getLatestSopInYear,
    getAssignedSopDetail,
    addSopStep, getSopStepbySopDetail, updateSopStep, deleteSopStep
};
