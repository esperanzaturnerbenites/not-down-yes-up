//Definir constante que captura un elemento html
const formValidChildren = $("#formValidChildren"),
formValidUser = $("#formValidUser"),
formUpdatePass = $("#formUpdatePass"),
formOpeChildren = $("#formOpeChildren"),
formOpeUser = $("#formOpeUser"),
formNewUser = $("#formNewUser"),
formFindAll = $("#formFindAll"),
formOpeValidChildren = $("#formOpeValidChildren")

var showResults = $("#showResults"),
showResultTeachAdmin = $("#showResultTeachAdmin"),
showResultChildren = $("#showResultChildren")
showResultValid = $("#showResultValid")

function getClone(selector){
	var t = document.querySelector(selector)
	//var t = document.querySelector("#consulQueryGeneralAvanced")
	return clone = document.importNode(t.content,true)
}

function renderResults(node){showResults.html(""); showResults.append(node)}
function renderResultTeachAdmin(node){showResultTeachAdmin.html(""); showResultTeachAdmin.append(node)}
function renderResultChildren(node){showResultChildren.html(""); showResultChildren.append(node)}
function renderResultValid(node){showResultValid.html(""); showResultValid.append(node)}

function funcStatusAct(status){
	var statusText = ""
	if(status == 0)
		statusText = "Pendiente"
	if(status == 1)
		statusText = "Completado"
	return statusText
}

//Asigna un escuchador de evento --- Cuando suceda el evento
function addChildren(){
	event.preventDefault()

	var dataChildren = $(".children").serializeArray()
	dataChildren.push({name:'birthdateChildren', value:$("#birthdateChildren").val()})

	var data = {children : $.param(dataChildren),
			mom : $.param($(".mom").serializeArray()),
			dad : $.param($(".dad").serializeArray()),
			care : $.param($(".care").serializeArray())}

	$.ajax({
		url: "/admin/register-children",
		async : false, 
		data : data,
		type : "POST",
		success: function(result){
			console.log(result)
			$("#formAddChildren")
			.trigger("reset")
			.off("submit")
			.addClass("hide")
			$("#validChildrenformOpeChildrenUpd").prop("readonly", false)
		}
	});
}

function addUser(){
	event.preventDefault()
	if($("#passUser").val() == $("#passConfirmUser").val()){
		$.ajax({
			url: "/admin/register-user",
			async : false, 
			data : {userAdd : $(".userAdd").serialize(),
				userAdmin : $(".userAdmin").serialize()},
			type : "POST",
			success: function(result){
				console.log(result);
				$("#formAddUser")
				.trigger("reset")
				.off("submit")
				.addClass("hide")
				$("#validUser").prop("readonly", false)

			}
		});
	}else console.log({msg:"Password not equals"});
}

function typeUserFind(type, res){
	if(type == "0"){
		var typeU = "Administrador"
		return typeU
	}else if(type == "1"){
		var typeU = "Docente"
		return typeU
	}
}

//Asigna un escuchador de evento --- Cuando suceda el evento
formValidUser.on("submit",(event) => {
	event.preventDefault()
	$.ajax({
		url: "/admin/valid-user",
		async : false, 
		data : $("#formValidUser").serialize(),
		type : "POST",
		success: function(result){
			console.log(typeof result)
			console.log(result)
			if (result.valid) {
				$("#formAddUser")
				.removeClass("hide")
				.on("submit",addUser)
				$("#idUser").val($("#validUser").val())
				$("#validUser").prop("readonly", true)
			}else{
				$("#formAddUser")
				.addClass("hide")
				.off("submit",addUser)
				$("#validUser").prop("readonly", false)
		}

		}
	});
})

//Asigna un escuchador de evento --- Cuando suceda el evento
formValidChildren.on("submit",(event) => {
	event.preventDefault()
	$.ajax({
		url: "/admin/valid-children",
		async : false, 
		data : $("#formValidChildren").serialize(),
		type : "POST",
		success: function(result){
			console.log(typeof result)
			console.log(result)
			if (result.valid) {
				$("#formAddChildren")
				.removeClass("hide")
				.on("submit",addChildren)
				$("#idChildren").val($("#validChildren").val())
				$("#validChildren").prop("readonly", true)
			}else{
				$("#formAddChildren")
				.addClass("hide")
				.off("submit",addChildren)
				$("#validChildren").prop("readonly", false)
			}
		}
	});
})

formNewUser.on("submit",(event) => {
	event.preventDefault()
	$.ajax({
		url: "/admin/register-newuser",
		async : false, 
		data : $("#formNewUser").serialize(),
		type : "POST",
		success: function(result){
				console.log(result);
		}
	});
})

$("#formValidChildrenValid").on("click",(event) => {
	event.preventDefault()
	$.ajax({
		url: "/admin/show-valid-step",
		async : false, 
		type : "POST",
		data : formOpeValidChildren.serializeArray(),
		success: function(result){
			children = result.children
			step = result.step
			act1 = result.act1
			act2 = result.act2
			if(children.idChildren != null){
				$("#idChildren").prop("readonly", true)

				var clone = getClone("#consulQueryChildrenValid")
				var data = $(clone.querySelector("#dataNameChild"))
				var scoreStep = (act1.scoreTeachActivity + act2.scoreTeachActivity)/2

				var p = $("<p>").append(
						span = $("<span>",{html : "Niñ@: "}),
						b = $("<b>", {html : children.nameChildren + " " + children.lastnameChildren})),
					p1 = $("<p>").append(
						b = $("<b>",{html : "ETAPA: " + act1.idActivity.stepActivity})),
					a = $("<article>").append(
						h3 = $("<h2>",{html : "ACTIVIDAD 1: " + act1.idActivity.nameActivity})),
					a2 = $("<article>").append(
						label = $("<label>",{html : "Estado: " }),
						input = $("<input>")
						.prop("type", "text")
						.attr({id:"actStatus1"})
						.prop("readonly", true)
						.prop("name", "actStatus1")
						.val(funcStatusAct(act1.statusActivity))),
					a3 = $("<article>").append(
						label = $("<label>",{html : "Puntaje: " }),
						input = $("<input>")
						.prop("type", "number")
						.attr({id:"actScore1"})
						.prop("readonly", true)
						.prop("name", "actScore1")
						.val(act1.scoreTeachActivity)),
					a4 = $("<article>").append(
						h3 = $("<h2>",{html : "ACTIVIDAD 2: " + act2.idActivity.nameActivity})),
					a5 = $("<article>").append(
						label = $("<label>",{html : "Estado: " }),
						input = $("<input>")
						.prop("type", "text")
						.attr({id:"actStatus2"})
						.prop("readonly", true)
						.prop("name", "actStatus2")
						.val(funcStatusAct(act2.statusActivity))),
					a6 = $("<article>").append(
						label = $("<label>",{html : "Puntaje: " }),
						input = $("<input>")
						.prop("type", "number")
						.attr({id:"actScore2"})
						.prop("readonly", true)
						.prop("name", "actScore2")
						.val(act2.scoreTeachActivity)),
					a7 = $("<article>").append(
						label = $("<label>",{html : "Puntaje Etapa: " }),
						input = $("<input>")
						.prop("type", "number")
						.attr({id:"scoreStep"})
						.prop("readonly", true)
						.prop("name", "scoreStep")
						.val(scoreStep))

				data.append(p, p1, a, a2, a3, a4, a5, a6, a7)

				$("#cancelValidStep",clone).click(()=>{
					$("#formValidChildren").remove()
					$("#idChildren").val("")
					$("#idChildren").prop("readonly", false)
				})

				var statusStep = "Completada",
					idStep = step._id,
					idChildren = children._id

				$("#validStep",clone).click(()=>{
						event.preventDefault()
						if (act1.statusActivity == 1 && act2.statusActivity == 1){
							$.ajax({
								url: "/admin/valid-step",
								async : false, 
								type : "POST",
								data : {observationStep : $("#observationStep").val(),
										scoreStep : $("#scoreStep").val(),
										idStep : idStep,
										idChildren : idChildren,
										statusStep : statusStep},
								success: function(result){

								}
							})
						}else console.log("Not activities complete")//return ({msg : "Not activities complete"})
				})

				renderResultValid(clone)
			}
			
		}
	})
})

formFindAll.on("submit",(event) => {
	event.preventDefault()
	$.ajax({
		url: "/admin/find-all",
		async : false, 
		type : "POST",
		data : formFindAll.serializeArray(),
		success: function(users){
			var clone = getClone("#consulQueryUser")
			var data = $(clone.querySelector("#dataFindAll"))

			for (adminuser of users){
				console.log(users)
				var tr = $("<tr>").append(
					$("<td>",{html : adminuser.userUser }),
					$("<td>",{html : typeUserFind(adminuser.typeUser)}),
					$("<td>",{html : adminuser.userUser }),
					$("<td>",{html : adminuser.dateUser })
				)
				data.append(tr)
			}
			renderResults(clone)
		}
	})
})

formUpdatePass.on("submit",(event) => {
	event.preventDefault()
	if($("#adminPassUser").val() == $("#adminPassConfirmUser").val()){
		$.ajax({
			url: "/admin/update-pass",
			async : false, 
			data : $("#formUpdatePass").serialize(),
			type : "POST",
			success: function(result){
			console.log(result);
			}
		});
	}else console.log({msg:"Password not equals"}); 
})

formOpeUser.on("submit.formOpeUserDel",(event) => {
	event.preventDefault()
	$.ajax({
		url: "/admin/delete-users",
		async : false, 
		data : $("#formOpeUser").serialize(),
		type : "POST",
		success: function(result){
		console.log(result);
		}
	});
})

$("#formOpeTeachAdminDel").on("click",(event) => {
	event.preventDefault()
	$.ajax({
		url: "/admin/delete-teachadmin",
		async : false, 
		data : $("#formOpeTeachAdmin").serialize(),
		type : "POST",
		success: function(result){
		console.log(result);
		}
	});
})

$("#formOpeTeachAdminUpd").on("click",(event) => {
	event.preventDefault()
	$.ajax({
		url: "/admin/update-teachAdmin",
		async : false, 
		data : $("#formOpeTeachAdmin").serialize(),
		type : "POST",
		success: function(result){
			if (result.valid) {
				var clone = getClone("#consulQueryUserUpdate")
				$("#cancelUpdateUser",clone).click(()=>{
					$("#formUpdateUser").remove()
				})
				renderResultTeachAdmin(clone)
			}

		}
	});
})

$("#formOpeChildrenDel").on("click.",(event) => {
	event.preventDefault()
	$.ajax({
		url: "/admin/delete-childrens",
		async : false, 
		data : $("#formOpeChildren").serialize(),
		type : "POST",
		success: function(result){
		console.log(result);
		}
	});
})

$("#formOpeChildrenUpd").on("click",(event) => {
	event.preventDefault()
	var params = $("#adminOpeChildren").val()
	window.open("/admin/register-children/" + params)	
})