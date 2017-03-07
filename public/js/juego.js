"use strict";
var tanqueid=null;
// const Partida = require("./modules/partida.js");

var personalId = null;
$(document).ready(function() {

	console.log("pedimos datos");
	$.ajax({
		url: "/inicioJuego",
		data: {},
		method: "post",
		success: function(res, textStatus, xhr) {
			$("#tanques>ul").empty();
			console.log(res);
			$("#nombre").text(res.user.username);
			$("#usuario img").attr("src", res.user.photo);
			personalId = res.user.ID;

			if (res.error == 0) {
				addTanque(res.tanke);
			}

			battle(res.partidas);



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
					$("#crearTanque>input").val("");
				}
			})
		}

	});

	$("#enmarcar button").on("click", function() {
		// console.log($("#enmarcar select").val());
		if ($("#enmarcar input").val() == "") {
			console.log('partida no creada')
		}else if (tanqueid == null) {
			alert("tanque no asignado");
		} else {
			$.ajax({
				url: "/crearPartida",
				data: {
					nombre: $("#enmarcar input").val(),
					size: $("#enmarcar select").val(),
					tanqueId:tanqueid
				},
				method: "post",
				success: function(res, textStatus, xhr) {
					console.log(res);
					if (res.err == 1) {
						alert("es obligatorio asignar un tanque")
					} else if (res.err == 0) {
						$("#enmarcar input").val("");
						$("#partidas").empty();
						battle(res.batallas);
					}

				}
			})
		}
	})



})

function addTanque(arrayTank) {
	for (var t of arrayTank) {
		console.log(t);
		$("#tanques ul").append("<li id='" + t.id + "'>" + t.nombre + "</li>");
	}

	$("#tanques li").on("click", function() {
		
		$(this).parent().children().css("text-decoration", "none");
		$(this).css("text-decoration", "underline");
		tanqueid=$(this).attr("id")
	});

}

function addObject(t) {
	$("#tanques ul").append("<li id='" + t.ID + "'>" + t.nombre + "</li>");
}

function battle(part) {
	// console.log(part);
	for (let b of part) {
		var partida = "<div id='" + b.nombre + "' class=partida>" + b.nombre + "</div>";
		$("#partidas").append(partida);
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