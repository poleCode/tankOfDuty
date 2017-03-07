'use strict';
const elementos = require('./elementos');
const tablero = require('./tablero');
const mongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const config = require('./conf.js');
// const Jugador = require('./jugador');
const url = config.mongo.url;

class Partida {

	constructor(nombre, columnas, filas, tick) {

		this._nombre = nombre;
		this._tablero = new tablero(nombre, columnas, filas);
		this._jugadores = new Map();
		this._tick = tick || 3000;
	}

	get nombre() {
		return this._nombre;
	}

	set tick(value) {
		this._tick = value;
	}

	infoPartida() {
		// let jugadores = [];
		// this._jugadores.forEach(function(element) {
		// 	jugadores.push({
		// 		id: element.id,
		// 		nombre: element.nombre
		// 	});
		// });
		return {
			nombre: this.nombre,
			tablero: this._tablero.info,
			jugadores: this._jugadores,
			dimensiones: this._tablero.dimension
		}
	}

	addTanque(tanque) {

		this._tablero.insertarTanque(tanque);
	}

	movTanque(nombre) {
		this._tablero.mover(nombre);
	}

	shootTanque(nombre) {
		this._tablero.disparar(nombre);
	}

	girarTanque(nombre, direccion) {
		this._tablero.mover(nombre, direccion);
	}

	empezarPartida() {
		let tick = 0;
		let interval = setInterval(function() {
			// this._tablero.moverBalas();
			console.log(tick);
			tick++;

		}, this._tick);

	}

	addJugador(idJugador, tanque) {
		this._jugadores.set(idJugador, tanque.id);
		this._tablero.insertarTanque(tanque);
	}

	insertarRocas(cantidad) {
		for (var i = 0; i < cantidad; i++) {
			this._tablero.insertarRoca();
		}
	}

	guardarPartida() {

		// console.log(Array.from(this._jugadores));

		var part = {
			nombre: this._tablero.nombre,
			tablero: this._tablero,
			jugadores: Array.from(this._jugadores)
				// jugadores:this._jugadores
		};

		// var nom=cargarPartidas();
		// var json=JSON.parse({partida:part});
		// console.log(part);
		mongoClient.connect(url, function(err, db) {
			assert.equal(null, err);
			console.log('conexion exitosa');

			var conex = db.collection('partida');
			// console.log(conex);
			conex.insert(part, function() {
				console.log('insertado');
				db.close();
			})
		})
	}

	cargarPartidas(cb) {
		// cb("hola");
		mongoClient.connect(url, function(err, db) {
			// assert.equal(null,err);
			// cb("hola");
			if (!err) {
				db.collection('partidas').find().toArray(function(err, data) {
					// console.log(data);
					console.log("error: " + err);
					// db.close();
					cb(err, data);
				});
			} else {
				console.log('error conexion');
				cb("error", "cpnexoin");
			}

			// cb(data2);
		})

		// mongoClient.connect(url, function(err,db){
		// 	if(!err){
		// 		db.collection("partida", function(err,collection){
		// 			collection.find(function(err,item){
		// 				if(!err){
		// 					cb(null,item.toArray());
		// 				}else{
		// 					cb("error");
		// 				}
		// 			});
		// 		});
		// 	}else{
		// 		cb("error",null);
		// 	}
		// })

	}

	comprobarPartida(nombrep, cb) {
		mongoClient.connect(url, function(err, db) {
			assert.equal(null, err);

			var coleccion = db.collection('partida');
			coleccion.find({
				id: nombrep
			}).toArray(function(err, data) {
				db.close();
				// cb(data.length);
				cb(data);
			});

		})
	}

	iniciarPartida() {
		this._tablero.insertarRoca();
		this._tablero.insertarRoca();
		this._tablero.insertarRoca();

		// this._tablero.insertarTanque(new elementos.tanque("aitor","sur"));
	}

}
module.exports = Partida;