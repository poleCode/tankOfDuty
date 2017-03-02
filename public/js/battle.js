var objetos = [];

$(document).ready(function() {

	$.ajax({
		url: "/batallaDatos",
		method: "get",
		success: function(res, textStatus, xhr) {
			var pixeles = ((100 / res.partida.dimensiones.columnas) / 100) * 400;
			console.log(res.partida.dimensiones)
			var html = "";
			console.log(res.partida);
			for (var i = 0; i < res.partida.dimensiones.filas; i++) {
				html += "<div>"
				for (var j = 0; j < res.partida.dimensiones.columnas; j++) {

					html += "<div id='" + i + "_" + j + "' class='suelo'></div>";

					// html+="<div id='"+i+"_"+j+"' class='roca'></div>";
					// html+="<div id='"+i+"_"+j+"' class='tanke'></div>";
					// html+="<div id='"+i+"_"+j+"' class='bala'></div>";

					// html+="<div id='"+i+"_"+j+"+"_"+o"' class='roca'></div>";
				}
				html += "</div>";
			}

			$("#juego").html(html);
			//console.log(html);

			$("#juego>div>div").css("height", (pixeles) + "px");
			$("#juego>div>div").css("backgroundImage", "url('img/sand_texture.jpg')");
			$("#juego>div>div").css("backgroundSize", "cover");
			objetos = res.partida.tablero;
			cargarObjetos(res.partida.tablero);
		}
	})


	$("#left input").click(function(){
		for(var t of objetos){
			if(t._tipo == "tanque"){
				t._o="oeste"
				orientacion(t);
			}
		}
	})
	$("#right input").click(function(){
		for(var t of objetos){
			if(t._tipo == "tanque"){
				t._o="este"
				orientacion(t);
			}
		}
	})
	$("#up").click(function(){
		for(var t of objetos){
			if(t._tipo == "tanque"){
				t._o="norte"
				orientacion(t);
			}
		}
	})
	$("#down").click(function(){
		for(var t of objetos){
			if(t._tipo == "tanque"){
				t._o="sur"
				orientacion(t);
			}
		}
	})
})


function cargarObjetos(objetos) {
	for (var o of objetos) {
		switch (o._tipo) {
			case "roca":
				$("#" + o._y + "_" + o._x).css("backgroundImage", "url('img/rock.png')");
				$("#" + o._y + "_" + o._x).css("backgroundSize", "cover")
				console.log($("#" + o._y + "_" + o._x));
				break;
			case "tanque":
				// $("#" + o._y + "_" + o._x).css("backgroundImage", "url('img/tank.png')");
				// $("#" + o._y + "_" + o._x).css("backgroundSize", "cover")
				orientacion(o);
				console.log($("#" + o._y + "_" + o._x));
				break;
			default:
				$("#juego>div>div").css("backgroundImage", "url('img/sand_texture.jpg')");
				$("#juego>div>div").css("backgroundSize", "cover")
				break;
		}
	}
}

function orientacion(t) {
	switch (t._o) {
		case "norte":
			$("#" + t._y + "_" + t._x).css("background-image", "url('img/tankeWars_Up.png')");
			$("#" + t._y + "_" + t._x).css("background-size", "cover")
			break;
		case "sur":
			$("#" + t._y + "_" + t._x).css("backgroundImage", "url('img/tankeWars_Down.png')");
			$("#" + t._y + "_" + t._x).css("backgroundSize", "cover")
			break;
		case "este":
			$("#" + t._y + "_" + t._x).css("backgroundImage", "url('img/tankeWars_Right.png')");
			$("#" + t._y + "_" + t._x).css("backgroundSize", "cover")
			break;
		case "oeste":
			$("#" + t._y + "_" + t._x).css("backgroundImage", "url('img/tankeWars_Left.png')");
			$("#" + t._y + "_" + t._x).css("backgroundSize", "cover")
			break;

	}
}