const multer = require('multer');
const path = require('path');

// Configure multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'api/public/certsUploads/'); // Directory to save uploaded certs
    },
    filename: (req, file, cb) => { 
        const originalName = path.parse(file.originalname).name; 
        const extension = path.extname(file.originalname);
        const newFileName = `${originalName}-${Date.now()}${extension}`
        cb(null, newFileName); 
    }
});

// Create multer instance
const upload = multer({ storage: storage });

module.exports = upload;
