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

export default dateFormat;