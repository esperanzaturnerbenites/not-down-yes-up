var express = require("express"),
	models = require("./../models"),
	mongoose = require("mongoose"),
	router = express.Router(),
	bodyParser = require("body-parser")

router.use(bodyParser.urlencoded({extended:false}))
router.use(bodyParser.json())

router.post("/connect-server",(req, res) => {
	return res.json({messsage:"Servidor Listo!",statusCode:1})
})

router.post("/data",(req, res) => {
	var data = req.body
	console.log(data)
	req.io.sockets.emit("response", data)
	return res.json({messsage:"Información Recivida.",statusCode:1})
})

module.exports = router
