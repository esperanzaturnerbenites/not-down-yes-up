var express = require("express"),
	models = require("./../models"),
	mongoose = require("mongoose"),
	router = express.Router(),
	bodyParser = require("body-parser")

router.use(bodyParser.urlencoded({extended:false}))
router.use(bodyParser.json())

router.post("/connect-server",(req, res) => {
	console.log(req.get("Desktop-App"))
	return res.json({messsage:"Servidor Listo!",statusCode:1})
})

router.post("/data",(req, res) => {
	var data = req.body,
		room = req.user.idUser

	req.io.sockets.in(room).emit("response", data)
	req.io.sockets.emit("message", "Hola a Todos")
	return res.json({messsage:"Información Recivida.",statusCode:1})
})

module.exports = router
