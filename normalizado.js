import {schema, normalize} from 'normalizr'
import util from'util'

function print (dato){
    console.log(util.inspect(dato,false,50,true))
}

const normalizado= (arrayMensajes)=>{
    let ids =1
    const newArray = arrayMensajes.map((mensaje)=>{
        mensaje.id=ids 
        ids++
        return mensaje
    })
    const chatConIds = {
        id: 'mjs',
        mensajes: newArray
    }
    const autor = new schema.Entity('autores')
    const mensaje = new schema.Entity('mensajes',{
        author: autor
    })
    const grupoMensajes = new schema.Entity('chats',{
        mensajes: [mensaje]
    })
    console.log('DATA NORMAL')
    print(chatConIds)
    console.log(JSON.stringify(chatConIds).length)
    
    const mensajesNormalizados= normalize (chatConIds,grupoMensajes)
    console.log('DATA normalizada')
    print(mensajesNormalizados)
    console.log(JSON.stringify(mensajesNormalizados).length)
 
    return mensajesNormalizados
  }
export default normalizado