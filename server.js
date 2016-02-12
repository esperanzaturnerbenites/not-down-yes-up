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

app.use(cookieParser())
app.use(expressSession({
  secret: 'my secretz are mine',
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())

passport.use(new LocalStrategy( (username, password, done) => {
	models.adminUser.findOne({ userUser: username }, (err,user) => {
		if (err) return done(null, false, { message: err	})
		if (!user) return done(null, false, { message: 'Unknown user'	})

		if (username === user.userUser && password === user.passUser) {
    		console.log(user)
    		return done(null,user)
 		}

  		//done(null, false, { message: 'Unknown user'	})

 		})
	})
)

app.get('/logout', (req, res) => {
  req.logout()
  res.redirect('/users/login')
})

passport.serializeUser((user, done) => done(null, user))
passport.deserializeUser((user, done) => done(null, user))
/*conectarse a una db. si no se especifica el puerto ,el se conecta al default*/
mongoose.connect('mongodb://localhost/centerestimulation')

app.use("/users",userURLUsers)
app.use("/estimulation",ensureAuth,userURLEstimulation)
app.use("/admin",ensureAuth,userURLAdmin)

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
app.post("/authenticate", passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/users/login' })
)
function ensureAuth (req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }

  res.redirect('/users/login')
}

//Configurra el puerto de escucha
//"process.env.PORT" es una variable que hace referencia al puerto a escuchar - Utilizada para heroku
server.listen(process.env.PORT || 8000, ()=>{
	console.log("Server ON")	
})

