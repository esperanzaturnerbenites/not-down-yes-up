process.env.SECRET_KEY = "V8=!N*k6Q-S_Auz?CHTM2F+"

//Definir un modulo de express
const express = require("express"),
	//Crear aplicacion express
	app = express(),
	server = require("http").Server(app),
	io = require("socket.io")(server),
	//Requerir mongous
	mongoose = require("mongoose"),
	models = require("./models"),
	functions = require("./endPoints/functions"),

	//modulo para parse peticiones
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
	URLapi = require("./endPoints/api"),
	userURLUsers = require("./endPoints/users"),
	userURLEstimulation = require("./endPoints/estimulation"),
	userURLAdmin = require("./endPoints/admin"),
	userURLReports = require("./endPoints/reports"),

	Cryptr = require("cryptr"),
	cryptr = new Cryptr(process.env.SECRET_KEY),
	CTE = require("./CTE"),
	Log = require("./log"),
	
	requiredType = require("./middlewares/requiredType")

models.adminuser.find({typeUser:CTE.TYPE_USER.DEVELOPER},(err, users) => {
	if(!users.length){
		models.adminuser.create({
			userUser:CTE.FIRST_USER.USERNAME,
			passUser:cryptr.encrypt(CTE.FIRST_USER.PASSWORD),
			typeUser:CTE.TYPE_USER.DEVELOPER,
			statusUser:CTE.STATUS_USER.ACTIVE,
			untouchableUser: true
		})
	}
})

var req_socket = null
//Creacion de salas para cada usuario
io.sockets.on("connection", function(socket) {
	req_socket = socket
	socket.on("room", function(room) {
		socket.join(room)
		console.log("room")
	})
})

//Parceador de cookies
app.use(cookieParser())
app.use(flash())
app.use(favicon(__dirname + "/public/img/favicon.png"))

//Añadir io al request
app.use(function(req,res,next){
	console.log(io)
	req.io = io
	req.req_socket = req_socket
	next()
})
//Cofiguracion de la session
app.use(expressSession({
	secret: "SinLimites28*",
	resave: false,
	saveUninitialized: false,
	store: new MongoStore({
		mongooseConnection: mongoose.connection,
		autoRemove: "native",
		stringify: true
	})
}))

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
//inicializacion de passport
app.use(passport.initialize())

//inicializacion de las sesiones
app.use(passport.session())

//Definicion de estrategia de logueo
passport.use(new LocalStrategy( (username, password, done) => {
	models.adminuser.findOne({ userUser: username }, (err,user) => {
		if (err) return done(null, false, { message: err})
		if (!user) return done(null, false, { message: "Unknown user"})

		var passwordEncrypted = cryptr.decrypt(user.passUser)
	
		if(user.statusUser != CTE.STATUS_USER.ACTIVE) {
			return done(null, false, { message: "User disabled"})
		}else if (password === passwordEncrypted) {
			if (username === user.userUser && password === passwordEncrypted) {
				return done(null,user)
			}
		} else done(null, false, { message: "Unknown password"})
	})
}))

//Deslogueo
app.get("/logout", (req, res) => {
	Log.info("Deslogueo usuario", {user:req.user})
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

//Añade variables al response
app.use((req,res,next) => {
	res.locals.user = req.user
	res.locals.CTE = CTE
	res.locals.parserCustom = functions.parserCustom
	res.locals.pretty = true
	res.locals.mediaURL = ""

	res.locals.mediaURL = process.env.NODE_ENV == "dev" ? "" : "https://googledrive.com/host/0B-a0YhEjhS0WQUtDQ2ppUUFpVTA/"
	next()
})

//Redireccionamiento tras la autenticacion
app.post("/authenticate", 
	passport.authenticate("local",{failureRedirect: "users/login"}), 
	(req, res) => {

		var ifDesktopApp = eval(req.get("Desktop-App"))
		if(ifDesktopApp){
			Log.info("Logueo usuario", {user:req.user, accessTo:"Desktop"})
			return res.json({user:req.user,CTE:CTE})
		}else{
			Log.info("Logueo usuario", {user:req.user, accessTo:"Web"})
			if(req.user.typeUser == CTE.TYPE_USER.ADMINISTRATOR || req.user.typeUser == CTE.TYPE_USER.DEVELOPER) {
				return res.redirect("/admin/menu-admin")
			}else if(req.user.typeUser == CTE.TYPE_USER.TEACHER){
				return res.redirect("/estimulation/menu-teacher")
			}else{
				return res.redirect("/")
			}
		}
	})

app.get("/",(req,res)=>{
	res.render("index")
})

app.use("/users",userURLUsers)

app.use((req,res,next) => {
	models.step.findOne({},function(err, step){
		if (err) return next(err)
		if(!step) return res.render("error",{error:{message:"No Existe Ninguna Etapa."}})
		models.activity.findOne({},function(err, activity){
			if (err) return next(err)
			if(!activity) return res.render("error",{error:{message:"No Existe Ninguna Activitdad."}})
			next()
		})
	})
})

//Montar URLs
app.use("/arduino",requiredType([CTE.TYPE_USER.TEACHER]),arduinoURL)
app.use("/estimulation", requiredType([CTE.TYPE_USER.TEACHER]), userURLEstimulation)
app.use("/admin", requiredType([CTE.TYPE_USER.ADMINISTRATOR]), userURLAdmin)
app.use("/reports", requiredType([CTE.TYPE_USER.ADMINISTRATOR]), userURLReports)

app.use("/api",URLapi)

//Configurra el puerto de escucha
//"process.env.PORT" es una variable que hace referencia al puerto a escuchar - Utilizada para heroku
server.listen(process.env.PORT || 8000, () => {console.log("Server ON")})

