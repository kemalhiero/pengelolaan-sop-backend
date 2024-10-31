import modelOrganization from '../models/organization.js';
import modelUser from '../models/users.js'

const addOrg = async (req, res) => {
    try {
        const {id_pic, name, level, about, id_org_parent} = req.body;

        await modelOrganization.create({
            person_in_charge: id_pic,
            org_name: name,
            org_level: level,
            org_about: about,
            id_org_parent
        });

        res.status(200).json({
            message: 'sukses menambahkan data'
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: error.message,
        });
    }
};

const getOrg = async (req, res) => {
    try {
        const organization = await modelOrganization.findAll({
            attributes: {exclude: ['person_in_charge']},
            include: {
                model: modelUser,
                attributes: ['name']
            }
        });

        const flattenedData = organization.map(item => ({
            id: item.id_org,
            name: item.org_name,
            level: item.org_level,
            about: item.org_about,
            org_parent: item.id_org_parent,
            pic: item.user.name
        }));

        return res.status(200).json({
            message: 'sukes mendapat data',
            data: flattenedData,
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: error.message,
        });
    }
};

const deleteOrg = async (req, res) => {
    try {
        const {id} = req.query;
        const organization = await modelOrganization.findByPk(id);

        if (!organization) return res.status(404).json({message: 'data tidak ditemukan'});

        await organization.destroy();

        return res.status(200).json({
            message: 'sukes menghapus data',
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: error.message,
        });        
    }
}

const updateOrg = async (req, res) => {
    try {
        const {id} = req.query;
        const {id_pic, name, level, about, id_org_parent} = req.body;
        const organization = await modelOrganization.findByPk(id);

        if (!organization) return res.status(404).json({message: 'data tidak ditemukan'});

        await organization.update({
            person_in_charge: id_pic,
            org_name: name,
            org_level: level,
            org_about: about,
            id_org_parent
        });

        return res.status(200).json({
            message: 'sukes memperbarui data',
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: error.message,
        });        
    }
}

export {
    addOrg, getOrg, deleteOrg, updateOrg
}
