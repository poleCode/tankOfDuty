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
				var texto = "<div id='" + p.nombre + "' class=partida>" + p.nombre + "</div>";
				$("#partidas").append(texto);

			}

			$(".partida").click(function(evt) {
				console.log('datos pedidos')
					// console.log(evt.target);
					// localStorage.setItem("idPartida",evt.target.id)
				var dato = {
					id: evt.target.id
				};
				$.ajax({
					url: "/batalla",
					data: dato,
					method: "post",
					success: function(res, textStatus, xhr) {
						if (res.estado == "listo") {

							window.location = "batalla";
						}
					}
				});

			});


		}
	});

	$("#crearTanque input:button").on("click", function() {
		// console.log("creamos tanque " + $("#crearTanque input:text").val());
		if ($("#crearTanque input:text").val() == "") {
			console.log('tanque no creado')
		} else {
			$.ajax({
				url: "/crearTanque",
				data: {
					nombre: $("#crearTanque input:text").val()
				},
				method: "post",
				success: function(res, textStatus, xhr) {
					// console.log(res.Tanque);
					addObject(res.Tanque);
					$("#crearTanque input:text").val() = " ";
				}
			})
		}

	});

	$("#enmarcar button").on("click", function() {
			// console.log($("#enmarcar select").val());
			if ($("#enmarcar input").val() == "") {
				console.log('tanque no creado')
			} else {
				$.ajax({
					url: "/crearPartida",
					data: {
						nombre: $("#enmarcar input").val(),
						size:$("#enmarcar select").val()
					},
					method: "post",
					success: function(res, textStatus, xhr) {
						// console.log(res.Tanque);
						
					}
				})
			}
	})

})

function addTanque(arrayTank) {
	for (var t of arrayTank) {
		$("#tanques ul").append("<li>" + t.ID + " -> " + t.nombre + "</li>");
	}
}

function addObject(t) {
	$("#tanques ul").append("<li>" + t._id + " -> " + t._nombre + "</li>");
}

function battle(part) {

	var partida = "<div id='" + part.nombre + "' class=partida>" + part.nombre + "</div>";
	$("#partidas").append(partida);


}