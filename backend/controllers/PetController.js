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

    static async removePetById(request, response) {
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

        // Checando se o user logado cadastrou o pet
        const token = getToken(request);
        const user = await getUserByToken(token);

        if (pet.user._id.toString() !== user._id.toString()) {
            return response.status(422).json({ message: 'Erro ao processar solicitação' });
        }

        await Pet.findByIdAndDelete(id);

        return response.status(200).json({ message: 'Pet removido com sucesso' });
    }

    static async updatePet(request, response) {
        const id = request.params.id;

        const { name, age, weight, color, available } = request.body;

        // Images upload
        const images = request.files;

        const updatedData = {

        }

        // Checando se ID é válido
        if (!ObjectId.isValid(id)) {
            return response.status(422).json({ message: 'ID inválido' });
        }

        // Checando se Pet existe
        const pet = await Pet.findById(id);

        if (!pet) {
            return response.status(404).json({ message: 'Pet não encontrado' });
        }


        // Checando se o user logado cadastrou o pet
        const token = getToken(request);
        const user = await getUserByToken(token);

        if (pet.user._id.toString() !== user._id.toString()) {
            return response.status(422).json({ message: 'Erro ao processar solicitação' });
        }

        // Validação
        if (!name) {
            return response.status(422).json({ message: 'O nome tem que ser preechido' });
        } else {
            updatedData.name = name;
        }


        if (!age) {
            return response.status(422).json({ message: 'A idade tem que ser preechida' });
        } else {
            updatedData.age = age;
        }

        if (!weight) {
            return response.status(422).json({ message: 'O peso tem que ser preechido' });
        } else {
            updatedData.weight = weight;
        }


        if (!color) {
            return response.status(422).json({ message: 'A cor tem que ser preechida' });
        } else {
            updatedData.color = color;
        }


        if (images.length > 0) {
            updatedData.images = [];
            images.map((image) => {
                updatedData.images.push(image.filename);
            });
        }

        await Pet.findByIdAndUpdate(id, updatedData);

        return response.status(200).json({ message: 'Pet atualizado com sucesso' });

    }

    static async schedule(request, response) {
        const id = request.params.id;

        // Checando se ID é válido
        if (!ObjectId.isValid(id)) {
            return response.status(422).json({ message: 'ID inválido' });
        }

        // Checando se Pet existe
        const pet = await Pet.findById(id);

        if (!pet) {
            return response.status(404).json({ message: 'Pet não encontrado' });
        }

        // Checando se o user logado cadastrou o pet
        const token = getToken(request);
        const user = await getUserByToken(token);

        if (pet.user._id.equals(user._id)) {
            return response.status(422).json({ message: 'Não pode agendar visita com o próprio Pet' });
        }

        // Checando se o user ja agendou uma visita
        if (pet.adopter) {
            if (pet.adopter._id.equals(user._id)) {
                return response.status(422).json({ message: 'Visita já agendada para este pet' });
            }
        }

        // adicionar user para o Pet
        pet.adopter = {
            _id: user._id,
            name: user.name,
            image: user.image
        }

        await Pet.findByIdAndUpdate(id, pet);

        return response.status(200).json({ message: `Visita agendada com sucesso. Entre em contato com ${pet.user.name} pelo telefone ${pet.user.phone}` });
    }

    static async concludeAdoption(request, response) {
        const id = request.params.id;

        // Checando se ID é válido
        if (!ObjectId.isValid(id)) {
            return response.status(422).json({ message: 'ID inválido' });
        }

        // Checando se Pet existe
        const pet = await Pet.findById(id);

        if (!pet) {
            return response.status(404).json({ message: 'Pet não encontrado' });
        }

        // Checando se o user logado cadastrou o pet
        const token = getToken(request);
        const user = await getUserByToken(token);

        if (pet.user._id.toString() !== user._id.toString()) {
            return response.status(422).json({ message: 'Erro ao processar solicitação' });
        }

        pet.available = false;

        await Pet.findByIdAndUpdate(id, pet);

        return response.status(200).json({ message: 'Ciclo de adoção finalizado com sucesso' });
    }
}