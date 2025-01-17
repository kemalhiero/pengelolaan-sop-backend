import modelOrganization from '../models/organization.js';
import modelUser from '../models/users.js';
import modelRole from '../models/roles.js';

const addOrg = async (req, res, next) => {
    try {
        const { pic, name, about } = req.body;

        const dataOrg = await modelOrganization.create({
            org_name: name,
            org_about: about,
        });
        pic.forEach(async item => {
            const userPic = await modelUser.findByPk(item.id);
            if (!userPic) {
                return res.status(404).json({ message: 'user yang dipilih tidak ada' });
            } else {
                userPic.update({ id_org_pic: dataOrg.dataValues.id_org })
            }
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
        });
    } catch (error) {
        next(error);
    }
};

const deleteOrg = async (req, res, next) => {
    try {
        const { id } = req.query;
        const organization = await modelOrganization.findByPk(id);
        if (!organization) {
            return res.status(404).json({ message: 'Data organisasi tidak ditemukan!' });
        }

        // Update semua id_org_pic ke NULL
        await modelUser.update({ id_org_pic: null }, {
            where: { id_org_pic: id }
        });

        // Hapus data organisasi
        await organization.destroy();

        return res.status(200).json({
            message: 'Sukses menghapus data organisasi',
        });
    } catch (error) {
        next(error);
    }
};

const updateOrg = async (req, res, next) => {
    try {
        const { id } = req.query;
        const { pic, name, about } = req.body;

        // Cari organisasi berdasarkan ID
        const organization = await modelOrganization.findByPk(id);
        if (!organization) return res.status(404).json({ message: 'Data organisasi tidak ditemukan!' });

        // Update data organisasi
        await organization.update({
            org_name: name,
            org_about: about,
        });

        // Ambil data PIC yang ada di database
        const dataPic = await modelUser.findAll({
            where: { id_org_pic: id },
        });

        // Extract daftar ID user dari database dan request
        const existingIds = dataPic.map(item => item.id_user);
        const newIds = pic.map(item => item.id);

        // Hapus data PIC yang tidak ada di request
        const idsToRemove = existingIds.filter(id => !newIds.includes(id));
        if (idsToRemove.length > 0) {
            await modelUser.update(
                { id_org_pic: null },
                { where: { id_user: idsToRemove } }
            );
        }

        // Tambahkan data PIC baru yang tidak ada di database
        const idsToAdd = newIds.filter(id => !existingIds.includes(id));
        for (const id of idsToAdd) {
            await modelUser.update(
                { id_org_pic: organization.id_org },
                { where: { id_user: id } }
            );
        }

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
