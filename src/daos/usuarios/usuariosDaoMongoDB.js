import ContenedorMongoDb from '../../contenedores/contenedorMongoDB.js'
import mongoose from 'mongoose'

const schemaUsuarios= new mongoose.Schema({
    nombre: {type: String, required: true},
    username: {type: String, required: true},
    password: {type: String, required: true},
})

 class DaoUsuariosMongo extends ContenedorMongoDb{
    constructor(){
        super('Usuarios', schemaUsuarios)
    }
}

export default DaoUsuariosMongo