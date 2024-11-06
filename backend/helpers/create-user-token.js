import jwt from 'jsonwebtoken';

const createUserToken = async (user, request, response) => {
    // Criando Token
    const token = jwt.sign({
        name: user.name,
        id: user._id
    }, 'secret_secret');

    // Retornando Token
    return response.status(200).json({
        message: 'Autenticado com sucesso',
        token: token,
        userId: user._id
    });
}

export default createUserToken;