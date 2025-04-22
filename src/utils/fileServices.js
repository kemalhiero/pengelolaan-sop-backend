import { env } from 'node:process';
import sharp from 'sharp';
import { PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import s3Client from '../config/s3Client.js';

/**
 * Resize image buffer.
 * @param {Buffer} buffer - Image buffer.
 * @param {number} width - Target width.
 * @param {number} height - Target height.
 * @returns {Promise<Buffer>}
 */
export const resizeImage = async (buffer, width, height) => {
    return sharp(buffer)
        .resize(width, height)
        .toBuffer();
};

/**
 * Crop image buffer.
 * @param {Buffer} buffer - Image buffer.
 * @param {number} width - Crop width.
 * @param {number} height - Crop height.
 * @param {number} left - Left offset.
 * @param {number} top - Top offset.
 * @returns {Promise<Buffer>}
 */
export const cropImage = async (buffer, width, height, left = 0, top = 0) => {
    return sharp(buffer)
        .extract({ width, height, left, top })
        .toBuffer();
};

/**
 * Crop image buffer to the center.
 * @param {Buffer} buffer - Image buffer.
 * @param {number} width - Crop width.
 * @param {number} height - Crop height.
 * @returns {Promise<Buffer>}
 */
export const cropImageCenter = async (buffer, width, height) => {
    const image = sharp(buffer);
    const metadata = await image.metadata();
    const left = Math.floor((metadata.width - width) / 2);
    const top = Math.floor((metadata.height - height) / 2);
    return image.extract({ width, height, left, top }).toBuffer();
};

/**
 * Uploads a file to the specified folder in the Cloudflare R2 bucket.
 *
 * @param {Object} file - The file object to be uploaded.
 * @param {string} [folder='uploads'] - The folder where the file will be uploaded. Defaults to 'uploads'.
 * @returns {Promise<string>} - The URL of the uploaded file.
 * @throws {Error} - Throws an error if the file upload fails.
 */
export const uploadFile = async (file, folder = 'uploads') => {
    try {
        // Generate a random 16-character alphanumeric string for the filename
        const randomName = [...Array(16)]
            .map(() => Math.random().toString(36)[2])
            .join('');
        // Get file extension from original filename if available
        const ext = file.originalname
            ? '.' + file.originalname.split('.').pop()
            : '';
        const params = {
            Bucket: env.CLOUDFLARE_R2_BUCKET_NAME,
            Key: `${folder}/${randomName}${ext}`,
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
export const deleteFile = async (fileUrl, folder = 'uploads') => {
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
