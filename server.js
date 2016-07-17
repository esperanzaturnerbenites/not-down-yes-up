process.env.SECRETKEY = "V8=!N*k6Q-S_Auz?CHTM2F+"

//Definir un modulo de express
const express = require("express"),
	//Crear aplicacion express
	app = express(),
	server = require("http").Server(app),
	io = require("socket.io")(server),
	//Requerir mongous
	mongoose = require("mongoose"),
	models = require("./models"),

	//modulo para parse peticiones
	CTE = require("./CTE"),
	bodyParser = require("body-parser"),
	favicon = require("express-favicon"),
	flash = require("express-flash"),
	//Requrir modulos para manejo de sesiones
	cookieParser = require("cookie-parser"),
	expressSession = require("express-session"),
	passport = require("passport"),
	LocalStrategy = require("passport-local").Strategy,
	MongoStore = require("connect-mongo")(expressSession),

	//Definicion de Rutas
	arduinoURL = require("./endPoints/arduino"),
	api = require("./endPoints/api"),
	userURLUsers = require("./endPoints/users"),
	userURLEstimulation = require("./endPoints/estimulation"),
	userURLAdmin = require("./endPoints/admin"),
	userURLReports = require("./endPoints/reports"),

	Cryptr = require("cryptr"),
	cryptr = new Cryptr(process.env.SECRETKEY)

models.adminuser.find((err, users) => {
	if(!users.length){
		var passwordFirstUser = cryptr.encrypt("dev")

		models.adminuser.create({
			userUser:"dev",
			passUser:passwordFirstUser,
			typeUser:2,
			statusUser:1
		})
	}
})

io.sockets.on("connection", function(socket) {
	socket.on("room", function(room) {
		socket.join(room)
	})
})

//Parceador de cookies
app.use(cookieParser())
app.use(flash())
app.use(favicon(__dirname + "/public/img/favicon.png"))
app.use(function(req,res,next){
	req.io = io
	next()
})
//Cofiguracion de la session
app.use(expressSession({
	secret: "SinLimites28*",
	resave: false,
	saveUninitialized: false,
	store: new MongoStore({
		mongooseConnection: mongoose.connection
	})
}))

//inicializacion de passport
app.use(passport.initialize())

//inicializacion de las sesiones
app.use(passport.session())

//Definicion de estrategia de logueo
passport.use(new LocalStrategy( (username, password, done) => {
	models.adminuser.findOne({ userUser: username }, (err,user) => {
		var passwordEncrypted = cryptr.decrypt(user.passUser)
		if (err) return done(null, false, { message: err})
		if (!user){
			return done(null, false, { message: "Unknown user"})
		}else if(user.statusUser != 1) {return done(null, false, { message: "User disabled"})}
		else if (password === passwordEncrypted) {
			if (username === user.userUser && password === passwordEncrypted) {
				return done(null,user)
			}
		} else done(null, false, { message: "Unknown password"})
	})
}))

//Deslogueo
app.get("/logout", (req, res) => {
	req.logout()
	res.redirect("/users/login")
})
passport.serializeUser(function(user, done) {
	done(null, user) 
})

//Desserializacion de usuario
passport.deserializeUser(function(user, done) {
	models.adminuser.findOne({_id:user._id},(err,user) => {
		done(err, user)
	})
})

/*conectarse a una db. si no se especifica el puerto ,el se conecta al default*/
mongoose.connect("mongodb://localhost/centerestimulation")

app.use((req,res,next) => {
	res.locals.user = req.user
	next()
})

app.use("/api",api)
app.use("/arduino",requiredType([1]),arduinoURL)
app.use("/users",userURLUsers)
app.use("/estimulation", requiredType([1]), userURLEstimulation)
app.use("/admin", requiredType([0,2]), userURLAdmin)
app.use("/reports", requiredType([0,2]), userURLReports)

//definir carpeta para vistas
app.set("views", __dirname + "/views")

//ruta estaticos
app.use(express.static("public"))

// parse application/x-www-form-urlencoded 
app.use(bodyParser.urlencoded({extended:false}))
 
// parse application/json 
app.use(bodyParser.json())

//Definir motor de vistas
app.set("view engine", "jade")

//Definición de rutas (URL)
app.get("/",(req,res)=>{
	res.render("index")
})
/*app.post("/authenticate", (req, res, next) => {
	passport.authenticate("local",{failureRedirect: "users/login"},(err, user,info) => {
		var ifDesktopApp = eval(req.get("Desktop-App"))
		console.log("--------")
		console.log(info)
		console.log("--------")
		if(ifDesktopApp){
			return res.json({user:req.user,CTE:CTE})
		}else{
			if(req.user.typeUser == 0 || req.user.typeUser == 2) return res.redirect("/admin/menu-admin")
			if(req.user.typeUser == 1) return res.redirect("/estimulation/menu-teacher")
		}
	})
	
})*/


//Redireccionamiento tras la autenticacion
app.post("/authenticate", 
	passport.authenticate("local",{failureRedirect: "users/login"}), 
	(req, res) => {
		var ifDesktopApp = eval(req.get("Desktop-App"))
		if(ifDesktopApp){
			return res.json({user:req.user,CTE:CTE})
		}else{
			if(req.user.typeUser == 0 || req.user.typeUser == 2) return res.redirect("/admin/menu-admin")
			if(req.user.typeUser == 1) return res.redirect("/estimulation/menu-teacher")
		}
	})


//Valida si se encuentra autenticado
function requiredType (types){
	return function ensureAuth (req, res, next) {
		var ifDesktopApp = eval(req.get("Desktop-App"))

		if(ifDesktopApp){
			if (req.isAuthenticated()){
				if (types.indexOf(parseInt(req.user.typeUser)) >= 0) return next()
				res.json({msg: "Ok, Autenticado Correctamente",statusCode:2})
			}else{
				res.json({msg: "Autentiquese para continuar",statusCode:2})
			}
		}else{
			if (req.isAuthenticated()){
				if (types.indexOf(parseInt(req.user.typeUser)) >= 0) return next()
				return res.redirect("/")
			}else{
				res.redirect("/users/login")
			}
		}
	}
}

//Configurra el puerto de escucha
//"process.env.PORT" es una variable que hace referencia al puerto a escuchar - Utilizada para heroku
server.listen(process.env.PORT || 8000, () => {console.log("Server ON")})

