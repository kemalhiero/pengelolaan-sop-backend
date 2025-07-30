import { nanoid } from 'nanoid';
import { literal, Op } from 'sequelize'; // Tambahkan Op di sini
import dateFormat from '../utils/dateFormat.js';

import modelSop from '../models/sop.js';
import modelRole from '../models/roles.js';
import modelUser from '../models/users.js';
import modelSopStep from '../models/sop_step.js'
import modelSopDetail from '../models/sop_details.js';
import modelOrganization from '../models/organization.js';
import modelSopDisplayConfig from '../models/sop_display_config.js';
import { validateUUID } from '../utils/validation.js';
import { general, department, laboratory } from '../utils/letterCode.js';

const currentYear = new Date().getFullYear();

const addSop = async (req, res, next) => {
    try {
        const { id_org, name } = req.body;
        if (id_org === undefined || id_org === null || !name) {
            return res.status(404).json({ message: 'pastikan data tidak kosong!' });
        }

        const existingSop = await modelSop.findOne({
            where: {
                id_org,
                // Bandingkan lower-case agar benar-benar beda, tidak hanya beda huruf besar/kecil
                [Op.and]: [
                    literal(`LOWER(name) = LOWER('${name.replace(/'/g, "''")}')`)
                ]
            }
        });

        if (existingSop) {
            return res.status(409).json({ message: 'Nama SOP sudah digunakan di organisasi ini, gunakan nama lain!' });
        }

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

        const { number, description, version } = req.body;
        if (!number || !description || !version) return res.status(404).json({ message: 'pastikan data tidak kosong!' });

        const sop = await modelSop.findByPk(id, { attributes: ['id_sop', 'id_org'] });
        if (!sop) return res.status(404).json({ message: 'sop tidak ditemukan!' });

        // Cek apakah nomor sudah ada untuk SOP ini
        const existingSopDetail = await modelSopDetail.findOne({
            where: { number },
            attributes: ['id_sop_detail']
        });
        if (existingSopDetail) return res.status(409).json({ message: 'Nomor SOP sudah digunakan, ganti dengan nomor lain!' });

        const signer = await modelUser.findOne({
            where: {
                id_org_pic: sop.dataValues.id_org
            },
            include: [{
                model: modelRole,
                where: {
                    role_name: {
                        [Op.in]: ['pj', 'kadep']
                    }
                },
                attributes: ['role_name']
            }],
            attributes: ['id_user']
        });

        const dataSopDetail = await modelSopDetail.create({
            number, description, id_sop: id, version, status: 2,
            signer_id: signer ? signer.dataValues.id_user : null,
            pic_position: signer ? signer.dataValues.role.role_name : null
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
            attributes: ['name', 'is_active', 'createdAt'],
            include: [
                {
                    model: modelSopDetail,
                    attributes: ['id_sop_detail'],
                    where: { status: 1 }, // Ambil hanya SOP yang sudah disetujui
                    required: true, // Pastikan bahwa hanya SOP dengan detail yang sesuai yang diambil
                },
                {
                    model: modelOrganization,
                    attributes: ['name']
                }
            ]
        });

        const data = dataSop.map(item => ({
            id: item.sop_details[0].id_sop_detail, // Ambil id dari detail sop pertama
            name: item.name,
            is_active: item.is_active,
            creation_date: dateFormat(item.createdAt), // Gunakan tanggal yang sudah diformat
            org_name: item.organization.name,
        }));

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
        if (req.user.role == 'kadep') {
            dataSop = await modelSop.findAll({
                attributes: ['id_sop', 'name', 'is_active', 'createdAt'],
                include: [
                    {
                        model: modelOrganization,
                        attributes: ['name']
                    }
                ]
            });
        } else if (req.user.role == 'pj') {
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


        const data = dataSop?.map(item => ({
            id: item.id_sop,
            name: item.name,
            is_active: item.is_active,
            creation_date: dateFormat(item.createdAt), // Gunakan tanggal yang sudah diformat
            org_name: item.organization?.name,
        })) || [];

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
            org_name: item.sop.organization.name,
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
                'description', 'pic_position', 'signer_id', 'signature_url', 'createdAt', 'updatedAt'
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
            creation_date: dateFormat(dataSopDetail.createdAt),
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

        let latestSop = await modelSopDetail.findOne({
            where: literal(`YEAR(sop_details.createdAt) = ${year}`),
            order: [['createdAt', 'DESC']],
            attributes: ['number', 'version'],
            include: {
                model: modelSop,
                attributes: ['id_org'],
            }
        });

        if (!latestSop) {
            // Tentukan letterCode berdasarkan id_org
            let letterCodeValue;
            if (latestSop?.sop?.id_org === 0) {
                letterCodeValue = department;
            } else if (latestSop?.sop?.id_org > 0) {
                letterCodeValue = laboratory;
            } else {
                letterCodeValue = general;
            }
            latestSop = {
                number: `T/000/${letterCodeValue}/${yearNumber}`,
                version: 0
            };
        }

        return res.status(200).json({
            message: 'sukses mendapatkan data',
            data: latestSop
        });
    } catch (error) {
        next(error);
    }
};

const getAssignedSop = async (req, res, next) => {
    try {
        let dataSop = [];
        if (req.user.role == 'penyusun') {
            dataSop = await modelSopDetail.findAll({
                attributes: ['id_sop_detail', 'number', 'status'],
                include: [
                    {
                        model: modelSop,
                        attributes: ['name', 'createdAt'],
                        include: {
                            model: modelOrganization,
                            attributes: ['name']
                        }
                    },
                    {
                        model: modelUser,
                        attributes: [],
                        where: { email: req.user.email },
                        through: { attributes: [] }
                    }
                ]
            });
        } else if (req.user.role == 'pj' || req.user.role == 'kadep') {
            dataSop = await modelSopDetail.findAll({
                attributes: ['id_sop_detail', 'number', 'status'],
                include: {
                    model: modelSop,
                    attributes: ['name', 'createdAt'],
                    where: { id_org: req.user.id_org_pic },
                    include: {
                        model: modelOrganization,
                        attributes: ['name'],
                    }
                }
            });
        }

        const data = dataSop.map(item => ({
            id: item.id_sop_detail,
            name: item.sop.name,
            number: item.number,                 //ntar aktifin lagi kalau perlu
            creation_date: dateFormat(item.sop.createdAt),
            status: item.status,
            org_name: item.sop.organization.name,
        }));

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
                'number', 'status', 'description', 'pic_position',
                'effective_date', 'createdAt', 'updatedAt',
            ],
            include: [
                {
                    model: modelSop,
                    attributes: ['name'],
                    include: {
                        model: modelOrganization,
                        attributes: ['id_org', 'name'],
                        include: {
                            model: modelUser,   //ambil pic/penanggung jawab
                            attributes: ['identity_number', 'name'],
                            include: {
                                model: modelRole,
                                where: {
                                    role_name: {
                                        [Op.in]: ['pj', 'kadep'] // ambil hanya yang punya role pj atau kadep
                                    }
                                }
                            },
                        }
                    }
                },
                {   //ambil penyusun
                    model: modelUser,
                    attributes: ['identity_number', 'name'],
                    through: { attributes: [] }
                }
            ]
        });
        if (!dataSop) return res.status(404).json({ message: 'data tidak ditemukan!' });

        // Transform data untuk menghapus struktur nested yang tidak diinginkan
        const { sop, users, number, status, description, pic_position, createdAt, updatedAt } = dataSop;
        const data = {
            name: sop.name,
            creation_date: dateFormat(createdAt),
            last_update_date: dateFormat(updatedAt),
            organization: {
                id_org: sop.organization.id_org,
                name: sop.organization.name
            },
            pic: sop.organization.user && {
                id_number: sop.organization.user.identity_number,
                name: sop.organization.user.name,
                role: sop.organization.user.role?.role_name || null
            },
            number,
            status,
            description,
            pic_position,
            drafter: users.map(({ identity_number, name }) => ({
                id_number: identity_number,
                name
            })),
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
        if (!validateUUID(id)) {
            console.error('ID harus berupa UUID')
            return res.status(400).json({ message: 'ID harus berupa UUID' })
        }

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
        const {
            id_sop_detail, seq_number, name, type, id_implementer, fittings, time, time_unit, output, description,
            id_next_step_if_yes, id_next_step_if_no
        } = req.body;

        await modelSopStep.create({
            id_step: nanoid(10),
            id_sop_detail, seq_number, name, type, id_implementer, fittings, time, time_unit, output, description,
            id_next_step_if_yes, id_next_step_if_no
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

        return res.status(200).json({ message: 'sukses memperbarui data' });
    } catch (error) {
        next(error);
    }
};

const deleteSopStep = async (req, res, next) => {
    try {
        const { id } = req.params;

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

const confirmSopandBpmn = async (req, res, next) => {
    try {
        const { id } = req.params;

        const dataSopDetail = await modelSopDetail.findByPk(id, { attributes: ['id_sop_detail', 'id_sop', 'status'] });
        if (!dataSopDetail) return res.status(404).json({ message: 'Data sop detail tidak ditemukan' });

        const sopUtama = await modelSop.findByPk(dataSopDetail.dataValues.id_sop, { attributes: ['id_sop', 'is_active'] });
        if (sopUtama.dataValues.is_active === 2) {
            await sopUtama.update({ is_active: 1 });
        }

        // Update status menjadi 0 hanya untuk SOP detail versi yang lain
        await modelSopDetail.update(
            { status: 0 },
            {
                where: {
                    id_sop: dataSopDetail.dataValues.id_sop,
                    id_sop_detail: { [Op.ne]: dataSopDetail.dataValues.id_sop_detail },
                    status: { [Op.ne]: 0 }
                }
            }
        );

        await dataSopDetail.update({
            status: 1,
            signature_url: req.user.signature,
            effective_date: new Date()
        });

        return res.status(200).json({ message: 'sukses mengkonfirmasi SOP' });
    } catch (error) {
        next(error);
    }
};

// konfigurasi tampilan SOP
const saveSopLayout = async (req, res, next) => {           // menyimpat layout dan pagination saja
    try {
        const { id } = req.params;
        if (!id) return res.status(400).json({ message: 'ID sop detail tidak boleh kosong' });

        const {
            nominal_basic_page_steps,
            nominal_steps_both_opc,
            kegiatan_width,
            kelengkapan_width,
            waktu_width,
            output_width,
            ket_width,
        } = req.body;

        // Menggunakan upsert
        const [config, created] = await modelSopDisplayConfig.upsert({
            id_sop_detail: id,
            nominal_basic_page_steps,
            nominal_steps_both_opc,
            kegiatan_width,
            kelengkapan_width,
            waktu_width,
            output_width,
            ket_width,
        });

        if (created) {
            return res.status(201).json({ message: 'Konfigurasi berhasil dibuat', data: config });
        } else {
            return res.status(200).json({ message: 'Konfigurasi berhasil diperbarui', data: config });
        }
    } catch (error) {
        next(error);
    }
};

const saveFlowchartConfig = async (req, res, next) => {     // menyimpan konfigurasi panah dan label flowchart
    try {
        const { id } = req.params;
        if (!id) return res.status(400).json({ message: 'ID sop detail tidak boleh kosong' });
        const { flowchart_arrow_config, flowchart_label_config } = req.body;
        if (!flowchart_arrow_config && !flowchart_label_config) {
            return res.status(400).json({ message: 'Minimal satu konfigurasi harus diisi' });
        }
        const updateData = { id_sop_detail: id };
        if (flowchart_arrow_config) {
            updateData.flowchart_arrow_config = flowchart_arrow_config;
        }
        if (flowchart_label_config) {
            updateData.flowchart_label_config = flowchart_label_config;
        }

        const [config, created] = await modelSopDisplayConfig.upsert(updateData);

        if (created) {
            return res.status(201).json({ message: 'Konfigurasi berhasil dibuat', data: config });
        } else {
            return res.status(200).json({ message: 'Konfigurasi berhasil diperbarui', data: config });
        }
    } catch (error) {
        next(error);
    }
};

const saveBpmnConfig = async (req, res, next) => {          // menyimpan konfigurasi panah dan label BPMN
    try {
        const { id } = req.params;
        if (!id) return res.status(400).json({ message: 'ID sop detail tidak boleh kosong' });
        const { bpmn_arrow_config, bpmn_label_config } = req.body;
        if (!bpmn_arrow_config && !bpmn_label_config) {
            return res.status(400).json({ message: 'Minimal satu konfigurasi harus diisi' });
        }
        const updateData = { id_sop_detail: id };
        if (bpmn_arrow_config) {
            updateData.bpmn_arrow_config = bpmn_arrow_config;
        }
        if (bpmn_label_config) {
            updateData.bpmn_label_config = bpmn_label_config;
        }

        const [config, created] = await modelSopDisplayConfig.upsert(updateData);

        if (created) {
            return res.status(201).json({ message: 'Konfigurasi berhasil dibuat', data: config });
        } else {
            return res.status(200).json({ message: 'Konfigurasi berhasil diperbarui', data: config });
        }
    } catch (error) {
        next(error);
    }
};

const getSopDisplayConfig = async (req, res, next) => {     // mengambil semua konfigurasi tampilan SOP
    try {
        const { id } = req.params;
        if (!id) return res.status(400).json({ message: 'ID sop detail tidak boleh kosong' });

        const config = await modelSopDisplayConfig.findOne({
            where: { id_sop_detail: id },
            attributes: [
                'id_sop_detail',
                'nominal_basic_page_steps',
                'nominal_steps_both_opc',
                'kegiatan_width',
                'kelengkapan_width',
                'waktu_width',
                'output_width',
                'ket_width',
                'flowchart_arrow_config',
                'bpmn_arrow_config',
                'flowchart_label_config',
                'bpmn_label_config'
            ]
        });

        if (!config) return res.status(404).json({ message: 'Konfigurasi tidak ditemukan' });

        return res.status(200).json({
            message: 'sukses mendapatkan konfigurasi',
            data: config
        });
    } catch (error) {
        next(error);
    }
};

const clearFlowchartConfig = async (req, res, next) => {    // menghapus konfigurasi panah dan label flowchart
    try {
        const { id } = req.params;
        if (!id) return res.status(400).json({ message: 'ID sop detail tidak boleh kosong' });

        const [updated] = await modelSopDisplayConfig.update(
            { flowchart_arrow_config: null, flowchart_label_config: null },
            { where: { id_sop_detail: id } }
        );

        if (updated === 0) return res.status(404).json({ message: 'Konfigurasi tidak ditemukan' });

        return res.status(200).json({ message: 'Konfigurasi flowchart berhasil dihapus' });
    } catch (error) {
        next(error);
    }
};

const clearBpmnConfig = async (req, res, next) => {         // menghapus konfigurasi panah dan label BPMN
    try {
        const { id } = req.params;
        if (!id) return res.status(400).json({ message: 'ID sop detail tidak boleh kosong' });

        const [updated] = await modelSopDisplayConfig.update(
            { bpmn_arrow_config: null, bpmn_label_config: null },
            { where: { id_sop_detail: id } }
        );

        if (updated === 0) return res.status(404).json({ message: 'Konfigurasi tidak ditemukan' });

        return res.status(200).json({ message: 'Konfigurasi BPMN berhasil dihapus' });
    } catch (error) {
        next(error);
    }
};

export {
    addSop, getAllSop, getSopById, getAssignedSop, getManagedSop, deleteSop, updateSop, getSopVersion,
    addSopDetail, getAllSopDetail, updateSopDetail, deleteSopDetail, getSectionandWarning, getLatestSopInYear,
    getAssignedSopDetail,
    addSopStep, getSopStepbySopDetail, updateSopStep, deleteSopStep,
    saveSopLayout, getSopDisplayConfig, saveBpmnConfig, saveFlowchartConfig, clearFlowchartConfig, clearBpmnConfig,
    confirmSopandBpmn,
};
