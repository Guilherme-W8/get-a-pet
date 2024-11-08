import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Pegando usuário a partir do token
const getUserByToken = async (token) => {
    if (!token) {
        return response.status(422).json({ message: 'Acesso negado' });
    }

    const decoded = jwt.verify(token, 'secret_secret');

    const userId = decoded.id;

    const user = await User.findOne({ _id: userId });

    return user;
}

export default getUserByToken;
