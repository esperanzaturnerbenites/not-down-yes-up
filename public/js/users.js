$("[data-id = ulPcpal]" ).hover(
	function() {
		var selector = $(this).data("reference")
		if(selector){
			$(selector).children().addClass("hide")
			var time = 100
			$(selector).removeClass("hide")
			$(selector).children().toArray().forEach(function(item){
				window.setTimeout(function(){$(item).removeClass("hide")},time)
				time += 50
			})
		}
	},
	function() {
		var selector = $(this).data("reference")
		if(selector){
			$(selector).addClass("hide")
			$(selector).children().toArray().forEach(function(item){
				$(item).addClass("hide")
			})
		}
	}
)

$("[data-id = navAbout]").on("click", function() {
	var selector = $(this).data("reference")
	$(".menuDesc").addClass("hide")
	if(selector){
		$(selector).removeClass("hide")
	}
})


$("[data-id = admest]").on("click", function() {
	var selector = $(this).data("reference")
	$(".menuDesc").addClass("hide")
	if(selector){
		$(selector).removeClass("hide")
	}
})

//Revisar
$("[data-id = question]").on("click", function() {
	//$(".menuHelpQuestion").addClass("hide")
	$(".menuHelpQuestion").not($(this).data("reference")).addClass("hide")
	var selector = $(this).data("reference")
	if(selector){
		//$(selector).removeClass("hide")
		$(selector).toggleClass("hide")

	}
})

$("article[data-reference]:not([data-id=ulPcpal])").click(function(e){
	var referenceOptionFind = $(this).data("reference"),
		optionFind = manual.find(option => {return option.reference == referenceOptionFind.replace("#","")})

	var pDescription = $("<p>").append($("<b>",{html:optionFind.id + ": " + optionFind.description}))

	var pIncludes = $("<p>")
		.append($("<b>",{html:"Incluye: "}))
		.append($("<span>",{html:optionFind.includes}))

	var pRoute = $("<p>")
		.append($("<b>",{html:"Ruta: "}))
		.append($("<span>",{html:optionFind.route}))

	var ulGuides = $("<ul>")
		.append($("<p>").append($("<b>",{html:"Guías:"})))
	optionFind.guides.forEach(guide => {
		ulGuides
		.append($("<li>",{html:guide}))
	})

	var ulWarnings = $("<ul>")
		.append($("<p>").append($("<b>",{html:"Alertas:"})))
	optionFind.warnings.forEach(warning => {
		ulWarnings
		.append($("<li>",{html:warning}))
	})

	$(referenceOptionFind)
	.empty()
	.append(pDescription,pIncludes,pRoute,ulGuides,ulWarnings)

	console.log(optionFind)
})