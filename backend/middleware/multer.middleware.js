import multer from 'multer'



const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/medical-reports/"); // Directory to store reports
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

// Allow only PDFs and Images
const fileFilter = (req, file, cb) => {
    if (
        file.mimetype.startsWith("image/") || 
        file.mimetype === "application/pdf" || 
        file.mimetype.startsWith("audio/")
    ) {
        cb(null, true);
    } else {
        cb(new Error("Only images, PDFs, and audio files are allowed"), false);
    }
};

 const upload = multer({ storage, fileFilter });
 export default upload;