import { Op } from 'sequelize';

import modelOrganization from '../models/organization.js';
import modelSopDetail from '../models/sop_details.js';
import modelUser from '../models/users.js';
import modelRole from '../models/roles.js';
import modelSop from '../models/sop.js';

const addOrg = async (req, res, next) => {
    try {
        const { name, about } = req.body;

        await modelOrganization.create({ name, about });

        res.status(201).json({
            message: 'sukses menambahkan data'
        });

    } catch (error) {
        next(error);
    }
};

const getOrg = async (req, res, next) => {
    try {
        const organization = await modelOrganization.findAll({
            include: [
                {
                    model: modelUser,
                    attributes: ['id_user', 'name'],
                    include: {
                        model: modelRole,
                        attributes: ['role_name'],
                        where: {
                            role_name: {
                                [Op.or]: ['pj', 'kadep']
                            }
                        }
                    }
                },
                {
                    model: modelSop,
                    attributes: ['id_sop'],
                    include: {
                        model: modelSopDetail,
                        attributes: ['id_sop_detail']
                    }
                }

            ]
        });

        const data = organization.map(item => ({
            id: item.id_org,
            name: item.name,
            about: item.about,
            pic: {
                id: item.user?.id_user,
                name: item.user?.name,
                role: item.user?.role.role_name
            },
            total_sop: item.sops.reduce((total, sop) => {
                return total + sop.sop_details.length;
            }, 0)
        }));

        return res.status(200).json({
            message: 'sukses mendapat data',
            data
        });

    } catch (error) {
        next(error);
    }
};

const deleteOrg = async (req, res, next) => {
    try {
        const { id } = req.params;

        // Update semua id_org_pic ke NULL
        await modelUser.update({ id_org_pic: null }, {
            where: { id_org_pic: id }
        });

        // Hapus data organisasi
        const deletedCount = await modelOrganization.destroy({ where: { id_org: id } });
        if (deletedCount === 0) {
            return res.status(404).json({ message: 'Data organisasi tidak ditemukan!' });
        }

        return res.status(200).json({
            message: 'Sukses menghapus data organisasi',
        });

    } catch (error) {
        next(error);
    }
};

const updateOrg = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (isNaN(Number(id))) return res.status(400).json({ message: 'ID harus berupa angka' });

        const { name, about } = req.body;

        // Cari organisasi berdasarkan ID
        const organization = await modelOrganization.findByPk(id);
        if (!organization) return res.status(404).json({ message: 'Data organisasi tidak ditemukan!' });

        // Update data organisasi
        await organization.update({
            name, about
        });

        return res.status(200).json({
            message: 'Sukses memperbarui data organisasi',
        });

    } catch (error) {
        next(error);
    }
};

export {
    addOrg, getOrg, deleteOrg, updateOrg
};
