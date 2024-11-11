import mongoose from 'mongoose';
import getToken from '../helpers/get-token.js';
import getUserByToken from '../helpers/get-user-by-token.js';
import Pet from '../models/Pet.js';

const ObjectId = mongoose.Types.ObjectId;

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

    static async getAllUserPets(request, response) {
        const token = getToken(request);
        const user = await getUserByToken(token);

        const myPets = await Pet.find({ 'user._id': user._id }).sort('-createdAt');

        return response.status(200).json({ myPets });
    }

    static async getUserAdoptions(request, response) {
        const token = getToken(request);
        const user = getUserByToken(token);

        const adoptPets = await Pet.find({ 'adopter._id': user._id }).sort('-createdAt');

        return response.status(200).json({ adoptPets });
    }

    static async getPetById(request, response) {
        const id = request.params.id;

        // Checando se ID é válido
        if (!ObjectId.isValid(id)) {
            return response.status(422).json({ message: 'ID inválido' });
        }

        const pet = await Pet.findById(id);

        // Checando se Pet existe
        if (!pet) {
            return response.status(404).json({ message: 'Pet não encontrado' });
        }

        return response.status(200).json({
            pet
        });
    }
}