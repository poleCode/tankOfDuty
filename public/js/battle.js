var objetos = [];
var nombrePartida=null;

$(document).ready(function() {

	$.ajax({
		url: "/batallaDatos",
		method: "get",
		success: function(res, textStatus, xhr) {
			console.log(res);
			var pixeles = ((100 / res.partida.tablero.dimensiones.columnas) / 100) * 400;
			var html = "";
			nombrePartida=res.partida.nombre;
			for (var i = 0; i < res.partida.tablero.dimensiones.filas; i++) {
				html += "<div>"
				for (var j = 0; j < res.partida.tablero.dimensiones.columnas; j++) {

					html += "<div id='" + i + "_" + j + "' class='suelo'></div>";
				}
				html += "</div>";
			}

			$("#juego").html(html);

			$("#juego>div>div").css("height", (pixeles) + "px");
			$("#juego>div>div").css("backgroundImage", "url('img/sand_texture.jpg')");
			$("#juego>div>div").css("backgroundSize", "cover");
			objetos = res.partida.tablero;
			cargarObjetos(res.partida.tablero.datos);
		}
	})


	$("#left input").click(function() {
		for (var t of objetos) {
			if (t._tipo == "tanque") {

				if (t._o != "oeste") {
					t._o = "oeste"
					orientacion(t);
				}else{
					$.ajax({
						url:"/left",
						data:{partida:nombrePartida},
						method:"post",
						success:function(res, textStatus, xhr){
							console.log(res);
						}
					});
				}
			}
		}
	})
	$("#right input").click(function() {
		for (var t of objetos) {
			if (t._tipo == "tanque") {

				if (t._o != "este") {
					t._o = "este"
					orientacion(t);
				}else{
					$.ajax({
						url:"/left",
						data:{partida:nombrePartida},
						method:"post",
						success:function(res, textStatus, xhr){
							console.log(res);
						}
					});
				}
			}
		}
	})
	$("#up").click(function() {
		for (var t of objetos) {
			if (t._tipo == "tanque") {

				if (t._o != "norte") {
					t._o = "norte"
					orientacion(t);
				}else{
					$.ajax({
						url:"/left",
						data:{partida:nombrePartida},
						method:"post",
						success:function(res, textStatus, xhr){
							console.log(res);
						}
					});
				}
			}
		}
	})
	$("#down").click(function() {
		for (var t of objetos) {
			if (t._tipo == "tanque") {

				if (t._o != "sur") {
					t._o = "sur"
					orientacion(t);
				}else{
					$.ajax({
						url:"/left",
						data:{partida:nombrePartida},
						method:"post",
						success:function(res, textStatus, xhr){
							console.log(res);
						}
					});
				}
			}
		}
	})
})


function cargarObjetos(objetos) {
	for (var o of objetos) {
		switch (o.tipo) {
			case "roca":
				$("#" + o.y + "_" + o.x).css("backgroundImage", "url('img/rock.png')");
				$("#" + o.y + "_" + o.x).css("backgroundSize", "cover")
					// console.log($("#" + o._y + "_" + o._x));
				break;
			case "tanque":
				// $("#" + o._y + "_" + o._x).css("backgroundImage", "url('img/tank.png')");
				// $("#" + o._y + "_" + o._x).css("backgroundSize", "cover")
				orientacion(o);
				break;
			default:
				$("#juego>div>div").css("backgroundImage", "url('img/sand_texture.jpg')");
				$("#juego>div>div").css("backgroundSize", "cover")
				break;
		}
	}
}

function orientacion(t) {
	switch (t.o) {
		case "norte":
			$("#" + t.y + "_" + t.x).css("background-image", "url('img/tankeWars_Up.png')");
			$("#" + t.y + "_" + t.x).css("background-size", "cover")
			break;
		case "sur":
			$("#" + t.y + "_" + t.x).css("backgroundImage", "url('img/tankeWars_Down.png')");
			$("#" + t.y + "_" + t.x).css("backgroundSize", "cover")
			break;
		case "este":
			$("#" + t.y + "_" + t.x).css("backgroundImage", "url('img/tankeWars_Right.png')");
			$("#" + t.y + "_" + t.x).css("backgroundSize", "cover")
			break;
		case "oeste":
			$("#" + t.y + "_" + t.x).css("backgroundImage", "url('img/tankeWars_Left.png')");
			$("#" + t.y + "_" + t.x).css("backgroundSize", "cover")
			break;

	}
}