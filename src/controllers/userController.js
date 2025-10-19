import { Op, literal } from 'sequelize';
import { env } from 'node:process';
import { uploadFile, deleteFile, resizeImage } from '../utils/fileServices.js';

import modelSopDetail from '../models/sop_details.js';
import modelOrg from '../models/organization.js';
import modelDrafter from '../models/drafter.js';
import modelUser from '../models/users.js';
import modelRole from '../models/roles.js';
import modelSop from '../models/sop.js';

const getUserByRole = async (req, res, next) => {
    try {
        const { role } = req.params;
        if (!role) return res.status(400).json({ message: 'Parameter role harus disertakan' });

        let dataRole = await modelRole.findAll({
            attributes: ['role_name']
        });
        dataRole = dataRole.map(item => item.role_name);

        const requestedRoles = role.split(',');
        const invalidRoles = requestedRoles.filter(r => !dataRole.includes(r));
        if (invalidRoles.length > 0) {
            return res.status(400).json({
                message: `Role tidak valid: ${invalidRoles.join(', ')}. Role yang tersedia: ${dataRole.join(', ')}`
            });
        }

        // Cek jika requestedRoles mengandung 'sivitas-akademika'
        const isSivitas = requestedRoles.includes('sivitas-akademika');
        const where = (req.user.role === 'pj' && !isSivitas) ? { id_org_pic: req.user.id_org_pic } : {};

        const user = await modelUser.findAll({
            attributes: ['id_user', 'identity_number', 'name'],
            include: {
                model: modelRole,
                where: {
                    role_name: {
                        [Op.or]: requestedRoles
                    }
                },
                attributes: []
            },
            where
        });

        const data = user.map(item => ({
            id: item.id_user,
            id_number: item.identity_number,
            name: item.name
        })) || [];

        res.status(200).json({
            message: 'sukses mendapatkan data',
            data,
        });
    } catch (error) {
        next(error);
    }
};

const getUserProfile = async (req, res, next) => {
    try {
        const dataUser = await modelUser.findByPk(req.user.id_user, {
            attributes: { exclude: ['password', 'id_role', 'id_org_pic'] },
            include: [
                {
                    model: modelRole,
                    attributes: ['role_name']
                },
                {
                    model: modelOrg,
                    attributes: ['name']
                }
            ]
        });

        const data = {
            id: dataUser.dataValues.id_user,
            id_number: dataUser.dataValues.identity_number,
            name: dataUser.dataValues.name,
            gender: dataUser.dataValues.gender,
            photo: dataUser.dataValues.photo ? encodeURI(`${env.CLOUDFLARE_R2_PUBLIC_BUCKET_URL}/${dataUser.dataValues.photo}`) : null,
            signature: dataUser.dataValues.signature ? encodeURI(`${env.CLOUDFLARE_R2_PUBLIC_BUCKET_URL}/${dataUser.dataValues.signature}`) : null,
            email: dataUser.dataValues.email,
            role: dataUser.dataValues.role.role_name,
            org: dataUser.dataValues.organization?.name || "-",
        };

        res.status(200).json({
            message: 'sukses mendapatkan data',
            data
        });
    } catch (error) {
        next(error);
    }
};

const updateProfile = async (req, res, next) => {
    try {
        const { id_number, name, gender, email } = req.body;

        const dataUser = await modelUser.findByPk(req.user.id_user, {
            attributes: ['id_number', 'name', 'gender', 'email']
        });

        if (email != dataUser.dataValues.email) {

        }

    } catch (error) {
        next(error);
    }
};

// foto profil
const uploadProfilePhoto = async (req, res, next) => {
    try {
        const file = req.file;
        const user = await modelUser.findByPk(req.user.id_user, {
            attributes: ['id_user', 'photo']
        });
        if (!user) return res.status(404).json({ message: 'user tidak ditemukan!' });

        // Crop gambar di tengah ke ukuran 200x200 px
        const resizedBuffer = await resizeImage(file.buffer, 200, 200);
        const resizedFile = { ...file, buffer: resizedBuffer };

        const fileUrl = await uploadFile(resizedFile, 'profile-pictures');
        await user.update({ photo: fileUrl });

        return res.status(200).json({ message: 'Foto profil berhasil diunggah', fileUrl });
    } catch (error) {
        next(error);
    }
};

const deleteProfilePhoto = async (req, res, next) => {
    try {
        const user = await modelUser.findByPk(req.user.id_user, {
            attributes: ['id_user', 'photo']
        });
        if (!user || !user.dataValues.photo) return res.status(404).json({ message: 'user atau foto tidak ditemukan!' });

        await deleteFile(user.dataValues.photo, 'profile-pictures');
        await user.update({ photo: null });

        return res.status(200).json({ message: 'Foto profil berhasil dihapus!' });
    } catch (error) {
        next(error);
    }
};

// tanda tangan
const uploadSignatureFile = async (req, res, next) => {
    try {
        const file = req.file;
        const user = await modelUser.findByPk(req.user.id_user, {
            attributes: ['id_user', 'signature']
        });
        if (!user) return res.status(404).json({ message: 'user tidak ditemukan!' });

        // Crop tanda tangan di tengah ke ukuran 200x200 px
        const resizedBuffer = await resizeImage(file.buffer, 200, 200);
        const resizedFile = { ...file, buffer: resizedBuffer };
        const fileUrl = await uploadFile(resizedFile, 'signatures');
        await user.update({ signature: fileUrl });

        return res.status(200).json({ message: 'Tanda tangan berhasil diunggah', fileUrl });
    } catch (error) {
        next(error);
    }
};

const deleteSignatureFile = async (req, res, next) => {
    try {
        const user = await modelUser.findByPk(req.user.id_user, {
            attributes: ['id_user', 'signature']
        });
        if (!user || !user.dataValues.signature) return res.status(404).json({ message: 'user atau tanda tangan tidak ditemukan!' });

        //dibatalkan karena tanda tangan yang digunakan harus sesuai dengan anda tangan yang diberikan saat pengesahan
        // await deleteFile(user.dataValues.signature, 'signatures');   

        await user.update({ signature: null });

        return res.status(200).json({ message: 'File tanda tangan berhasil dihapus!' });
    } catch (error) {
        next(error);
    }
};

// pic
const getAllPic = async (req, res, next) => {
    try {
        let dataPic;
        if (req.user.role == 'kadep') {
            dataPic = await modelUser.findAll({
                attributes: ['id_user', 'identity_number', 'name'],
                include: [
                    {
                        model: modelRole,
                        attributes: [],
                        where: {
                            role_name: 'pj'
                        }
                    },
                    {
                        model: modelOrg,
                        attributes: ['name']
                    }
                ]
            });
        } else if (req.user.role == 'pj') {
            dataPic = await modelUser.findAll({
                attributes: ['id_user', 'identity_number', 'name'],
                include: [
                    {
                        model: modelRole,
                        attributes: [],
                        where: {
                            role_name: 'pj'
                        }
                    },
                    {
                        model: modelOrg,
                        attributes: ['name'],
                        where: {
                            id_org: req.user.id_org_pic
                        }
                    }
                ]
            });
        }

        const data = dataPic?.map(item => ({
            id: item.id_user,
            id_number: item.identity_number,
            name: item.name,
            org: item.organization?.name || '-'
        })) || [];

        res.status(200).json({
            message: 'sukses mendapatkan data',
            data
        });
    } catch (error) {
        next(error);
    }
};

const getPicCandidate = async (req, res, next) => {
    try {
        let dataPic;
        if (req.user.role == 'kadep') {
            dataPic = await modelUser.findAll({
                attributes: ['id_user', 'identity_number', 'name'],
                include: [
                    {
                        model: modelSopDetail,
                        attributes: ['id_sop_detail'],
                        through: { attributes: [] }
                    },
                    {
                        model: modelRole,
                        attributes: [],
                        where: {
                            role_name: {
                                [Op.notIn]: ['pj', 'kadep'],
                            }
                        }
                    }
                ],
            });
        } else if (req.user.role == 'pj') {
            dataPic = await modelUser.findAll({
                attributes: ['id_user', 'identity_number', 'name'],
                include: [
                    {
                        model: modelSopDetail,
                        attributes: ['id_sop_detail'],
                        through: { attributes: [] }
                    },
                    {
                        model: modelRole,
                        attributes: [],
                        where: {
                            role_name: {
                                [Op.notIn]: ['pj', 'kadep'],
                            }
                        }
                    }
                ],
                where: {
                    // hanya bisa menambahkan user yang organisasinya sama atau yang belum punya organisasi
                    id_org_pic: {
                        [Op.or]: [req.user.id_org_pic, null],
                    }
                },
            });
        }

        const data = dataPic?.map(item => ({
            id: item.id_user,
            id_number: item.identity_number,
            name: item.name,
            status: item.sop_details.length > 0 ? 1 : 0
        })) || [];

        res.status(200).json({
            message: 'sukses mendapatkan data',
            data
        });
    } catch (error) {
        next(error);
    }
};

const addPic = async (req, res, next) => {
    try {
        const { id, org } = req.body;

        const pic = await modelUser.findByPk(id, {
            attributes: ['id_user'],
            include: {
                model: modelRole,
                attributes: ['role_name']
            }
        });
        if (!pic) return res.status(404).json({ message: 'user tidak ditemukan!' });
        if (pic.dataValues.role.role_name === 'pj') return res.status(404).json({ message: 'user ini sudah menjadi penanggung jawab!' })

        const role = await modelRole.findOne({
            where: { role_name: 'pj' },
            attributes: ['id_role']
        });

        await pic.update({
            id_role: role.id_role,
            id_org_pic: org
        });

        return res.status(200).json({
            message: 'sukses menambahkan data'
        });
    } catch (error) {
        next(error);
    }
};

const getUnassignedPic = async (req, res, next) => {
    try {
        const pic = await modelUser.findAll({
            attributes: ['id_user', 'identity_number', 'name'],
            include: {
                model: modelRole,
                where: {
                    role_name: 'pj'
                }
            },
            where: {
                id_org_pic: null
            }
        });

        const data = pic.map(item => ({
            id: item.id_user,
            id_number: item.identity_number,
            name: item.name
        }));

        res.status(200).json({
            message: 'sukses mendapatkan data',
            data
        });
    } catch (error) {
        next(error);
    }
};

const getPicDetail = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!id) return res.status(404).json({ message: 'masukkan id penanggung jawab!' });

        const dataPic = await modelUser.findByPk(id, {
            attributes: { exclude: ['password', 'id_role', 'id_org_pic'] },
            include: [
                {
                    model: modelOrg,
                    attributes: ['name'],
                    include: [
                        {
                            model: modelSop,
                            attributes: ['name', 'is_active'],
                            include: {
                                model: modelSopDetail,
                                attributes: ['number', 'version', 'status']

                            }
                        },
                        {
                            model: modelUser,
                            attributes: ['identity_number', 'name']
                        }
                    ]
                },
                {
                    model: modelRole,
                    attributes: ['role_name']
                }
            ]
        });

        const data = {
            id: dataPic.dataValues.id_user,
            id_number: dataPic.dataValues.identity_number,
            name: dataPic.dataValues.name,
            role: dataPic.dataValues.role.role_name,
            gender: dataPic.dataValues.gender,
            email: dataPic.dataValues.email,
            org: dataPic.dataValues.organization?.name || '-',
            team_member: dataPic.dataValues.organization?.users?.map(item => ({
                id_number: item.identity_number,
                name: item.name
            })) || [],
            sop: dataPic.dataValues.organization?.sops?.flatMap(itemsop =>
                itemsop.sop_details.map(itemsopdetail => ({
                    number: itemsopdetail.number,
                    name: itemsop.name,
                    version: itemsopdetail.version,
                    is_sop_active: itemsop.is_active,
                    status: itemsopdetail.status
                }))
            ) || [],
        };

        res.status(200).json({
            message: 'sukses mendapatkan data',
            data
        });
    } catch (error) {
        next(error);
    }
};

const getCurrentPic = async (req, res, next) => {
    try {
        const pic = await modelUser.findOne({
            attributes: { exclude: ['signature', 'password', 'id_role', 'id_org_pic'] },
            include: [
                {
                    model: modelRole,
                    attributes: [],
                    where: {
                        role_name: 'pj'
                    }
                },
                {
                    model: modelOrg,
                    attributes: ['name'],
                    where: {
                        id_org: req.user.id_org_pic
                    }
                }
            ]
        });
        if (!pic) return res.status(404).json({ message: 'Penanggung jawab tidak ditemukan!' });

        const data = {
            id: pic.id_user,
            id_number: pic.identity_number,
            name: pic.name,
            gender: pic.gender,
            photo: pic.photo ? encodeURI(`${env.CLOUDFLARE_R2_PUBLIC_BUCKET_URL}/${pic.photo}`) : null,
            email: pic.email,
            org: pic.organization.name,
        };

        res.status(200).json({
            message: 'sukses mendapatkan data',
            data
        });
    } catch (error) {
        next(error);
    }
};

const updatePic = async (req, res, next) => {
    try {
        const { id } = req.body; // id penanggung jawab yang baru
        if (!id) return res.status(400).json({ message: 'ID penanggung jawab harus disertakan' });

        // Turunkan role penanggung jawab lama & angkat penanggung jawab baru
        await modelUser.update(
            { id_role: 2 }, // user biasa
            { where: { id_user: req.user.id_user } }
        );
        await modelUser.update(
            { id_role: 3, id_org_pic: req.user.id_org_pic }, // penanggung jawab baru
            { where: { id_user: id } }
        );

        return res.status(200).json({ message: 'Penanggung jawab berhasil diperbarui' });
    } catch (error) {
        next(error);
    }
};

// penyusun
const getAllDrafter = async (req, res, next) => {
    try {
        let dataDrafter;
        if (req.user.role == 'kadep') {
            dataDrafter = await modelUser.findAll({
                attributes: ['id_user', 'identity_number', 'name'],
                include: [
                    {
                        model: modelRole,
                        attributes: [],
                        where: {
                            role_name: 'penyusun' // Mengambil role_name yang sesuai
                        }
                    },
                    {
                        model: modelSopDetail,
                        attributes: ['id_sop_detail'],
                        through: { attributes: [] }
                    },
                    {
                        model: modelOrg,
                        attributes: ['name']
                    }
                ]
            });
        } else if (req.user.role == 'pj') {
            dataDrafter = await modelUser.findAll({
                attributes: ['id_user', 'identity_number', 'name'],
                include: [
                    {
                        model: modelRole,
                        attributes: [],
                        where: {
                            role_name: 'penyusun' // Mengambil role_name yang sesuai
                        }
                    },
                    {
                        model: modelSopDetail,
                        attributes: ['id_sop_detail'],
                        through: { attributes: [] },
                    },
                    {
                        model: modelOrg,
                        attributes: ['name']
                    }
                ],
                where: {
                    id_org_pic: req.user.id_org_pic
                }
            });
        }

        const data = dataDrafter.map(item => ({
            id: item.id_user,
            id_number: item.identity_number,
            name: item.name,
            org: item.organization?.name || '-',
            status: item.sop_details.length > 0 ? 1 : 0
        })) || [];

        res.status(200).json({
            message: 'sukses mendapatkan data',
            data
        });

    } catch (error) {
        next(error);
    }
};

const addSopDrafter = async (req, res, next) => {
    try {
        const { id_user, id_sop_detail } = req.body;

        const dataUser = await modelUser.findByPk(id_user);
        const dataSopDetail = await modelSopDetail.findByPk(id_sop_detail);

        if (!dataUser || !dataSopDetail) {
            const error = new Error('Data user atau POS tidak ditemukan');
            error.status = 404;
            throw error;
        };

        await modelDrafter.create({
            id_user, id_sop_detail
        });

        return res.status(200).json({
            message: 'sukses menambahkan data',
        });
    } catch (error) {
        next(error);
    }
};

const removeSopDrafter = async (req, res, next) => {
    try {
        const { userId, sopDetailId } = req.params;

        const deletedCount = await modelDrafter.destroy({
            where: { id_user: userId, id_sop_detail: sopDetailId }
        });

        if (deletedCount === 0) {
            return res.status(404).json({ message: 'Data user atau POS tidak ditemukan' });
        }

        return res.status(200).json({
            message: 'sukses menghapus data',
        });
    } catch (error) {
        next(error);
    }
};

const getDrafterByIdDetail = async (req, res, next) => {      //ambil pembuat dokumen berdasarkan id detail sop
    try {
        const { id } = req.params;
        const dataSopDetail = await modelSopDetail.findByPk(id);

        if (!dataSopDetail) {
            const error = new Error('Data POS tidak ditemukan');
            error.status = 404;
            throw error;
        };

        const drafter = await modelUser.findAll({
            include: {
                model: modelSopDetail,
                where: { id_sop_detail: id },
                attributes: []
            },
            attributes: ['identity_number', 'name']
        });

        return res.status(200).json({
            message: 'sukses mengambil data',
            data: drafter
        });

    } catch (error) {
        next(error);
    }
};

const addDrafter = async (req, res, next) => {      //ubah role user jadi penyusun
    try {
        const { id } = req.body;

        const drafter = await modelUser.findByPk(id, {
            attributes: ['id_user'],
            include: {
                model: modelRole,
                attributes: ['role_name']
            }
        });
        if (!drafter) return res.status(404).json({ message: 'user tidak ditemukan!' });
        if (drafter.dataValues.role.role_name === 'penyusun') return res.status(404).json({ message: 'user ini sudah menjadi penyusun!' })

        const role = await modelRole.findOne({
            where: { role_name: 'penyusun' },
            attributes: ['id_role']
        });

        await drafter.update({
            id_role: role.id_role,
            id_org_pic: req.user.id_org_pic
        });

        return res.status(200).json({
            message: 'sukses menambahkan data'
        });
    } catch (error) {
        next(error);
    }
};

const getDrafterDetail = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!id) return res.status(404).json({ message: 'masukkan id penanggung jawab!' });

        const dataDrafter = await modelUser.findByPk(id, {
            attributes: { exclude: ['password', 'id_role', 'id_org_pic'] },
            include: [
                {
                    model: modelOrg,
                    attributes: ['name']
                },
                {
                    model: modelRole,
                    attributes: ['role_name']
                },
                {
                    model: modelSopDetail,
                    attributes: ['number', 'version', 'status'],
                    through: { attributes: [] },
                    include: {
                        model: modelSop,
                        attributes: ['name', 'is_active'],
                    }
                },
            ]
        });

        const data = {
            id: dataDrafter.dataValues.id_user,
            id_number: dataDrafter.dataValues.identity_number,
            name: dataDrafter.dataValues.name,
            role: dataDrafter.dataValues.role.role_name,
            gender: dataDrafter.dataValues.gender,
            email: dataDrafter.dataValues.email,
            org: dataDrafter.dataValues.organization.name,
            sop: dataDrafter.dataValues.sop_details?.map(itemsop => ({
                number: itemsop.number,
                name: itemsop.sop.name,
                version: itemsop.version,
                is_sop_active: itemsop.sop.is_active,
                status: itemsop.status
            })) || [],
        };

        res.status(200).json({
            message: 'sukses mendapatkan data',
            data
        });
    } catch (error) {
        next(error);
    }
};

// Kepala departemen
const getHodCandidate = async (req, res, next) => {
    try {
        const hodCandidate = await modelUser.findAll({
            where: {
                // Menggunakan sequelize.literal untuk menggunakan fungsi MySQL LENGTH
                [Op.and]: [
                    literal('LENGTH(REPLACE(identity_number, "-", "")) = 18')
                ]
            },
            attributes: ['id_user', 'identity_number', 'name'],
            include: {
                model: modelRole,
                attributes: [],
                where: { role_name: { [Op.ne]: 'kadep' } }
            }
        });

        const data = hodCandidate.map(item => ({
            id: item.id_user,
            id_number: item.identity_number,
            name: item.name
        }));

        res.status(200).json({
            message: 'sukses mendapatkan data',
            data
        });

    } catch (error) {
        next(error);
    }
};

const updateHod = async (req, res, next) => {
    try {
        const { oldHodId, newHodId } = req.body;

        const hod = await modelUser.findByPk(newHodId, {
            attributes: ['id_user'],
            include: {
                model: modelRole,
                attributes: ['role_name']
            }
        });
        if (!hod) return res.status(404).json({ message: 'user tidak ditemukan!' });
        if (hod.dataValues.role.role_name === 'kadep') return res.status(404).json({ message: 'user ini sudah menjadi kadep!' })

        const role = await modelRole.findOne({
            where: { role_name: 'kadep' },
            attributes: ['id_role']
        });

        // turunin kadep lama
        await modelUser.update(
            { id_role: 2 },
            { where: { id_user: oldHodId } }
        );

        // angkat kadep baru
        await hod.update({
            id_role: role.dataValues.id_role,
            id_org_pic: 0 // Asumsi id_org untuk Departemen Sistem Informasi adalah 0
        });

        return res.status(200).json({
            message: 'sukses menambahkan data'
        });
    } catch (error) {
        next(error);
    }
};

const getCurrentHod = async (req, res, next) => {
    try {
        const hod = await modelUser.findOne({
            attributes: { exclude: ['signature', 'password', 'id_role', 'id_org_pic'] },
            include: [
                {
                    model: modelRole,
                    attributes: [],
                    where: {
                        role_name: 'kadep'
                    }
                },
                {
                    model: modelOrg,
                    attributes: [],
                    where: {
                        id_org: 0 // Asumsi id_org untuk Departemen Sistem Informasi adalah 0
                    }
                }
            ]
        });

        const data = {
            id: hod.id_user,
            id_number: hod.identity_number,
            name: hod.name,
            gender: hod.gender,
            photo: hod.photo ? encodeURI(`${env.CLOUDFLARE_R2_PUBLIC_BUCKET_URL}/${hod.photo}`) : null,
            email: hod.email,
        };

        res.status(200).json({
            message: 'sukses mendapatkan data',
            data
        });
    } catch (error) {
        next(error);
    }
};

// role dan organisasi pengguna
const downgradeUserRole = async (req, res, next) => {
    try {
        const { id, role } = req.body;
        console.log('downgrade user role', id, role);
        if (!id || !role) return res.status(400).json({ message: 'ID dan role harus disertakan' });
        const user = await modelUser.findByPk(id, {
            attributes: ['id_user'],
            include: {
                model: modelRole,
                attributes: ['role_name']
            }
        });
        if (!user) return res.status(404).json({ message: 'user tidak ditemukan!' });
        if (user.dataValues.role.role_name === role) {
            console.log('user ini sudah menjadi', user.dataValues.role.role_name);
            return res.status(404).json({ message: `user ini sudah menjadi ${role}!` });
        }

        const roleData = await modelRole.findOne({
            where: { role_name: role },
            attributes: ['id_role']
        });
        if (!roleData) return res.status(404).json({ message: 'Role tidak ditemukan!' });

        await user.update({
            id_role: roleData.dataValues.id_role,
        });
        console.log('berhasil menurunkan role user', user.dataValues.id_user, 'menjadi', role);
        return res.status(200).json({ message: 'sukses menurunkan role user' });
    } catch (error) {
        next(error);
    }
};

const changeUserOrganization = async (req, res, next) => {
    try {
        const { id, org } = req.body;
        if (!id) return res.status(400).json({ message: 'ID user harus disertakan' });

        const user = await modelUser.findByPk(id, {
            attributes: ['id_user', 'id_org_pic', 'id_role'],
            include: {
                model: modelRole,
                attributes: ['role_name']
            }
        });
        if (!user) return res.status(404).json({ message: 'user tidak ditemukan!' });
        if (user.id_user === req.user.id_user) return res.status(400).json({ message: 'Anda tidak dapat mengubah organisasi Anda sendiri!' });
        if (user.id_org_pic === org) return res.status(400).json({ message: 'User ini sudah berada di organisasi tersebut!' });

        if (org) {
            const organization = await modelOrg.findByPk(org, { attributes: ['id_org'] });
            if (!organization) return res.status(404).json({ message: 'Organisasi tidak ditemukan!' });
        }

        // Jika user yang diubah adalah 'pj', cari user lain dengan role 'pj' di organisasi tujuan dan ubah jadi 'penyusun'
        if (user.role.role_name === 'pj') {
            const penyusunRole = await modelRole.findOne({ where: { role_name: 'penyusun' }, attributes: ['id_role'] });
            await modelUser.update(
                { id_role: penyusunRole.id_role },
                {
                    where: {
                        id_org_pic: org,
                        id_role: user.id_role,
                        id_user: { [Op.ne]: user.id_user }
                    }
                }
            );
        }

        const [updatedCount] = await modelUser.update(
            { id_org_pic: org },
            { where: { id_user: id } }
        );
        if (updatedCount === 0) return res.status(500).json({ message: 'Gagal mengubah organisasi user' });

        return res.status(200).json({ message: 'sukses mengubah organisasi user' });
    } catch (error) {
        next(error);
    }
};

// penanda tangan
const getSigner = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!id) return res.status(404).json({ message: 'masukkan id penanda tangan!' });

        const user = await modelUser.findByPk(id, {
            attributes: ['identity_number', 'name'],
            include: {
                model: modelRole,
                attributes: ['role_name'],
                // where: { role_name: { [Op.in]: ['kadep', 'pj'] } }
            }
        });

        if (!user?.dataValues) return res.status(404).json({ message: 'data user tidak ditemukan!' });

        const data = {
            id_number: user.identity_number,
            name: user.name,
            role: user.role?.role_name || null
        };

        res.status(200).json({
            message: 'sukses mendapatkan data',
            data
        });
    } catch (error) {
        next(error);
    }
};

export {
    getUserByRole, getUserProfile, updateProfile,
    uploadProfilePhoto, deleteProfilePhoto,
    uploadSignatureFile, deleteSignatureFile,
    getAllDrafter, getDrafterByIdDetail, addSopDrafter, removeSopDrafter, addDrafter, getDrafterDetail,
    getHodCandidate, updateHod, getCurrentHod,
    getSigner,
    getAllPic, addPic, getUnassignedPic, getPicCandidate, getPicDetail, getCurrentPic, updatePic,
    downgradeUserRole, changeUserOrganization,
};
