import express from 'express';
import PetController from '../controllers/PetController.js';

// Middlewares
import checkToken from '../helpers/verify-token.js';
import imageUpload from '../helpers/image-upload.js';

const router = express.Router();

// Routes
router.post('/create', imageUpload.array('images'), checkToken, PetController.create);
router.get('/', PetController.getAll);
router.get('/mypets', checkToken, PetController.getAllUserPets);
router.get('/myadoptions', checkToken, PetController.getUserAdoptions);

export default router;