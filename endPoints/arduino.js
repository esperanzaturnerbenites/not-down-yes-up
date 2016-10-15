var express = require("express"),
	router = express.Router(),
	bodyParser = require("body-parser"),
	CTE = require("./../CTE")

router.use(bodyParser.urlencoded({extended:false}))
router.use(bodyParser.json())

router.post("/data",(req, res) => {
	var data = req.body,
		room = req.user.idUser

	req.req_socket.on("arduino:pin_correct", function (data_emit) {
		console.log("emitte arduino:pin_correct")
		var message = {message:"Información Recibida.",statusCode:CTE.STATUS_CODE.NOT_OK,isCorrect: true}

		data.message = "Muy Bien"
		data.statusCode = CTE.STATUS_CODE.OK
		data.isCorrect = true

		if(data.pinPress != data_emit.pinCorrect){
			data.message = "Siguelo intentando"
			data.statusCode = CTE.STATUS_CODE.INFORMATION
			data.isCorrect = false

			message.isCorrect = false
		}
		req.io.sockets.in(room).emit("arduino:data", data)
	})

	req.io.sockets.in(room).emit("arduino:get_pin_correct")
	console.log("emit arduino:get_pin_correct")
	return res.json({message:"Información Recibida.",statusCode:CTE.STATUS_CODE.OK})


})

module.exports = router
