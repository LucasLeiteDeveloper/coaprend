const multer = require('multer');
const path = require('path');

// Configurar storage para multer (armazenamento em memória)
const storage = multer.memoryStorage();

// Filtro para verificar se é uma imagem
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Apenas arquivos de imagem são permitidos!'), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limite
    }
});

module.exports = upload;