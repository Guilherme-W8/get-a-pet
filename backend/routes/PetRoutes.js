import express from 'express';
import PetController from '../controllers/PetController.js';

const router = express.Router();

// Routes
router.post('/create', PetController.create);

export default router;