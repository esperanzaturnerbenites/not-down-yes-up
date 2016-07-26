Date.prototype.toHour12 = function () {
	/*
		Formatea un Object Date en Tiempo (12 horas)
	*/
	return this.toLocaleTimeString("es-CO",{hour12:true})
		.replace("p. m.","pm")
		.replace("a. m.","am")
}

$.ajaxSetup({
	headers: {"Desktop-App": "false"}
})
const CTE = {
	STATUS_CODE: {
		OK:0,
		NOT_OK:1,
		INFORMATION:2
	},
	TYPE_USER: {
		ADMINISTRATOR: 0,
		TEACHER: 1,
		DEVELOPER: 2
	},
	STATUS_USER:{
		INACTIVE: 0,
		ACTIVE: 1
	},
	STATUS_CHILDREN:{
		REGISTER : 0,
		IN_PROGRESS : 1,
		QUALIFIED : 2,
		RETIRED : 3
	},
	FIRST_USER: {
		USERNAME:"Developer",
		PASSWORD: "Developer"
	}
}
var notification = new NotificationC()
$(document).ready(function () {
	$("[href='/logout']").click(event => {
		if(!confirm("Desea Salir de la Aplicación")) event.preventDefault()
	})
	$("[data-equal-to]").change(function(event){
		var reference = $(this).data("equal-to")
		if($(reference).val()){
			if($(reference).val() != $(this).val()){
				$(reference).val("")
				$(this).val("")
				
			}
		}
		
	})
	$("[data-valid-id-exists]").change(function(event){
		var input = $(this)
		var data = $(this).data("valid-id-exists").split(","),
			ifDeleteInExists = eval(data[0]),
			ifDeleteInNotExists = eval(data[1]),
			collection = data[2],
			field = data[3]

		var buttonSubmit = input.closest("form").find("[type=submit]")
		buttonSubmit.prop("disabled",true)

		if(collection){
			var query = {}
			query[field] = $(this).val()
			$.ajax({
				url: "/api/" + collection,
				contentType: "application/json",
				data : JSON.stringify({query:query}),
				type : "POST",
				success: (response) => {
					if(response.documents.length){
						//Existe
						if(ifDeleteInExists){
							$(this).val("")
						}
					}else{
						//No Existe
						if(ifDeleteInNotExists){
							$(this).val("")
						}
					}
					buttonSubmit.prop("disabled",false)
				}
			})
		}else{
			$.ajax({
				url: "/api/id-exists",
				data : {id: $(this).val()},
				type : "POST",
				success: (response) => {
					if(response.statusCode != CTE.STATUS_CODE.OK){
						//Existe
						if(ifDeleteInExists){
							$(this).val("")
						}
					}else{
						//No Existe
						if(ifDeleteInNotExists){
							$(this).val("")
						}
					}
					buttonSubmit.prop("disabled",false)
				}
			})
		}
	})
	$("[data-valid-user-exists]").change(function(event){
		var input = $(this)
		var buttonSubmit = input.closest("form").find("[type=submit]")
		buttonSubmit.prop("disabled",true)

		var data = $(this).data("valid-user-exists").split(","),
			ifDeleteInExists = eval(data[0]),
			ifDeleteInNotExists = eval(data[1])

		$.ajax({
			url: "/api/adminuser",
			contentType : "application/json",
			data : JSON.stringify({query:{userUser: $(this).val()}}),
			type : "POST",
			success: (response) => {
				if(response.documents.length){
					//Existe
					if(ifDeleteInExists){
						$(this).val("")
					}
				}else{
					//No Existe
					if(ifDeleteInNotExists){
						$(this).val("")
					}
				}
				buttonSubmit.prop("disabled",false)
			}
		})
	})
})

/*
	Genera un mensaje Visual en el Navegador

	@function createMessage 
	Genera la Estructura HTML del Mensaje
	@param {Object} data: 
		@property msg {String}: Texto a mostrar.
		@property type {Number}: Tipo de Mensaje.
			0: Correcto.
			1: Incorrecto.
			2: Informacion.
		@property time {Number}: Tiempo durante el cual se mostrara el mensaje
		@default time 3000ms
	@return {HTMLElement} Node DOM

	@function show
	Agrega al DOM el Mesaje
	@param {Object} data: 
		@property msg {String}: Texto a mostrar.
		@property type {Number}: Tipo de Mensaje.
			0: Correcto.
			1: Incorrecto.
			2: Informacion.
		@property time {Number}: Tiempo durante el cual se mostrara el mensaje
		@default time 3000ms

	@function hide
	Remueve del DOM el Mesaje
*/
function NotificationC (){
	var contenedorPrincipal = document.body

	var createMessage = function (data){
		var contenedorMSG = document.createElement("article")
		contenedorMSG.classList.add("contenedorMensaje")
		var mensaje = document.createElement("p")
		mensaje.innerHTML= data.msg
		contenedorMSG.classList.add("MSG")
		var icon = document.createElement("img")

		contenedorMSG.appendChild(icon)
		contenedorMSG.appendChild(mensaje)

		if (data.type == 0) icon.src = "/img/notifications/correcto.png"
		else if(data.type == 1) icon.src = "/img/notifications/incorrecto.png"
		else if(data.type == 2) icon.src = "/img/notifications/informacion.png"

		icon.classList.add("contenedorIcon")
		mensaje.classList.add("contenedorMensaje")

		return contenedorMSG
	}

	this.show = function (data){
		var contenedorMSG = createMessage(data),
			top = window.window.scrollY,
			time = data.time || 3000

		contenedorMSG.setAttribute("style", "top:" + top + "px")
		contenedorPrincipal.appendChild(contenedorMSG)
		setTimeout(this.hide.bind(this), time)
	}

	this.hide = function (){
		contenedorPrincipal.removeChild(contenedorPrincipal.lastChild)
	}
}

/*
	Abstraccion de la interfaz 'SpeechSynthesisUtterance' de la 'Web Speech API' (Convierte texto a voz)
	@function toVoice
		@param {String} text: texto a convertir a voz.
*/
function Text (){
	this.toVoice = function (text){
		var msg = new SpeechSynthesisUtterance(),
			voices = window.speechSynthesis.getVoices()

		msg.voice = voices[4]
		msg.voiceURI = "native"
		msg.volume = 1
		msg.rate = 1
		msg.pitch = 1
		msg.text = text
		msg.lang = "es-ES"

		speechSynthesis.speak(msg)
	}
}