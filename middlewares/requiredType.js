const CTE = require("../CTE")

function requiredType (types){
	types.push(CTE.TYPE_USER.DEVELOPER)
	return function ensureAuth (req, res, next) {
		var ifDesktopApp = eval(req.get("Desktop-App"))

		if(ifDesktopApp){
			if (req.isAuthenticated()){
				if (types.indexOf(parseInt(req.user.typeUser)) >= 0) return next()
			}else{
				res.json({msg: "Autentiquese para continuar",statusCode:CTE.STATUS_CODE.INFORMATION})
			}
		}else{
			if (req.isAuthenticated()){
				if (types.indexOf(parseInt(req.user.typeUser)) >= 0) return next()
				req.flash("info","No tiene permisos para acceder a esta opcion")
				return res.redirect("/")
			}else{
				res.redirect("/users/login")
			}
		}
	}
}

module.exports = requiredType