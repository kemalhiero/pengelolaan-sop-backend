// Fungsi untuk memvalidasi apakah teks diawali dengan huruf
const validateText = (text) => {
    const regex = /^[^a-zA-Z]/; // Karakter pertama harus huruf
    return !regex.test(text);   // Return true jika valid, false jika tidak valid
};

// Ekspor fungsi agar bisa digunakan di file lain
export { validateText };
