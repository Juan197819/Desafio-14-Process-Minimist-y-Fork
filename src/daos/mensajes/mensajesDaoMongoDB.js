import ContenedorMongoDb from '../../contenedores/contenedorMongoDB.js'
import mongoose from 'mongoose'

const schemaMensajes= new mongoose.Schema({
     
    author:{
        id: {type: String, required: true},
        nombre: {type: String, required: true},
        apellido: {type: String, required: true},
        edad: {type: Number, required: true},
        alias: {type: String, required: true}, 
        avatar: {type: String, required: true}
    }, 
    text: {type: String},
})

class DaoMensajesMongo extends ContenedorMongoDb{
    constructor(){
        super('Mensajes', schemaMensajes)
    }
}

export default DaoMensajesMongo