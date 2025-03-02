import multer from "multer";
import fs from "fs";
import path from "path";

// Ensure the directory exists before storing files
const uploadDir = "uploads/medical-reports/";
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true }); // Creates directory if it doesn't exist
}

// Multer Storage Configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir); // Store in 'uploads/medical-reports/'
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        cb(null, `${Date.now()}-${file.fieldname}${ext}`);
    }
});

// Allow only Images, PDFs, and Audio files
const fileFilter = (req, file, cb) => {
    const allowedTypes = ["image/", "application/pdf", "audio/"];
    
    if (allowedTypes.some(type => file.mimetype.startsWith(type))) {
        cb(null, true);
    } else {
        cb(new Error("Only images, PDFs, and audio files are allowed"), false);
    }
};

// File size limit (optional) – Adjust as needed (e.g., 5MB)
const upload = multer({
    storage,
    fileFilter,
   // 5MB limit
});

export default upload;
