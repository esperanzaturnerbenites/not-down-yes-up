//Definir un modulo de express
const express = require('express'),
//Definir el modulo http de nodeJS
http = require('http'),
//Crear aplicacion express
app = express(),
//Crear un servidor http basado en la app de Express
server = http.createServer(app),
//modulo para parse peticiones
bodyParser = require('body-parser'),
//Definir el modulo jade
jade = require('jade'),
userURL = require('./endPoints/users')
app.use("/users",userURL)

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

function addChildren(req,res){
	console.log(req.body)

	if (true){
		//res.redirect('/foo/bar');
		res.json({ message: 'Exito al agregar el niñ@' });
	}else{
		res.json({ message: 'Error al agregar el niñ@' });
	}
}

//Definición de rutas (URL)
app.get("/",(req,res)=>{
	res.render("index")
})



app.post("/children/add",addChildren)








//Configurra el puerto de escucha
//"process.env.PORT" es una variable que hace referencia al puerto a escuchar - Utilizada para heroku
server.listen(process.env.PORT || 8000, ()=>{
	console.log("Server ON")	
})

