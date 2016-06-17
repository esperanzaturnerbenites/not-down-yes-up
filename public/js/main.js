document.addEventListener("DOMContentLoaded", function () {
	$("[href='/logout']").click(event => {
		if(!confirm("Desea Salir de la Aplicación")) event.preventDefault()
	})
})