import getToken from '../helpers/get-token.js';
import getUserByToken from '../helpers/get-user-by-token.js';
import Pet from '../models/Pet.js';

export default class {
    static async create(request, response) {
        const { name, age, weight, color } = request.body;

        const available = true;

        // Images upload
        const images = request.files;

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

        if (images.length === 0) {
            return response.status(422).json({ message: 'Pelo menos uma imagem tem que ser preechida' });
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

        images.map((image) => {
            pet.images.push(image.filename);
        });

        try {
            const createdPet = await pet.save();
            return response.status(201).json({ message: 'Pet cadastrado com sucesso', createdPet });
        } catch (error) {
            return response.status(500).json({ message: 'Ocorreu um erro', error });
        }
    }

    static async getAll(request, response) {
        const pets = await Pet.find().sort('-createdAt');

        return response.status(200).json({ pets });
    }
}