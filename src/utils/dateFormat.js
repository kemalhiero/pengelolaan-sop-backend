/**
 * Formats a given date or timestamp into a string with the format "DD/MM/YYYY HH:mm".
 * Returns '-' if the input is null, undefined, or an invalid date.
 *
 * @param {string|number|Date} d - The date value to format. Can be a Date object, timestamp, or date string.
 * @returns {string} The formatted date string or '-' if the input is invalid.
 */
const dateFormat = (d) => {
    // Pengecekan awal untuk null/undefined
    if (!d) {
        return '-';
    }

    try {
        // Untuk handling timestamp string dari Sequelize
        const date = new Date(d);

        // Validasi tambahan untuk memastikan tanggal valid
        if (isNaN(date.getTime())) {
            return '-';
        }

        // Konversi ke timezone lokal
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');

        return `${day}/${month}/${year} ${hours}:${minutes}`;
    } catch (error) {
        console.error('Error formatting date:', error);
        return '-';
    }
};

/**
 * Formats a given date or timestamp into a string with the format "DD MM YYYY".
 * Returns '-' if the input is null, undefined, or an invalid date.
 *
 * @param {string|number|Date} d - The date value to format. Can be a Date object, timestamp, or date string.
 * @returns {string} The formatted date string or '-' if the input is invalid.
 */
const dateOnlyFormat = (d) => {
    // Pengecekan awal untuk null/undefined
    if (!d) {
        return '-';
    }

    try {
        // Untuk handling timestamp string dari Sequelize
        const date = new Date(d);

        // Validasi tambahan untuk memastikan tanggal valid
        if (isNaN(date.getTime())) {
            return '-';
        }

        const monthNames = [
            'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
            'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
        ];

        // Konversi ke timezone lokal
        const day = date.getDate();
        const month = monthNames[date.getMonth()];
        const year = date.getFullYear();

        return `${day} ${month} ${year}`;
    } catch (error) {
        console.error('Error formatting date:', error);
        return '-';
    }
};

export { dateFormat, dateOnlyFormat };
