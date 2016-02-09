var express = require("express"),
router = express.Router(),
bodyParser = require('body-parser')

router.use(bodyParser.urlencoded())
 
// parse application/json 
router.use(bodyParser.json())

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

router.get("/register",(req,res)=>{
	res.render("register")
})

router.post("/authenticate",authenticate)

//Exportar una variable de js mediante NodeJS
module.exports = router