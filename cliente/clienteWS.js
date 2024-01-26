function ClienteWS() {
    this.socket=undefined;
    this.email=undefined;
    this.code=undefined;
    this.gameList=[];

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
        console.log("Uniendo a partida "+codigo);
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
        ws.gameList=lista;
        $("#gameListContainer").hide();
        $("#gameList").remove();
        cw.showLobbies();
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

    this.listaPartidas=function(){
        this.socket.emit("listaPartidas");
    }

    // Functions for the movements during the game 
    this.socket.on("move", function (msg){
        if (msg.codigo!=ws.code) return;
        logic.updateBoard(msg.move)
        cw.showMove(msg.move);
    });

    this.newMove = function(move){
        res={codigo:ws.code, move:move};
        this.socket.emit("move",res);
    }

    // Functions for end the game, left the lobby etc
    this.leftGame=function(){
        $("#gameBoard").hide();
        $("#gameChat").hide();
        $("#gameContainer").hide();
        cw.sendMessage("El jugador "+ws.email+" ha abandonado la partida");
        this.socket.emit("leftGame",{"email":ws.email,"codigo":ws.code});
        cw.goHome();
    }

    this.socket.on("leftGame",function(data){
        if (data.codigo==ws.code && data.email != ws.email){
            logic.gameOver = true;
        }
        cw.showLobbies();
    });

    //Functions for the chat
    this.sendChatMessage=function(msg){
        this.socket.emit("chat",{"codigo":ws.code,"msg":msg});
    }

    this.socket.on("chat",function(data){
        if (data.codigo==ws.code){
            cw.receiveChatMessage(data.msg);
        }
    });
}

