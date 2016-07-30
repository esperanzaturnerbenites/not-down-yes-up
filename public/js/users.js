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

$("[data-id = admest]").on("click", function() {
	var selector = $(this).data("reference")
	$(".menuDesc").addClass("hide")
	if(selector){
		$(selector).removeClass("hide")
	}
})

$("[data-id = question]").on("click", function() {
	$(".menuHelpQuestion").addClass("hide")
	var selector = $(this).data("reference")
	if(selector){
		$(selector).removeClass("hide")
	}
})

$("li[data-reference]:not([data-id=ulPcpal])").click(function(e){
	var referenceOptionFind = $(this).data("reference"),
		optionFind = manual.find(option => {return option.reference == referenceOptionFind.replace("#","")})

	var ul = $("<ul>")
	optionFind.guides.forEach(guide => {
		ul.append($("<li>",{html:guide}))
	}) 

	$(referenceOptionFind)
	.empty()
	.append(ul)

	console.log(optionFind)
})