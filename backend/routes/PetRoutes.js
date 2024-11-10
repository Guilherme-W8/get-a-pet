import express from 'express';
import PetController from '../controllers/PetController.js';
import checkToken from '../helpers/verify-token.js';

const router = express.Router();


// Routes
router.post('/create', checkToken, PetController.create);

export default router;