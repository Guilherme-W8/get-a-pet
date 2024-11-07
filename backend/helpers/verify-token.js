import jwt from 'jsonwebtoken';
import getToken from './get-token.js';

const checkToken = (request, response, next) => {
    if (!request.headers.authorization) {
        return response.status(401).json({ message: 'Acesso negado' });
    }

    const token = getToken(request);

    if (!token) {
        return response.status(401).json({ message: 'Acesso negado' });
    }

    try {
        const verified = jwt.verify(token, 'secret_secret');
        request.user = verified;
        next();
    } catch (error) {
        return response.status(400).json({ message: 'Token inválido' });
    }
}

export default checkToken;