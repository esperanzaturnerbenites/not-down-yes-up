var jade = require("jade")

function renderReportAge(params){
	var fn = jade.compileFile(params.view,{})
	var html = fn({data: params.data})
	return html
}

module.exports = {
	renderReportAge: renderReportAge
}
