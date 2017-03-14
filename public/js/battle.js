var nombrePartida = null;

$(document).ready(function() {

			$.ajax({
				url: "/batallaDatos",
				method: "get",
				success: function(res, textStatus, xhr) {
					console.log(res);
					pintarTablero(res.partida.nombre, res.partida.tablero.dimensiones)
					cargarObjetos(res.partida.tablero.datos);
				}
			})


			$(".action").click(function() {

				$.ajax({
					url: "/action",
					data: {
						nombre: nombrePartida,
						direccion: $(this).val()
					},
					method: "post",
					success: function(res, textStatus, xhr) {
						console.log(res.partida.tablero.datos)
						pintarTablero(res.partida.nombre, res.partida.tablero.dimensiones)
						cargarObjetos(res.partida.tablero.datos);
					}
				});



			})


			function pintarTablero(nombre, dimension) {
				var pixeles = ((100 / dimension.columnas) / 100) * 400;
				var html = "";
				nombrePartida = nombre;
				for (var i = 0; i < dimension.filas; i++) {
					html += "<div>"
					for (var j = 0; j < dimension.columnas; j++) {

						html += "<div id='" + i + "_" + j + "' class='suelo'></div>";
					}
					html += "</div>";
				}

				$("#juego").html(html);

				$("#juego>div>div").css("height", (pixeles) + "px");
				$("#juego>div>div").css("backgroundImage", "url('img/sand_texture.jpg')");
				$("#juego>div>div").css("backgroundSize", "cover");
			}

			function cargarObjetos(objetos) {
				for (var o of objetos) {
					switch (o.tipo) {
						case "roca":
							$("#" + o.x + "_" + o.y).css("backgroundImage", "url('img/rock.png')");
							$("#" + o.x + "_" + o.y).css("backgroundSize", "cover")
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
						$("#" + t.x + "_" + t.y).css("background-image", "url('img/tankeWars_Up.png')");
						$("#" + t.x + "_" + t.y).css("background-size", "cover")
						break;
					case "sur":
						$("#" + t.x + "_" + t.y).css("backgroundImage", "url('img/tankeWars_Down.png')");
						$("#" + t.x + "_" + t.y).css("backgroundSize", "cover")
						break;
					case "este":
						$("#" + t.x + "_" + t.y).css("backgroundImage", "url('img/tankeWars_Right.png')");
						$("#" + t.x + "_" + t.y).css("backgroundSize", "cover")
						break;
					case "oeste":
						$("#" + t.x + "_" + t.y).css("backgroundImage", "url('img/tankeWars_Left.png')");
						$("#" + t.x + "_" + t.y).css("backgroundSize", "cover")
						break;

				}
			}
		});