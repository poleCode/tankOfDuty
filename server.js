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
const io = require("socket.io")(server);

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



app.post('/inicioJuego', ensureAuth, function(req, res) {
	// console.log("inicio de juego con id=" + req.user.ID)
	let usuario = new Usuario(req.user.username, mysqlconnection);
	usuario.id = req.user.ID;
	let tanques = [];
	// console.log('recogiendo tanques')
	// var tanques = [];
	var error = "";
	algo.consultarTanques(req.user.ID, (err, codeErr, rows) => {
		if (codeErr == 0) {
			for (var r of rows) {

				let tank = new Elementos.tanque(r.nombre);
				tank.id = r.ID;
				// console.log(r);
				usuario._tanks.push(tank);
				tanques.push(tank);
			}
		} else {
			// console.log("error nº " + codeErr);
			error = codeErr;
		}
		usuarios.push(usuario);
		// console.log(usuarios);
		for (let t of usuarios) {
			// console.log(t);
			// console.log(t._tanks);
		}

		let tankinfo = [];
		for (let t of tanques) {
			tankinfo.push(t.info);
		}

		let partidasInfo = []
		for (let p of partidasJ) {
			partidasInfo.push(p.infoPartida());
		}
		// console.log('informacion de tanques');
		// console.log(tankinfo);

		res.json({
			user: req.user,
			tanke: tankinfo,
			error: error,
			partidas: partidasInfo
		});
	});



});

/**
 * Llamada para crear tanques del usuario
 */
app.post('/crearTanque', ensureAuth, (req, res) => {

	var tanque = new Elementos.tanque(req.body.nombre);
	var usuario = usuarios.find((user) => {
		if (user.id == req.user.ID) return user;
	});


	usuario.crearTanque(req.user.ID, tanque, (err, codeErr, id) => {


		if (codeErr != 2) {
			tanque.id = id;
			usuario._tanks.push(tanque);
			// console.log(usuarios);

			usuario.consultarTanques(req.user.ID, (err, codeErr, rows) =>{
				let tankinfo = [];
				for (let t of tanques) {
					tankinfo.push(t.info);
				}
				res.json({
					error: codeErr,
					Tanque: tanqueinfo
				});
			})
			
		}


	});
});

/**
 * Llamada para crear partida
 */
app.post('/crearPartida', ensureAuth, (req, res) => {

	let tank = asignarTanque(req.user.ID, req.body.tanqueId);
	// console.log(tank);		

	// console.log(asignado)
	var tamaño = campo(req.body.size);
	// console.log(tamaño);
	var partida = new Partida(req.body.nombre, tamaño, tamaño);

	partida.addJugador(req.user.ID, tank);
	// var cantidad=Math.floor((Math.random()*(tamaño*2))+(tamaño/2));
	partida.insertarRocas(tamaño);
	// console.log(asignado.nombre);

	partidasJ.push(partida);

	var partidasInfo = [];
	partidasJ.forEach(function(element) {
		partidasInfo.push(element.infoPartida());
	});
	console.log("1 " + partidasInfo);
	res.json({
		err: 0,
		batallas: partidasInfo
	});


});


app.post('/batalla', ensureAuth, function(req, res) {


	let partida = partidasJ.filter(function(part) {

		if (part.nombre == req.body.id) {

			if (!part.jugadores.get(req.user.ID)) {
				let tanque = asignarTanque(req.user.ID, req.body.tanque);
				part.addJugador(req.user.ID, tanque);
				part.addTanque(tanque);
				// console.log('añadido tanque ' + req.body.tanque);
			}
			return part;

		} else {
			// console.log('Eliminado jugador ' + req.user.ID);
			part.jugadores.delete(req.user.ID);
		}


	});

	res.json({
		estado: "listo"
	});


});

app.get('/batalla', ensureAuth, function(req, res) {
	res.sendFile('public/battle.html', {
		root: __dirname
	});
});

app.get('/batallaDatos', ensureAuth, (req, res) => {

	// console.log(req.user.ID);
	let par=null;

	let partidaSeleccionada = partidasJ.filter(function(part) {
		if (part._jugadores.get(req.user.ID)) {
			par=part;
			return part;
		}

	});
	// console.log(partidaSeleccionada[0].infoPartida().tablero);
	res.json({
		partida: partidaSeleccionada[0].infoPartida()
	});

	if (partidaSeleccionada[0]) {
		setInterval(function() {
			// console.log(partidaSeleccionada[0].infoPartida().tablero);
		var datos=JSON.stringify(partidaSeleccionada[0].infoPartida());
			io.sockets.emit('datos',datos);
		par.moveBalas();
		}, 1000);
	}


});

io.on('connection', function(socket) {
	socket.on('patata', function(data) {
		console.log(data);
	});
});


app.post('/action', ensureAuth, function(req, res) {


	io.sockets.emit('mensajes', 'Ejecutamos socket');


	let tanqueId = null;

	var parSel = partidasJ.filter(function(part) {
		if (part.nombre == req.body.nombre) {
			return part;
		}
	});

	tanqueId = parSel[0].jugadores.get(req.user.ID);

	switch (req.body.direccion) {
		case "Right":
			parSel[0].girarTanque(tanqueId, req.body.direccion);
			break;
		case "Left":
			parSel[0].girarTanque(tanqueId, req.body.direccion);
			break;
		case "Up":
			parSel[0].movTanque(tanqueId);
			break;
		case "Shoot":
			parSel[0].shootTanque(tanqueId);
			break;
		default:
			// statements_def
			break;
	}


	res.json({
		partida: parSel[0].infoPartida()
	});

});

server.listen(3000, () => console.log('Servidor comezado con express. Escoitando no porto 3000'));


// funciones


/**
 * tamaño del tablero
 * @param  {string} talla tamaño
 * @return {int}       numero
 */
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

/**
 * Asignacion de un tanque
 * @param  {int} usuarioID id del usuario
 * @param  {int} tanqueID  id del tanque
 * @return {object}           tanque
 */
function asignarTanque(usuarioID, tanqueID) {
	let user = usuarios.filter(function(usera) {
		if (usera.id == usuarioID) {
			return usera;
		}
	})

	let tanque = user[0].tanks.filter(function(tan) {
		if (tan.id == tanqueID) {
			return tan;
		}
	})

	return tanque[0];
}