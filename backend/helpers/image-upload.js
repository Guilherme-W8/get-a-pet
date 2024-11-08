import multer from 'multer';
import path from 'path';

const imageStorage = multer.diskStorage({
    destination: (request, file, cb) => {
        let folder = "";

        if (request.baseUrl.includes('users')) {
            folder = 'users';
        } else if (request.baseUrl.includes('pets')) {
            folder = 'pets';
        }

        cb(null, `public/images/${folder}`);
    },
    filename: (request, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname))
    }
});

const imageUpload = multer({
    storage: imageStorage,
    fileFilter(request, file, cb) {
        if (!file.originalname.match(/\.(png|jpg)$/)) {
            return cb(new Error("Apenas imagem JPG ou PNG são aceitas"))
        }
        cb(undefined, true);
    }
});

export default imageUpload;