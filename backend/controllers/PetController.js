import Pet from '../models/Pet.js';

export default class {
    static async create(request, response) {
        response.json({ message: 'Estou aqui!' });
    }
}