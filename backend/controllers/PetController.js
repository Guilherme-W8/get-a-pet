import getToken from '../helpers/get-token.js';
import getUserByToken from '../helpers/get-user-by-token.js';
import Pet from '../models/Pet.js';

export default class {
    static async create(request, response) {
        const { name, age, weight, color } = request.body;

        const available = true;

        // Images upload

        // Validação
        if (!name) {
            return response.status(422).json({ message: 'O nome tem que ser preechido' });
        }

        if (!age) {
            return response.status(422).json({ message: 'A idade tem que ser preechida' });
        }

        if (!weight) {
            return response.status(422).json({ message: 'O peso tem que ser preechido' });
        }

        if (!color) {
            return response.status(422).json({ message: 'A cor tem que ser preechida' });
        }

        // Pegar usuário do dono do pet
        const token = getToken(request);
        const user = await getUserByToken(token);

        // Criando Pet com os dados do body
        const pet = new Pet({
            name: name,
            age: age,
            weight: weight,
            color: color,
            available: available,
            images: [],
            user: {
                _id: user._id,
                name: user.name,
                image: user.image,
                phone: user.phone
            }
        });

        try {
            const createdPet = await pet.save();
            return response.status(201).json({ message: 'Pet cadastrado com sucesso', createdPet });
        } catch (error) {
            return response.status(500).json({ message: 'Ocorreu um erro', error });
        }
    }
}