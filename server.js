//Definir un modulo de express
const express = require('express'),
//Definir el modulo http de nodeJS
http = require('http'),
//Crear aplicacion express
app = express(),
//Requerir mongous
mongoose = require('mongoose'),
//Crear un servidor http basado en la app de Express
server = http.createServer(app),
//modulo para parse peticiones
bodyParser = require('body-parser'),
//Definir el modulo jade
jade = require('jade'),

//Definicion de Rutas
userURLUsers = require('./endPoints/users'),
userURLEstimulation = require('./endPoints/estimulation'),
userURLAdmin = require('./endPoints/admin')

/*conectarse a una db. si no se especifica el puerto ,el se conecta al default*/
mongoose.connect('mongodb://localhost/centerestimulation')

app.use("/users",userURLUsers)
app.use("/estimulation",userURLEstimulation)
app.use("/admin",userURLAdmin)

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

//Configurra el puerto de escucha
//"process.env.PORT" es una variable que hace referencia al puerto a escuchar - Utilizada para heroku
server.listen(process.env.PORT || 8000, ()=>{
	console.log("Server ON")	
})

