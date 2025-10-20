import modelSop from '../models/sop.js';
import modelSopDetail from '../models/sop_details.js';
import modelOrganization from '../models/organization.js';
import modelRelatedSop from '../models/relation_other_sop.js';
import { validateUUID } from '../utils/validation.js';

const addRelatedSop = async (req, res, next) => {
    try {
        const { id_sop_detail, related_sop } = req.body;
        console.log(req.body);
        if (!related_sop || !id_sop_detail) {
            console.error('id POS detail harus berupa uuid dan ID related POS harus berupa angka')
            return res.status(400).json({ message: 'id POS detail harus berupa uuid dan ID related POS harus berupa angka' })
        };

        const [dataSop, dataSopDetail] = await Promise.all([
            modelSop.findByPk(related_sop, { attributes: ['id_sop'] }),
            modelSopDetail.findByPk(id_sop_detail, { attributes: ['id_sop_detail'] })
        ]);

        if (!dataSop || !dataSopDetail) {
            console.error('Data SOP atau SOP Detail tidak ditemukan!')
            return res.status(404).json({ message: 'Data SOP atau SOP Detail tidak ditemukan!' })
        }

        const existingRelation = await modelRelatedSop.findOne({
            where: {
                id_sop_detail,
                id_sop: related_sop
            }
        });

        if (existingRelation) {
            return res.status(409).json({ message: 'SOP terkait sudah ada.' });
        }

        await modelRelatedSop.create({
            id_sop_detail, id_sop: related_sop
        });

        res.status(201).json({
            message: 'sukses menambahkan data'
        });

    } catch (error) {
        next(error);
    }
};

const getRelatedSop = async (req, res, next) => {
    try {
        const { id } = req.params;

        const sopDetailWithRelations = await modelSopDetail.findByPk(id, {
            attributes: [ 'id_sop_detail' ],
            include: {
                model: modelSop,
                as: 'RelatedSop', // Gunakan alias yang didefinisikan di db_association.js
                attributes: [ 'id_sop', 'name' ],
                through: { 
                    attributes: [], // Tidak perlu menyertakan atribut dari tabel penghubung
                },
                include: {
                    model: modelOrganization,
                    attributes: [ 'name' ]
                }
            }
        });

        let data = [];
        // Akses data melalui alias 'RelatedSop' dan periksa apakah array tersebut ada dan tidak kosong
        if (!sopDetailWithRelations || !sopDetailWithRelations.RelatedSop || sopDetailWithRelations.RelatedSop.length === 0) {
            console.log('Data SOP terkait tidak ditemukan!');
        } else {
            console.log('Sukses mengambil data SOP terkait');
            // Lakukan map pada array 'RelatedSop' yang berisi data SOP terkait
            data = sopDetailWithRelations.RelatedSop.map(item => ({
                id: item.id_sop,
                name: item.name,
                org_name: item.organization.name
            }));
        }

        res.status(200).json({
            message: 'sukses mengambil data',
            data
        });
        
    } catch (error) {
        next(error);
    }
};

const deleteRelatedSop = async (req, res, next) => {
    try {
        const { id_sop_detail, id_sop } = req.params;
        
        const deletedCount = await modelRelatedSop.destroy({ where: { id_sop_detail, id_sop } });
        if (!deletedCount) {
            console.error('Data POS terkait gagal dihapus karena tidak ditemukan!')
            return res.status(404).json({ message: 'Data POS terkait gagal dihapus karena tidak ditemukan!' })
        };

        return res.status(200).json({
            message: 'sukses menghapus data',
        });

    } catch (error) {
        next(error);
    }
};

export { addRelatedSop, getRelatedSop, deleteRelatedSop };
