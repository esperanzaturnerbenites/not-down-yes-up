//Definir constante que captura un elemento html
const formValidChildren = $("#formValidChildren"),
formValidUser = $("#formValidUser"),
formUpdatePass = $("#formUpdatePass"),
formOpeChildren = $("#formOpeChildren"),
formOpeUser = $("#formOpeUser"),
formNewUser = $("#formNewUser"),
formFindAll = $("#formFindAll")

var showResults = $("#showResults"),
showResultTeachAdmin = $("#showResultTeachAdmin")
showResultChildren = $("#showResultChildren")

function getClone(selector){
	var t = document.querySelector(selector)
	//var t = document.querySelector("#consulQueryGeneralAvanced")
	return clone = document.importNode(t.content,true)
}

function renderResults(node){showResults.html(""); showResults.append(node)}
function renderResultTeachAdmin(node){showResultTeachAdmin.html(""); showResultTeachAdmin.append(node)}
function renderResultChildren(node){showResultChildren.html(""); showResultChildren.append(node)}

//Asigna un escuchador de evento --- Cuando suceda el evento
function addChildren(){
	event.preventDefault()
	$.ajax({
		url: "/admin/register-children",
		async : false, 
		data : {children : ($(".children")).serialize(), //Como concatenar otros datos Status, DateStart, Date End
			mom : $(".mom").serialize(),
			dad : $(".dad").serialize(),
			care : $(".care").serialize()},
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
				renderResultTeachAdmin(clone)
				console.log(typeof result)
				console.log(result)
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