//Definir un modulo de express
const express = require('express'),
//Definir el modulo http de nodeJS
http = require('http'),
//Crear aplicacion express
app = express(),
//Requerir mongous
mongoose = require('mongoose'),
models = require('./models'),

//Crear un servidor http basado en la app de Express
server = http.createServer(app),
//modulo para parse peticiones
bodyParser = require('body-parser'),
//Requrir modulos para manejo de sesiones
cookieParser = require('cookie-parser'),
expressSession = require('express-session'),
passport = require('passport'),
LocalStrategy = require('passport-local').Strategy,
//Definir el modulo jade
jade = require('jade'),

//Definicion de Rutas
userURLUsers = require('./endPoints/users'),
userURLEstimulation = require('./endPoints/estimulation'),
userURLAdmin = require('./endPoints/admin')

// *****************************************************************************
app.use(cookieParser())
app.use(expressSession({
  secret: 'SinLimites28*',
  resave: false,
  saveUninitialized: false
}))
// **************************************************************************+
app.use(passport.initialize())
app.use(passport.session())

//Definicion de estrategia de logueo
passport.use(new LocalStrategy( (username, password, done) => {
	models.adminuser.findOne({ userUser: username }, (err,user) => {
		if (err) return done(null, false, { message: err})
		if (!user){
			done(null, false, { message: 'Unknown user'})	
		}else if (password === user.passUser) {
				if (username === user.userUser && password === user.passUser) {
		    	
		    		return done(null,user)
		 		}
			} else done(null, false, { message: 'Unknown password'})	
		})
}))

//Deslogueo
app.get('/logout', (req, res) => {
  req.logout()
  res.redirect('/users/login')
})
passport.serializeUser(function(user, done) {
    done(null, user); 
   // where is this user.id going? Are we supposed to access this anywhere?
});

// used to deserialize the user
passport.deserializeUser(function(user, done) {
	models.adminuser.findOne({_id:user._id},(err,user) => {
        done(err, user)	
	})
})

/*conectarse a una db. si no se especifica el puerto ,el se conecta al default*/
mongoose.connect('mongodb://localhost/centerestimulation')

app.use("/users",userURLUsers)
app.use("/estimulation", ensureAuth, userURLEstimulation)
app.use("/admin", ensureAuth, userURLAdmin)

//definir carpeta para vistas
app.set('views', __dirname + '/views')

//ruta estaticos
app.use(express.static('public'))

// parse application/x-www-form-urlencoded 
app.use(bodyParser.urlencoded())
 
// parse application/json 
app.use(bodyParser.json())

//Definir motor de vistas
app.set('view engine', 'jade')

//Definición de rutas (URL)
app.get("/",(req,res)=>{
	res.render("index")
})

app.post("/authenticate", 
	passport.authenticate('local',{failureRedirect: 'users/login'}), 
	(req, res) => {
		if(req.user.typeUser == "Administrador") return res.redirect("/admin/menu-admin")
		if(req.user.typeUser == "Docente") return res.redirect("/estimulation/menu-teacher")
})

//VAlidar si se encuentra autenticado
function ensureAuth (req, res, next) {
  if (req.isAuthenticated()) {
    return next() }
  res.redirect('/users/login')
}

//Configurra el puerto de escucha
//"process.env.PORT" es una variable que hace referencia al puerto a escuchar - Utilizada para heroku
server.listen(process.env.PORT || 8000, ()=>{
	console.log("Server ON")	
})
