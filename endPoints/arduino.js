var express = require("express"),
	router = express.Router(),
	bodyParser = require("body-parser"),
	CTE = require("./../CTE")

router.use(bodyParser.urlencoded({extended:false}))
router.use(bodyParser.json())

router.post("/connect-server",(req, res) => {
	return res.json({message:"Servidor Listo!",statusCode:CTE.STATUS_CODE.NOT_OK})
})

router.post("/data",(req, res) => {
	var data = req.body,
		room = req.user.idUser

	if(data.pinPress == data.pinCorrect){
		data.message = "Muy Bien"
		data.statusCode = CTE.STATUS_CODE.OK
	}else{
		data.message = "Siguelo intentando"
		data.statusCode = CTE.STATUS_CODE.INFORMATION
	}

	req.io.sockets.in(room).emit("arduino:data", data)
	//req.io.sockets.emit("message", "Hola a Todos")
	return res.json({message:"Información Recibida.",statusCode:CTE.STATUS_CODE.NOT_OK})
})

module.exports = router
