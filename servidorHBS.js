import express, {Router} from 'express';
import exphbs from 'express-handlebars';
import {Server as HttpServer} from "http";
import {Server as IOServer} from "socket.io";
import lista from './prodAleatorios.js'
import {daoMensaje, daoUsuario } from './src/index.js';
import normalizado from './normalizado.js'
import session from 'express-session';
import bcrypt from 'bcrypt';
import passport from 'passport';
import {Strategy as LocalStrategy} from 'passport-local';
import parseArgs from 'minimist'
import apiRandom from './controllers/apiRandom.js'


//-------------MINIMIST PARA REC. ARGUMENTOS-----------
const optiones= {
  alias:{
    p: 'port'},
    default:{
      p: 8080
}}
const arg = parseArgs(process.argv.slice(2), optiones)

//------------SETEO DE SERVER----------
const app= express();
const httpServer = new HttpServer(app)
const io = new IOServer(httpServer)

//--------------ROUTER PARA NUMEROS ALEATORIOS-----------
const routerApiRandoms = Router()
app.use('/api/randoms',routerApiRandoms)
routerApiRandoms.use(express.json())
routerApiRandoms.use(express.urlencoded({extended: true}))

//--------------SETEO DE VISTAS------------
app.engine('handlebars',exphbs.engine())
app.use(express.static('views'))
app.set('view engine','handlebars')
app.set('views', './views')
app.use(express.json())
app.use(express.urlencoded({extended: true})) 

//-----------SETEO DE PASSPORT-SESION---------
app.use(session({
  
  secret: 'secreto', 
  cookie:{
    httpOnly:false,
    secure:false,
    //maxAge: 10000
  },  
  rolling:true,
  resave:true,
  saveUninitialized:false,
}))  

app.use(passport.initialize())
app.use(passport.session())

passport.serializeUser((username,done)=>done(null, username.username))
passport.deserializeUser((username,done)=>{
  done(null, username)}
)

//--------------PASSPORT STRATEGIES-----------
//--------------------------------------------

//---------------STRATEGY DE REGISTRO------------
passport.use('registro', new LocalStrategy({
  passReqToCallback:true
  }, async (req,username,password,done)=>{
    let user;
    try {
      [user] = await daoUsuario.leer({username}) 
      console.log(`Lectura de registros correcta`)
    } catch (error) {
      console.log(user)
      console.log(`Este es el error al leer registros de BD ` + error)
    }
  if (user) {
    console.log('Usuario ya registrado')
    return done(null, false)
  }
  const usuarioNuevo= {
    nombre:req.body.nombre,
    username: username,
    password: bcrypt.hashSync(password, bcrypt.genSaltSync(10))
  }
  try {
   await daoUsuario.guardar(usuarioNuevo)
   console.log('REGISTRO EXITOSO')
  } catch (error) {
    console.log('este es  el error al guardar usuarioNuevo')
    console.log(error)
  }
  return done(null, usuarioNuevo)
}))  

//---------------STRATEGY DE LOGUEO------------
passport.use('logueo', new LocalStrategy( async (username,password,done)=>{
  
  let [user]= (await daoUsuario.leer({username}))    
console.log(user)
  if(!user || !bcrypt.compareSync(password, user.password)){
    console.log(user)
    console.log('Usuario no encontrado')
    return done(null, false)
  }
  console.log('LOGUEO EXITOSO')
  return done(null, user)
})) 

//---------------MIDDLEWARE DE AUTENTICACION---------------------  
function auth(req, res, next){
  if (req.isAuthenticated()) {
    console.log('USUARIO AUTENTICADO') 
    next()
  }else{
    console.log('USUARIO NO AUTENTICADO, DEBE LOGUEARSE')
    res.redirect('/login')
  }
}

//------------------------------RUTAS---------------------------------

//-------------REGISTRO--------------
const passportAuthRegister =passport.authenticate('registro',{failureRedirect:'/errorRegistro'})  

app.get('/register', (req, res) => {
  res.render("register");
})  

app.post('/register', passportAuthRegister, (req, res) => {
  res.redirect('/login')
})  

app.get('/errorRegistro',(req, res) => {
  res.render("errorRegistro");
})  

//-------------LOGUEO----------------
const passportAuthLogin=  passport.authenticate('logueo',{failureRedirect:'/errorLogin'})

app.get('/', auth,(req, res) => {
  res.redirect('/centroMensajes')
})

app.get('/login', (req, res) => {
  res.render("login");
})

app.post('/login', passportAuthLogin, async (req, res) => {
  const [{nombre}]= await daoUsuario.leer({username: req.body.username})
  console.log(nombre)
  const nombreMayus= nombre.toUpperCase()
  req.session.nombre= nombreMayus
  res.redirect('/centroMensajes')
})

app.get('/errorLogin', (req, res) => {
  res.render('errorLogin')
})

//--------------DESLOGUEO--------
app.get('/logout',auth, (req, res) => {
  req.session.destroy((err)=>{
    if (!err) {
      setTimeout(()=>{
       return res.redirect('login') 
      },2000) 
    } else {
        res.send('ERROR EN LOGOUT', err )
    }    
    console.log('Te deslogueaste con exito')})
})    

//-------------CENTRO DE MENSAJES-- (PAGINA PRINCIPAL) -----------

app.get('/centroMensajes', auth , (req, res) => {
  const usuario = {
    nombre:req.session.nombre,
    email:req.user
  }
  res.render("centroMensajes",usuario);
})

//-------------RUTA INFORMACION---------------

app.get('/info', auth, (req, res) => {
  const info ={
    argumentos: JSON.stringify(arg),
    sistema:process.platform,
    versionNode:process.version,
    memoria:process.memoryUsage().rss,
    pathEjecucion:process.execPath,
    proccessId:process.pid,
    carpetaProyecto:process.cwd()
  }
  res.render("info",info)
})

//-------------GET DE NUMEROS ALEATORIOS -----------

routerApiRandoms.get('/', apiRandom)

//-------------GET DE PRODUCTOS ALEATORIOS -----------

app.get('/api/productos-test',auth, (req, res) => {
    
  let tablaProductos=lista()
  res.render("tablaAleatoria", {tablaProductos});
})

//------------------WEBSOCKETS------------------------------

let mensajes1=[]
let mensajesNormalizados;

io.on("connection", (socket) => { 
  console.log("Usuario Conectado");

  if (!mensajes1.length) {
    mensajesNormalizados=[]
  } else {
    mensajesNormalizados= normalizado(mensajes1)
  }
  socket.emit("mensajes",mensajesNormalizados);
  
  socket.on("mensajeNuevo", (newMessage) => {
    mensajes1.push(newMessage);
    mensajesNormalizados= normalizado(mensajes1)

    daoMensaje.guardar(newMessage)
    io.sockets.emit("mensajes", mensajesNormalizados);
  });
});

//---------------SERVER LISTEN------------------------------

const PORT=process.env.PORT || arg.port

const connectedServer = httpServer.listen(PORT, () => {
  console.log(arg)
  console.log(`Servidor con Websockets en el puerto ${connectedServer.address().port}`);
});

connectedServer.on("error", (error) =>
  console.log(`El error fue el siguiente ${error}`)
);

//mongod --dbpath C:\Users\juanp\OneDrive\Escritorio\bd-desafio14