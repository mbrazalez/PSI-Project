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
        return true;
    };

    this.socket.on("partidaCreada",function(datos){
        ws.code=datos.codigo;
        logic.playerColor=datos.color;
        cw.showWaitingModal(datos.codigo);
        cw.page = 'waiting';
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
        if (msg.codigo!=ws.code) return;
        cw.showChessboard();
        logic.initGame();
        logic.gameHasStarted=true;
        cw.page = 'ingame';

    });

    this.socket.on("listaPartidas",function(lista){
        console.log(lista);
        // cw mostrar lista de partidas
    });

    this.socket.on("unidoAPartida",function(res){
        if (res.codigo == -1){
            $("#errorJoin").show();
            console.log("El usuario con email "+res.email+" no se ha podido unir a la partida con codigo "+res.codigo);
        }else{
            cw.showChessboard();
            $("#errorJoin").hide();
            cw.page = 'ingame';
            logic.playerColor=res.color;
            logic.initGame();
        }
    });

    // Functions for the movements during the game 
    this.socket.on("move", function (msg){
        if (msg.codigo!=ws.code) return;
        logic.updateBoard(msg.move)
    });

    this.newMove = function(move){
        res={codigo:ws.code, move:move};
        this.socket.emit("move",res);
    }

    // Functions for end the game, left the lobby etc
    this.leftGame=function(){
        $("#gameBoard").hide();
        $("#gameInfo").hide();
        cw.goHome();
        this.socket.emit("leftGame",{"email":ws.email,"codigo":ws.code});
    }

    this.socket.on("leftGame",function(data){
        if (data.codigo==ws.code && data.email != ws.email){
            cw.injectStatus("El jugador "+data.email+" ha abandonado la partida");
            logic.gameOver = true;
        }
    });


}

