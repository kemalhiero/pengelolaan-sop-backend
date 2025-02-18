// fileService.js
import { PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { env } from 'node:process';
import s3Client from '../config/s3Client.js';

/**
 * Uploads a file to the specified folder in the Cloudflare R2 bucket.
 *
 * @param {Object} file - The file object to be uploaded.
 * @param {string} [folder='uploads'] - The folder where the file will be uploaded. Defaults to 'uploads'.
 * @returns {Promise<string>} - The URL of the uploaded file.
 * @throws {Error} - Throws an error if the file upload fails.
 */
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

/**
 * Deletes a file from the specified folder in the Cloudflare R2 bucket.
 *
 * @param {string} fileUrl - The URL of the file to be deleted.
 * @param {string} [folder='uploads'] - The folder where the file is located. Defaults to 'uploads'.
 * @returns {Promise<boolean>} - Returns true if the file was successfully deleted.
 * @throws {Error} - Throws an error if the file URL is invalid or if the file deletion fails.
 */
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
