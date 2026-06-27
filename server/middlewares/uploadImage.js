//@ts-nocheck
import multer from "multer";

const upload = (imageType) => {

    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, imageType === 'restaurantImage'
                ? 'app-data/restaurants-images'
                : 'app-data/items-images');
        },
        filename: (req, file, cb) => {
            cb(null, Date.now() + '-' + file.originalname);
        }
    });

    return multer({ storage: storage });
}

export default upload;