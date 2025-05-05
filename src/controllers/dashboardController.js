import modelOrganization from '../models/organization.js';
import modelSopDetail from '../models/sop_details.js';
import modelSop from '../models/sop.js';

const nominalSopEachOrg = async (req, res, next) => {
    try {
        const organization = await modelOrganization.findAll({
            attributes: ['name'],
            include: {
                model: modelSop,
                attributes: ['id_sop'],
                where: {
                    is_active: 1        // hanya sop yang berlaku yang ditampilkan, karena ini bersifat publik
                },
                include: {
                    model: modelSopDetail,
                    attributes: [['id_sop_detail', 'id']],
                    where: {
                        status: 1        // hanya sop yang berlaku yang ditampilkan, karena ini bersifat publik
                    },
                }
            }
        });

        const data = organization.map(item => ({
            name: item.name,
            total_sop: item.sops.reduce((total, sop) => {
                return total + sop.sop_details.length;
            }, 0)
        }));

        return res.status(200).json({
            message: 'sukses mendapat data',
            data
        });
    } catch (error) {
        next(error)
    }
};

const sopDistributionByStatus = async (req, res, next) => {
    try {
        const dataSop = await modelSopDetail.findAll({
            attributes: ['status'],
            include: [
                {
                    model: modelSop,
                    attributes: ['is_active']
                },
            ]
        });

        // Inisialisasi counter
        const result = {
            tidak_berlaku: 0,
            berlaku: 0,
            proses: 0
        };

        dataSop.forEach(item => {
            const is_active = item.sop.is_active;
            const status = item.status;

            if (is_active === 0 || status === 0) {
                result.tidak_berlaku += 1;
            } else if (is_active === 1 && status === 1) {
                result.berlaku += 1;
            } else {
                result.proses += 1;
            }
        });

        return res.status(200).json({
            message: 'sukses mendapatkan data',
            data: result
        });
    } catch (error) {
        next(error)
    }
};

export { nominalSopEachOrg, sopDistributionByStatus };
