"use strict";

// const Partida = require("./modules/partida.js");

var personalId = null;
$(document).ready(function() {
	console.log("pedimos datos");
	$.ajax({
		url: "/inicioJuego",
		data: {},
		method: "post",
		success: function(res, textStatus, xhr) {
			console.log(res);
			$("#nombre").text(res.user.username);
			$("#usuario img").attr("src", res.user.photo);
			personalId = res.user.ID;

			if (res.error == 0) {
				addTanque(res.tank);
			}

			for (var p of res.partidas) {
				console.log(p);
				battle(p);
			}
		}
	});

	$("#crearTanque input:button").on("click", function() {
		console.log("creamos tanque " + $("#crearTanque input:text").val());
	})

})

function addTanque(arrayTank) {
	for (var t of arrayTank) {
		$("#tanques ul").append("<li>" + t.ID + " -> " + t.nombre + "</li>");
	}
}

function battle(part) {

	var partida = "<div id='"+part.nombre+"' class=partida>" + part.nombre + "</div>";
	$("#partidas").append(partida);

	$(".partida").click(function(evt) {
		// console.log(evt.target);
		// localStorage.setItem("idPartida",evt.target.id)
		var dato={id:evt.target.id};
		$.ajax({
			url: "/batalla",
			data: dato,
			method: "post",
			success: function(res, textStatus, xhr) {
				if(res.estado=="listo"){
					window.location="batalla";
				}
			}
		});

	});
}