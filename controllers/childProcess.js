import random from 'random'

const calculo = (cant)=>{
    let obj={}
    for (let i = 0; i < cant; i++) {
        const aleat =  random.int(1, 1000)
        if (obj[aleat]) {
            obj[aleat]= obj[aleat] +1
        }else{
            obj[aleat] = 1 
        }
    }
    return obj
}

process.on('message', cant=>{
    const cantParse = (Number(cant))
    let objeto;
    if (!isNaN(cantParse)) {
        objeto = calculo(cant)
    } else {
        objeto = calculo(1e8)
    }
    process.send(objeto)
})
