function ClienteWS() {
    this.socket=undefined;
    this.email=undefined;
    this.code=undefined;

    // Functions for initialize the sockets
    this.ini=function() {
        this.socket=io.connect();
    }

    this.ini();

    // Functions for creating a new lobby & the responses for the client
    this.crearPartida=function(){
        if (this.email==undefined) {
            console.log("Tienes que estar registrado");
            return false;
        }
        this.socket.emit("crearPartida",{"email":this.email});
    };

    this.socket.on("partidaCreada",function(datos){
        console.log(datos.codigo);
        this.code=datos.codigo;
        logic.playerColor=datos.color
        console.log("Mi color es.."+ datos.color);
        // cw mostrar esperando rival
    });

    // Functions for joining a new lobby
    this.unirAPartida=function(codigo){
        this.code=codigo;
        this.socket.emit("unirAPartida",{"email":this.email,"codigo":codigo});
    }

    this.startGame=function(){
        this.socket.emit("startGame",{"codigo":this.code});
    }

    this.socket.on("startGame",function(msg){
        console.log("Empieza la partida" + msg.codigo);
        if (msg.codigo!=this.code) return;
        logic.gameHasStarted=true;
    });

    this.socket.on("listaPartidas",function(lista){
        console.log(lista);
        cw.clean()
        // cw mostrar lista de partidas
    });

    this.socket.on("unidoAPartida",function(res){
        console.log(res);
        logic.playerColor=res.color;
    });

    // Functions for the movements during the game 
    this.socket.on("move", function (msg){
        if (msg.codigo!=this.code) return;
        logic.updateBoard(msg.move)
    });

    this.newMove = function(move){
        res={codigo:this.code, move:move};
        this.socket.emit("move",res);
    }

    // Functions for end the game, left the lobby etc
    this.socket.on("endGame",function(data){
        // cw mostrar ganador
    });
}

