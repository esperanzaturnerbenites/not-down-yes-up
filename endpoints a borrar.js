/*$.ajax({
	url: "/admin/update-pass",
	async : false, 
	data : $("#formUpdatePass").serialize(),
	type : "POST",
	success: function(result){
		if (result.err) return notification.show({msg:result.err.message, type:1})
		$("#adminIdUser").val("")
		$("#adminPassUser").val("")
		$("#adminPassConfirmUser").val("")
		notification.show({msg:result.msg, type:result.statusCode})
	}
})*/

/*$.ajax({
	url: "/admin/update-rol",
	async : false, 
	data : $("#formOpeUserRol").serialize(),
	type : "POST",
	success: function(result){
		if (result.err) return notification.show({msg:result.err.message, type:1})
		$("#adminRolIdUser").val("")
		notification.show({msg:result.msg, type:result.statusCode})
	}
})*/

/*$.ajax({
	url: "/admin/update-status",
	async : false, 
	data : $("#formOpeUserStatus").serialize(),
	type : "POST",
	success: function(result){
		if (result.err) return notification.show({msg:result.err.message, type:1})
		$("#adminStaIdUser").val("")
		notification.show({msg:result.msg, type:result.statusCode})
	}
})*/

/*$.ajax({
	url: "/admin/delete-users",
	async : false, 
	data : $("#formOpeUser").serialize(),
	type : "POST",
	success: function(result){
		if (result.err) return notification.show({msg:result.err.message, type:1})
		$("#adminOpeIdUser").val("")
		notification.show({msg:result.msg, type:result.statusCode})
	}
})*/

/*$.ajax({
	url: "/admin/found-users",
	async : false, 
	data : $("#adminOpeTeachAdmin").serialize(),
	type : "POST",
	success: function(result){
		if (result.err) return notification.show({msg:result.err.message, type:1})
		notification.show({msg:result.msg, type:result.statusCode})
		if(result._id){
			window.open("/admin/info-user/" + $("#adminOpeTeachAdmin").val())
		}
	}
})*/

/*$.ajax({
	url: "/admin/found-users",
	async : false, 
	data : $("#adminOpeTeachAdmin").serialize(),
	type : "POST",
	success: function(result){
		if (result.err) return notification.show({msg:result.err.message, type:1})
		notification.show({msg:result.msg, type:result.statusCode})
		if(result._id){
			window.open("/admin/register-user/" + $("#adminOpeTeachAdmin").val())
		}
	}
})*/

/*$.ajax({
	url: "/admin/found-childrens",
	async : false, 
	data : $("#adminInfoChildren").serialize(),
	type : "POST",
	success: function(result){
		if (result.err) return notification.show({msg:result.err.message, type:1})
		notification.show({msg:result.msg, type:result.statusCode})
		if(result._id){
			window.open("/admin/info-children/" + $("#adminInfoChildren").val())
		}
	}
})*/

/*$.ajax({
	url: "/admin/found-childrens",
	async : false, 
	data : $("#adminInfoChildren").serialize(),
	type : "POST",
	success: function(result){
		if (result.err) return notification.show({msg:result.err.message, type:1})
		notification.show({msg:result.msg, type:result.statusCode})
		if(result._id){
			window.open("/admin/register-children/" + params)
		}
		//console.log(result)
	}
})*/

/*$.ajax({
	url: "/admin/status-children",
	async : false, 
	data : $(this).serialize(),
	type : "POST",
	success: function(result){
		if (result.err) return notification.show({msg:result.err.message, type:1})
		notification.show({msg:result.msg, type:result.statusCode})
	}
})*/