import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Helpers
import getToken from '../helpers/get-token.js';
import createUserToken from '../helpers/create-user-token.js';
import getUserByToken from '../helpers/get-user-by-token.js';

export default class UserController {
    static async register(request, response) {
        const { name, email, phone, password, confirmpassword } = request.body;

        if (!name) {
            return response.status(422).json({ message: 'O nome precisa ser preenchido' });
        }

        if (!email) {
            return response.status(422).json({ message: 'O email precisa ser preenchido' });
        }

        if (!phone) {
            return response.status(422).json({ message: 'O número de telefone precisa ser preenchido' });
        }

        if (!password) {
            return response.status(422).json({ message: 'A senha precisa ser preenchida' });
        }

        if (!confirmpassword) {
            return response.status(422).json({ message: 'A confirmação de senha precisa ser preenchida' });
        }

        // Checando se as senhas são iguais
        if (password !== confirmpassword) {
            return response.status(422).json({ message: 'As senhas devem ser iguais' });
        }

        // Checando se o usuário existe (email)
        const userEmailExists = await User.findOne({ email: email });

        if (userEmailExists) {
            return response.status(422).json({ message: 'Email já registrado' });
        }

        // Geração de senha criptografada
        const salt = await bcrypt.genSalt(12);
        const passwordHash = await bcrypt.hash(password, salt);

        // Criando um usuário
        const user = new User({
            name: name,
            email: email,
            phone: phone,
            password: passwordHash
        });

        try {
            const createdUser = await user.save();

            await createUserToken(createdUser, request, response);
        } catch (error) {
            return response.status(500).json({ message: error });
        }
    }

    static async login(request, response) {
        const { email, password } = request.body;

        if (!email) {
            return response.status(422).json({ message: 'O email precisa ser preenchido' });
        }

        if (!password) {
            return response.status(422).json({ message: 'A senha precisa ser preenchida' });
        }

        // Checando se o usuário existe (email)
        const user = await User.findOne({ email: email });

        if (!user) {
            return response.status(422).json({ message: 'Email sem registro' });
        }

        // Checando se a senha é igual a armazenada no banco de dados
        const checkPassword = await bcrypt.compare(password, user.password);

        if (!checkPassword) {
            return response.status(422).json({
                message: 'Senha inválida'
            });
        }

        await createUserToken(user, request, response);
    }

    static async checkUser(request, response) {
        let currentUser;

        if (request.headers.authorization) {
            const token = getToken(request);
            const decoded = jwt.verify(token, 'secret_secret');

            currentUser = await User.findById(decoded.id);

            currentUser.password = undefined;
        } else {
            currentUser = null;
        }

        response.status(200).send(currentUser);
    }

    static async getUserById(request, response) {
        const id = request.params.id;

        const user = await User.findById(id).select("-password");

        if (!user) {
            return response.status(422).json({
                message: 'Usuário não identificado'
            });
        }

        return response.status(200).json({ user });
    }

    static async editUser(request, response) {
        const id = request.params.id;

        const token = getToken(request);
        const user = await getUserByToken(token);

        const { name, email, phone, password, confirmpassword } = request.body;

        // Validações
        if (!name) {
            return response.status(422).json({ message: 'O nome precisa ser preenchido' });
        }

        user.name = name;

        if (!email) {
            return response.status(422).json({ message: 'O email precisa ser preenchido' });
        }

        const emailExists = await User.findOne({ email: email });

        if (user.email !== email && emailExists) {
            return response.status(422).json({ message: 'Utilize outro email' });
        }

        user.email = email;

        if (!phone) {
            return response.status(422).json({ message: 'O número de telefone precisa ser preenchido' });
        }

        user.phone = phone;

        if (password != confirmpassword) {
            return response.status(422).json({ message: 'As senhas não conferem' });
        } else if (password === confirmpassword && password != null) {
            // Criando senha
            const salt = await bcrypt.genSalt(12);
            const passwordHash = await bcrypt.hash(password, salt);

            user.password = passwordHash;
        }

        try {
            await User.findOneAndUpdate(
                { _id: user.id },
                { $set: user },
                { new: true }
            );

            return response.status(200).json({ message: 'Usuário atualizado com sucesso' });
        } catch (error) {
            return response.status(500).json({ message: 'Ocorreu um erro' });
        }
    }
}