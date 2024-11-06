import mongoose from 'mongoose';

async function main() {
    await mongoose.connect('mongodb://root:secret@localhost:27017/getapet?authSource=admin');
    console.log('Conexão estabelecida com o mongoose');
}

main().catch((error) => console.log(error));

export default mongoose;