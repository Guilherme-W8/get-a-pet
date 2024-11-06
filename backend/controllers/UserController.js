import bcrypt from 'bcrypt';
import User from '../models/User.js';
import createUserToken from '../helpers/create-user-token.js';

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
}