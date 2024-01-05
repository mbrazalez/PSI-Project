function ServidorWS(){
    let srv = this;
    this.lanzarServidor=function(io,sistema){
        io.on('connection', function (socket) {
            console.log("Capa WS operativa");
            
            socket.on("crearPartida",function(datos){
                let codigo = sistema.crearPartida(datos.email);
                if (codigo !=-1){
                    socket.join(codigo);
                }
                srv.enviarAlRemitente(socket,"partidaCreada",{"codigo":codigo, color:'white'});
                let lista = sistema.obtenerPartidasDisponibles();
                srv.enviarATodos(socket,"listaPartidas",lista);
            });

            socket.on("unirAPartida",function(datos){
                let codigo = datos.codigo;
                let res = sistema.unirAPartida(datos.email,codigo);
                if (res.codigo!=-1){
                    socket.join(codigo);
                }
                srv.enviarAlRemitente(socket,"unidoAPartida",res);
                let lista = sistema.obtenerPartidasDisponibles();
                srv.enviarATodos(socket,"listaPartidas",lista);
            });

            socket.on("move", function(datos){
                srv.enviarATodos(socket,"move",datos);
            });

            socket.on("startGame",function(datos){
                srv.enviarATodos(socket,"startGame",datos);
            });
        });
    }

    this.enviarAlRemitente=function(socket,mensaje,datos){
        socket.emit(mensaje,datos);
    }
    
    this.enviarATodos=function(socket,mens,datos){
        socket.broadcast.emit(mens,datos);
    }
    
    this.enviarGlobal=function(io,mens,datos){
        io.emit(mens,datos);
    }
};

module.exports.ServidorWS = ServidorWS;