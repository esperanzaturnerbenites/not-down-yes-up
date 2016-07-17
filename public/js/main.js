var CTE = {
	STATUS : {
		OK:0,
		NOT_OK:1,
		INFORMATION:2
	}
}

$(document).ready(function () {
	$("[href='/logout']").click(event => {
		if(!confirm("Desea Salir de la Aplicación")) event.preventDefault()
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