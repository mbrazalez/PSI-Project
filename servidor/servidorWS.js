function ServidorWS(){

    this.lanzarServidor=function(io){
        io.on('connection', function (socket) {
            console.log("Capa WS operativa");
        });
    }

    this.enviarAlRemitente=function(socket,mensaje,datos){
		socket.emit(mensaje,datos);
	}

    this.enviarATodos=function(socket,mens,datos){
        socket.broadcast.emit(mens,datos);
    }



};

module.exports.ServidorWS = ServidorWS;