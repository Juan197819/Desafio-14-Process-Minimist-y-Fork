import 'dotenv/config'

let daoCarrito,daoProducto,daoMensaje,daoUsuario
console.log(process.env.PERSISTENCIA)

switch (process.env.PERSISTENCIA) {
    case 'mongodb':
        const {default: DaoProductosMongo}= await import('./daos/productos/productosDaoMongoDB.js')    
        const {default: DaoCarritosMongo} = await import('./daos/carritos/carritosDaoMongoDB.js')    
        const {default: DaoMensajesMongo} = await import('./daos/mensajes/mensajesDaoMongoDB.js')    
        const {default: DaoUsuariosMongo} = await import('./daos/usuarios/usuariosDaoMongoDB.js')    
        
        daoProducto= new DaoProductosMongo() 
        daoCarrito = new DaoCarritosMongo()
        daoMensaje = new DaoMensajesMongo()
        daoUsuario = new DaoUsuariosMongo()

    break;

    case 'firebase':
        const {default: DaoProductosFirebase}= await import('./daos/productos/productosDaoFirebase.js')    
        const {default: DaoCarritosFirebase} = await import('./daos/carritos/carritosDaoFirebase.js')
        const {default: DaoMensajesFirebase} = await import('./daos/mensajes/mensajesDaoFirebase.js')    
        const {default: DaoUsuariosFirebase} = await import('./daos/usuarios/usuariosDaoFirebase.js')    

        daoProducto= new DaoProductosFirebase()
        daoCarrito = new DaoCarritosFirebase()
        daoMensaje = new DaoMensajesFirebase()
        daoUsuario = new DaoUsuariosFirebase()

    break;

    default:
        break;
}

export {daoProducto,daoCarrito,daoMensaje, daoUsuario}