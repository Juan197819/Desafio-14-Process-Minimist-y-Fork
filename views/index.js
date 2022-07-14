let socket =io.connect()

const mostrarSaludo= ()=>{
  let despedida= `Hasta Luego `;

  document.getElementById('saludo').innerHTML=despedida
  document.getElementById('centroMensajes').remove()
  document.getElementById('boton').remove()
  document.getElementById('borrarElemento1').remove()
  document.getElementById('borrarElemento2').remove()
  document.getElementById('borrarElemento3').remove()
  document.getElementById('borrarElemento4').remove()

  return
}

const agregarMensaje= ()=>{
  let mensajeTexto = document.getElementById('mensaje')

    let mensaje= { 
      author:{  
        id : document.getElementById('email').value,
        nombre : document.getElementById('nombre').value,
        apellido : document.getElementById('apellido').value,
        edad : document.getElementById('edad').value,
        alias : document.getElementById('alias').value,
        avatar : document.getElementById('avatar').value,
      },
      text: mensajeTexto.value
    }
    socket.emit("mensajeNuevo", mensaje);
    mensajeTexto.value=""
    mensajeTexto.focus()
    return false
}

const renderMensajes= (mensajesNormalizados)=>{ 
  const autor = new normalizr.schema.Entity('autores')
  const mensaje = new normalizr.schema.Entity('mensajes',{
      author: autor
  })
  const grupoMensajes = new normalizr.schema.Entity('chats',{
      mensajes: [mensaje]
  })
  const desnormalizada= normalizr.denormalize(mensajesNormalizados.result,grupoMensajes,mensajesNormalizados.entities)
  
  let data,compresion
  if (!desnormalizada) {
    data= []
  } else {
    data= desnormalizada.mensajes
    
    let tamañoNormalizado = ((JSON.stringify(mensajesNormalizados)).length)
    let tamañoOriginal =((JSON.stringify(desnormalizada)).length)
    let porcentajeNormalizado=(tamañoNormalizado*100)/tamañoOriginal
    compresion =100- parseInt(porcentajeNormalizado)
    document.getElementById('compresion').innerHTML= `Compresion: ${compresion}%`;
  }
  const mensajeNuevo = data.map((dato) => { 
      return (`<p><span class="estiloMail">${dato.author.id}</span> - <span class="estiloFecha">${new Date().toLocaleDateString()} / ${new Date().toLocaleTimeString()}</span> - <span class="estiloMensaje">${dato.text}</span><img class="avatar" src="${dato.author.avatar}" alt="avatar"></p>`);
    }).join(" ");
    
  document.getElementById('conversacion').innerHTML= mensajeNuevo;

}

socket.on("mensajes", (data) => {
  renderMensajes(data);
});
