import mongoose from 'mongoose'
import 'dotenv/config'


try {
    const url = `mongodb://${process.env.HOST_MONGO}:${process.env.PORT_MONGO}/ecommerce` 
    await mongoose.connect(url)
    console.log('Base de datos MongoDB conectada')
} catch (error) {
    console.log('Error en la conexion de MongoDB', error)
}

class ContenedorMongoDb{
    constructor(nombreColleccion, Schema){
        this.colleccion = mongoose.model(nombreColleccion, Schema)
    }
    async leer(id){
        let parametroBusqueda = {}
        if(id){
            if (id.length==24) {
                console.log('CON ID')
                parametroBusqueda = {'_id' :id}  
            }else{
                console.log('CON OBJETO')
                parametroBusqueda=id
            }
        }else{
            console.log('VACIO')
        }
        const productos= await this.colleccion.find(parametroBusqueda, {__v:0})
        
        return productos
    }
    async guardar(datos) {
        let productoAgregado = await this.colleccion.create(datos)
        return productoAgregado
    }
    async modificar(productoAnterior, productoModificado,tipoDeModificacion) {
        switch (tipoDeModificacion) {
            case '$set':
                return await this.colleccion.updateOne(productoAnterior,{$set: productoModificado})
            case '$push':
                return await this.colleccion.updateOne(productoAnterior,{$push: productoModificado})
            default:
                break;
        }
        
    }
    async eliminar(id){
        let parametroBusqueda = {'_id' :id} 
        const productos= await this.colleccion.deleteOne(parametroBusqueda)
        return productos
    }




}
export default ContenedorMongoDb