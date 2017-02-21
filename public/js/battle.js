$(document).ready(function(){

	$.ajax({
		url:"/batallaDatos",
		method:"get",
		success:function(res, textStatus, xhr){
			var pixeles=((100/res.partida.dimensiones.columnas)/100)*400;
			console.log(res.partida.dimensiones)
			var html="";
			console.log(res.partida);
			for(var i=0;i<res.partida.dimensiones.filas;i++){
				html+="<div>"
				for(var j=0;j<res.partida.dimensiones.columnas;j++){
					html+="<div>a</div>"
				}
				html+="</div>";
			}
			$("#juego").html(html);
			console.log(html);

			$("#juego>div>div").css("height",(pixeles-2)+"px");
		}
	})
})