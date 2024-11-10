import express from 'express';
import cors from 'cors';
import UserRoutes from './routes/UserRoutes.js';
import PetRoutes from './routes/PetRoutes.js';

const app = express();

// Config Express Middlewares JSON response
app.use(express.json());

// Public folder images
app.use(express.static('public'));

// Solve CORS
app.use(cors({
    credentials: true,
    origin: 'http://localhost:3000'
}));

// Routes
app.use('/users', UserRoutes);
app.use('/pets', PetRoutes);

app.listen(5000);