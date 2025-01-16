import modelOrganization from '../models/organization.js';
import modelUser from '../models/users.js';
import modelRole from '../models/roles.js';
import modelPic from '../models/person_in_charge.js';
import { where } from 'sequelize';

const addOrg = async (req, res, next) => {
    try {
        const { pic, name, about } = req.body;

        const dataOrg = await modelOrganization.create({
            org_name: name,
            org_about: about,
        });
        console.log(pic)
        pic.forEach(async item => {
            await modelPic.create({
                id_user: item.id, id_org: dataOrg.dataValues.id_org
            });
        });

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
            include: {
                model: modelUser,
                through: { attributes: [] },
                attributes: ['id_user', 'name'],
                include: {
                    model: modelRole,
                    attributes: ['role_name']
                }
            }
        });

        const data = organization.map(item => ({
            id: item.id_org,
            name: item.org_name,
            about: item.org_about,
            pic: item.users.map(item => ({
                id: item.id_user,
                name: item.name,
                role: item.role.role_name

            }))
        }));

        return res.status(200).json({
            message: 'sukses mendapat data',
            data
        })
    } catch (error) {
        next(error);
    }
};

const deleteOrg = async (req, res, next) => {
    try {
        const { id } = req.query;
        const organization = await modelOrganization.findByPk(id);
        const pic = await modelPic.findAll({
            where: {
                id_org: id
            }
        });

        if (!organization) {
            console.log('data organisasi tidak ditemukan!')
        }
        if (pic.length == 0) {
            console.log('data penanggung jawab tidak ditemukan!')
        }
        
        pic.forEach(item => {
            item.destroy()
        });
        await organization.destroy();

        return res.status(200).json({
            message: 'sukses menghapus data',
        });

    } catch (error) {
        next(error);
    }
};

const updateOrg = async (req, res, next) => {
    try {
        const { id } = req.query;
        const { pic, name, about } = req.body;

        const organization = await modelOrganization.findByPk(id);
        if (!organization) return res.status(404).json({ message: 'data tidak ditemukan' });

        await organization.update({
            org_name: name,
            org_about: about,
        });

        const dataPic = await modelPic.findAll({
            where: {
                id_org: organization.dataValues.id_org
            }
        });

        console.log('dataPic')
        console.log(dataPic)
        console.log('pic dr form')
        console.log(pic)
        if (dataPic.length > 0) {
            // TODO 
            console.log('dataPic lebih dari 0')
        } else {
            dataPic.forEach(async item => {
                await modelPic.create({
                    id_org: organization.dataValues.id_org,
                    id_user: item.id_user
                })
            });
        }

        return res.status(200).json({
            message: 'sukses memperbarui data',
        });

    } catch (error) {
        next(error);
    }
};

export {
    addOrg, getOrg, deleteOrg, updateOrg
};
