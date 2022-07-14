import ContenedorMongoDb from '../../contenedores/contenedorMongoDB.js'
import mongoose from 'mongoose'

const schemaCarritos= new mongoose.Schema({
    
    timestamp: {type: Number, required: true},
    productos:{type: Array, required: true}
})
class DaoCarritosMongo extends ContenedorMongoDb{
    constructor(){
        super('Carritos', schemaCarritos)
    }
}



export default DaoCarritosMongo
