'use strict';
const http = require('http');
const path = require('path');
const express = require("express");
const BodyParser = require("body-parser");
const apiLogin = require("./modules/registro.js");
const apiTanques = require("./modules/funTanques.js");
const cookieParser = require("cookie-parser");
const expressSession = require("express-session");
const passport = require('passport');
var config = require('./modules/conf.js');
const Usuario = require("./modules/usuario.js");
const Partida = require("./modules/partida.js");
const Elementos = require("./modules/elementos.js");

const mysqlconnection = {
	user: "root",
	password: "root",
	host: "127.0.0.1",
	port: 3306
}

let algo = new Usuario(" ", mysqlconnection);
// let partida = new Partida("partida1", 8, 8);
// partida.

const app = express();
const server = http.createServer(app);

var tanques = [];
var partidasJ = [];
var usuarios = [];
// partida.iniciarPartida();

// partidasJ.push(partida.infoPartida());
app.use(BodyParser.json()); //Recibir peticiones POST con datos en json
app.use(BodyParser.urlencoded({
	extended: true
})); //para formularios en post
app.use(express.static(path.join(__dirname, 'public')));

app.use(cookieParser());
app.use(expressSession({
	secret: 'estonoesuncifrado',
	resave: true,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());



function ensureAuth(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	res.redirect('/login');
}


// partida.cargarPartidas(function(err, data) {
// 	// console.log(data)

// 	for (var d of data) {
// 		var parti = new Partida(d.nombre, d.columnas, d.filas)
// 			// parti.iniciarPartida();
// 		partidasJ.push(parti.infoPartida());
// 	}


// });



//Servidor Estático.

//========================================================
//						ENDPOINTS
//========================================================
app.use('/login', apiLogin);
app.use('/tanques', apiTanques);

app.get('/juego', ensureAuth, (req, res) => {
	res.sendFile('public/juego.html', {
		root: __dirname
	});
});

app.get('/iniciarPartida', function(req, res) {
	res.json({
		map: partidas
	});
});

/*
app.post('/inicioJuego', ensureAuth, function(req, res) {
	console.log("inicio de juego con id=" + req.user.ID)

	console.log('recogiendo tanques')
	var tanques = [];
	var error = "";
	algo.consultarTanques(req.user.ID, (err, codeErr, rows) => {
		if (codeErr == 0) {
			for (var r of rows) {
				console.log(r);
			}
			tanques = rows;
		} else {
			console.log("error nº " + codeErr);
			error = codeErr;
		}

		partida.cargarPartidas(function(err, data) {
			// console.log(data)
			partidasJ = []
			for (var d of data) {
				var parti = new Partida(d.nombre, d.columnas, d.filas)
				partidasJ.push(parti.infoPartida());
			}
			console.log(partidasJ);

			res.json({
				user: req.user,
				tank: tanques,
				error: error,
				partidas: partidasJ
			});
		});


	});

});
*/

app.post('/inicioJuego', ensureAuth, function(req, res) {
	// console.log("inicio de juego con id=" + req.user.ID)
	let usuario = new Usuario(req.user.username, mysqlconnection);
	usuario.id = req.user.ID;
	// console.log('recogiendo tanques')
	// var tanques = [];
	var error = "";
	algo.consultarTanques(req.user.ID, (err, codeErr, rows) => {
		if (codeErr == 0) {
			for (var r of rows) {
				let tank=new Elementos.tanque(r.nombre);
				tank.id=r.id;
				console.log(r);
				usuario._tanks.push(tank);
			}
			tanques = rows;
		} else {
			// console.log("error nº " + codeErr);
			error = codeErr;
		}
		usuarios.push(usuario);
		// console.log(usuarios);
		for(let t of usuarios){
			console.log(t);
			// console.log(t._tanks);
		}
		res.json({
			user: req.user,
			tanke: tanques,
			error: error,
			partidas: partidasJ
		});
	});



});

/**
 * Llamada para crear tanques del usuario
 */
app.post('/crearTanque', ensureAuth, (req, res) => {

	var tanque = new Elementos.tanque(req.body.nombre);
	var usuario=usuarios.find((user)=>{
		if(user.id==req.user.ID) return user;
	})


	usuario.crearTanque(req.user.ID, tanque, (err, codeErr, id) => {


		if (codeErr != 2) {
			tanque.id = id;
			usuario._tanks.push(tanque);
			console.log(usuarios);
			res.json({
				error: codeErr,
				Tanque: tanque
			});
		}


	});
});

/**
 * Llamada para crear partida
 */
app.post('/crearPartida', ensureAuth, (req, res) => {
	var tamaño = campo(req.body.size);
	var partida = new Partida(req.body.nombre, tamaño, tamaño);


	// partida.addJugador(res.user.ID,);



});

app.post('/batalla', ensureAuth, function(req, res) {
	// console.log('comprobar partida');
	// console.log(req.body);
	console.log(partidasJ);
	partidasJ.filter(function(part) {
		// console.log("partida nombre:" + part.nombre + " ," + req.body.id);
		if (part.nombre == req.body.id) {
			part.jugadores.push({
				id: req.user.ID,
				nombre: req.user.username
			});
			res.json({
				estado: "listo"
			})
		}


	});


	// console.log(partidasJ);
	// partida.comprobarPartida(req.body.id, function(data){
	// 	console.log(data);
	// })
	// console.log(game[0]);

});

app.get('/batalla', ensureAuth, function(req, res) {
	res.sendFile('public/battle.html', {
		root: __dirname
	});
});

app.get('/batallaDatos', ensureAuth, (req, res) => {

	// var juego = [1,2];

	partidasJ.filter(function(part) {
		// console.log('partida');
		console.log(part);
		part.jugadores.filter(function(jugador) {
			// console.log(jugador);
			if (jugador.id == req.user.ID) {
				// console.log(part);
				res.json({
					partida: part
				})
				res.end();
			}
		});
	});

	// console.log(juego[0]);


	// var juego = partidasJ.filter(function(part) {
	// 	if (part.jugadores.filter(function(jugador) {
	// 			if (jugador.id == req.user.ID) {
	// 				return part
	// 			}
	// 		})) 
	// 		console.log(part._jugadores);
	// 		return part;
	// 	}
	// })
	// console.log(juego[0]);
	// res.json({
	// 	estado: juego[0]
	// });
})


server.listen(3000, () => console.log('Servidor comezado con express. Escoitando no porto 3000'));


// funciones

function campo(talla) {
	switch (talla) {
		case "xs":
			return 6
			break;
		case "s":
			return 8
			break;
		case "m":
			return 10
			break;
		case "l":
			return 12
			break;
		case "xl":
			return 14
			break;
		default:
			// statements_def
			break;
	}
}