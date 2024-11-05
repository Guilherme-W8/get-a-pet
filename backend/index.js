import express from 'express';
import cors from 'cors';

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

app.listen(5000);