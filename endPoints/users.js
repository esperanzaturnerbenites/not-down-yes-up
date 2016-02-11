var express = require("express"),
router = express.Router(),
bodyParser = require('body-parser')

router.use(bodyParser.urlencoded())

function authenticate(req,res){
	console.log(req.body)

	if (true){
		//res.redirect('/foo/bar');
		res.json({ message: 'Exito' });
	}else{
		res.json({ message: 'Error' });
	}
}

router.get("/login",(req,res)=>{
	res.render("login")
})

router.post("/authenticate",authenticate)

//Exportar una variable de js mediante NodeJS
module.exports = router