import admin from 'firebase-admin'
import serviceAcount from '../../configFirebase.json' assert {type: "json"};

try {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAcount)
      });
    console.log('Base de datos FIREBASE conectada')
} catch (error) {
    console.log('Error en la conexion de FIREBASE', error)
}

const db = admin.firestore()

class ContenedorFirebase{
    constructor(nombreColleccion){
        this.colleccion = db.collection(nombreColleccion)
    }

    async leer(id){
        console.log(id)
        if(id){
            if (id.length==20) {
                console.log('CON ID')
                try {
                    const doc= this.colleccion.doc(id)
                    const item= await doc.get()
                    console.log(item)
                    let it= item.data()
                    !it? it= [] : it= [{_id: item.id,...it}]
                    return it
                } catch (error) {
                    console.log(`Este es el error en FIREBASE-LEER- CON ID`, error)
                }
            }else{
                console.log('CON OBJETO')
                try {
                for (const key in id) {
                    const documentos= await this.colleccion.where(`${key}`, '==', `${id[key]}`).get(id)
                    const arraydocumentos= documentos.docs
                    const listaItem = arraydocumentos.map((e)=>{
                        return {_id: e.id,...(e.data())}
                    })

                    console.log('listaItem')
                    console.log(listaItem)
                    console.log('listaItem')
                    return listaItem
                }
                } catch (error) {
                    console.log(`Este es el error en FIREBASE-LEER-CON OBJETO`, error)
                }
            }
        }else{
            console.log('VACIO')
            try {
                const documentos= await this.colleccion.get()
                const arraydocumentos= documentos.docs
                const listaItem = arraydocumentos.map((e)=>{
                    return {_id: e.id,...(e.data())}
                })
                return listaItem
                
            } catch (error) {
                console.log(`Este es el error en FIREBASE-LEER-VACIO`, error)
            }
        }      
    }
    //     if (id) {
    //         try {
    //             const doc= this.colleccion.doc(id)
    //             const item= await doc.get()
    //             console.log(item)
    
    //             let it= item.data()
    //             !it? it= [] : it= [{_id: item.id,...it}]
    //             return it
                
    //         } catch (error) {
    //             console.log(`Este es el error en FIREBASE-LEER`, error)
    //         }
    //     } else {
    //         const documentos= await this.colleccion.get()
    //         const arraydocumentos= documentos.docs
    //         const listaItem = arraydocumentos.map((e)=>{
    //             return {_id: e.id,...(e.data())}
    //         })
    //         return listaItem
    //     }
    // }
    
    async guardar(datos) {
        let productoAgregado = await this.colleccion.doc().create(datos)
        return productoAgregado
    }

    async modificar(productoAnterior, productoModificado,tipoDeModificacion) {

        switch (tipoDeModificacion) {
            case '$set':
            let y =productoAnterior
            console.log('productoAnterior')
            console.log(y)
            console.log('productoAnterior._id')  
            console.log(y._id)
            console.log('productoModificado')
            console.log(productoModificado)

                return await  this.colleccion.doc(productoAnterior._id).update(productoModificado)
            case '$push':
                productoAnterior.productos.push(productoModificado.productos)

                return await  this.colleccion.doc(productoAnterior._id).update(productoAnterior)
            default:
                break;
        }

        return await  this.colleccion.doc(productoAnterior._id).update(productoModificado)
    }

    async eliminar(id){
        const productos= await this.colleccion.doc(id).delete()
        //console.log(productos)
        return productos
    }
}

export default ContenedorFirebase