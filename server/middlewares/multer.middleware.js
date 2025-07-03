import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Set up storage engine for multer
const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            const uploadPath = path.join(__dirname, '../public/images');
            cb(null, uploadPath)
        },
        filename: function (req, file, cb) {
            cb(null, file.originalname)
        }
    })

    const limits = { fileSize: 10000000 }; // 10MB limit
    
    export const upload = multer({
        storage: storage,
        limits: limits,
    });