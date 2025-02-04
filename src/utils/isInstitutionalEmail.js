/**
 * Validasi apakah email berasal dari domain institusi yang diperbolehkan
 * @param {string} email - Email yang akan divalidasi
 * @returns {boolean} - True jika email valid, False jika tidak
 */
const isInstitutionalEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@(student\.unand\.ac\.id|it\.unand\.ac\.id)$/;
    return emailRegex.test(email);
};

export default isInstitutionalEmail;
