import modelOrganization from '../models/organization.js';
import modelUser from '../models/users.js';
import modelRole from '../models/roles.js';

const addOrg = async (req, res) => {
    try {
        const { id_pic, name, level, about, id_org_parent } = req.body;

        await modelOrganization.create({
            person_in_charge: id_pic,
            org_name: name,
            org_level: level,
            org_about: about,
            id_org_parent
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
            attributes: { exclude: ['person_in_charge'] },
            include: {
                model: modelUser,
                attributes: ['name'],
                include: {
                    model: modelRole,
                    attributes: ['role_name']
                }
            }
        });

        const flattenedData = organization.map(item => ({
            id: item.id_org,
            name: item.org_name,
            level: item.org_level,
            about: item.org_about,
            org_parent: item.id_org_parent,
            pic: {
                name: item.user.name,
                role: item.user.role.role_name
            }
        }));

        return res.status(200).json({
            message: 'sukses mendapat data',
            data: flattenedData
        })
    } catch (error) {
        next(error);
    }
};

const deleteOrg = async (req, res) => {
    try {
        const { id } = req.query;
        const organization = await modelOrganization.findByPk(id);

        if (!organization) return res.status(404).json({ message: 'data tidak ditemukan' });

        await organization.destroy();

        return res.status(200).json({
            message: 'sukses menghapus data',
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: error.message,
        });
    }
};

const updateOrg = async (req, res) => {
    try {
        const { id } = req.query;
        const { id_pic, name, level, about, id_org_parent } = req.body;
        const organization = await modelOrganization.findByPk(id);

        if (!organization) return res.status(404).json({ message: 'data tidak ditemukan' });

        await organization.update({
            person_in_charge: id_pic,
            org_name: name,
            org_level: level,
            org_about: about,
            id_org_parent
        });

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
