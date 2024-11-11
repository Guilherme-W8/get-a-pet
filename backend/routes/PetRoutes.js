import express from 'express';
import PetController from '../controllers/PetController.js';

// Middlewares
import checkToken from '../helpers/verify-token.js';
import imageUpload from '../helpers/image-upload.js';
import Pet from '../models/Pet.js';

const router = express.Router();

// Routes
router.post('/create', imageUpload.array('images'), checkToken, PetController.create);
router.get('/', PetController.getAll);
router.get('/mypets', checkToken, PetController.getAllUserPets);
router.get('/myadoptions', checkToken, PetController.getUserAdoptions);
router.get('/:id', PetController.getPetById);
router.delete('/:id', checkToken, PetController.removePetById);

export default router;