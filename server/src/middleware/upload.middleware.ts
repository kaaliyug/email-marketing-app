import multer from "multer";
import path from "path";

const storage = multer.memoryStorage();

const upload = multer({

    storage,

    fileFilter(req, file, cb) {

        const extension = path.extname(file.originalname).toLowerCase();

        if (extension !== ".csv") {

            return cb(
                new Error("Only CSV files are allowed")
            );

        }

        cb(null, true);

    },

});

export default upload;