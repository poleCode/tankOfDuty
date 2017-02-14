"use strict";
var personalId=null;
$(document).ready(function(){
	console.log("pedimos datos");
	$.ajax({
		url:"/inicioJuego",
		data:{},
		method:"post",
		success:function(res, textStatus, xhr){
			console.log(res.user);
			$("#nombre").text(res.user.username);
			$("#usuario img").attr("src",res.user.photo);
			personalId=res.user.ID;
			// console.log('error');
			// console.log(res.error);
			// console.log('tanques');
			// console.log(res.tank);
			if(res.error==0){
				addTanque(res.tank);
			}
		}
	});

	$("#crearTanque input:button").on("click", function(){
		console.log("creamos tanque "+ $("#crearTanque input:text").val());
	})

})

function addTanque(arrayTank){
	for(var t of arrayTank){
		$("#tanques ul").append("<li>"+t.ID+" -> "+t.nombre+"</li>");
	}
}