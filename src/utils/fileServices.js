// fileService.js
import { PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { env } from 'node:process';
import s3Client from '../config/s3Client.js';

const uploadFile = async (file, folder = 'uploads') => {
    try {
        const params = {
            Bucket: env.CLOUDFLARE_R2_BUCKET_NAME,
            Key: `${folder}/${Date.now()}-${file.originalname || file.name}`, // Nama file unik
            Body: file.buffer,
            ContentType: file.mimetype,
        };

        await s3Client.send(new PutObjectCommand(params));

        const fileUrl = params.Key;
        return fileUrl;
    } catch (error) {
        console.error('Gagal mengunggah file:', error);
        throw new Error('Gagal mengunggah file');
    }
};

const deleteFile = async (fileUrl, folder = 'uploads') => {
    try {
        if (!fileUrl) {
            throw new Error('URL file tidak valid');
        }

        const fileKey = fileUrl.split('/').pop(); // Ambil key file dari URL
        const params = {
            Bucket: env.CLOUDFLARE_R2_BUCKET_NAME,
            Key: `${folder}/${fileKey}`, // Sesuaikan folder jika diperlukan
        };

        await s3Client.send(new DeleteObjectCommand(params));
        return true;
    } catch (error) {
        console.error('Gagal menghapus file:', error);
        throw new Error('Gagal menghapus file');
    }
};

export { uploadFile, deleteFile };
