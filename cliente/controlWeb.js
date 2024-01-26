function ControlWeb(){
  this.page = "home";
  this.numStatus = 0;
  this.init = function(){
    let cw = this;
    google.accounts.id.initialize({
        client_id: '44495439503-5em16ngku0ejnsnj04j93tjskpm2rca0.apps.googleusercontent.com',
        auto_select: false,
        callback:cw.handleCredentialsResponse,
    });
    google.accounts.id.prompt();
  }

  this.handleCredentialsResponse=function(response){
    let jwt=response.credential;
    rest.enviarJwt(jwt);
  }

  this.checkSession = function(){
    let email = $.cookie("email");
    if(email){
      ws.email = email;
      cw.showMsg("Welcome to ProcessChess! ",ws.email);
      if (!rest.usuarioExiste(email)){
        rest.agregarUsuario(email);
      }
      this.cleanMainLogged();
      return true;
    }
    $("#leftGame").hide();
    this.cleanNotLogged();
    return false;
  };

  this.cleanMainLogged = function(){
    $("#iniText").hide();
    $("#register-link").hide();
    $("#login-link").hide();
    $("#leftGame").hide();
    $("#hookLogin").remove();
    $("#hookRegister").remove();
    $("#modalMsg").remove();
    $("#hookModal").remove();
    $("#gameBoard").hide();
    $("#gameChat").hide();
    $("#logout-link").show();
    this.showGameMenu();
    ws.listaPartidas();
  }

  this.logout = function(){
    $("#hookGameMenu").remove();
    $("#modalMsg").remove();
    $("#gameBoard").hide();
    cw.showMsg("Session finished, see you soon ", ws.email +"!");
    $.removeCookie("email");
    rest.cerrarSesion();
    setTimeout(function(){
      $("#gameChat").hide();
      location.reload();}, 1000);
  };

  this.cleanNotLogged = function(){
    $("#register-link").show();
    $("#login-link").show();
    $("#logout-link").hide();
    $("#leftGame").hide();
    $("#hookLogin").remove();
    $("#hookRegister").remove();
    $("#hookGameMenu").remove();
    $("#modalMsg").remove();
    $("#gameBoard").hide();
  }

  this.showRegister = function () {
    $("#iniText").hide();
    $("#hookLogin").remove();
    $("#modalMsg").remove();
    $("#register").load("./cliente/register.html", function(){
      $("#btnRegister").on("click", function () {
        let email = $("#email").val();
        let pwd = $("#pwd").val();
        let nick = $("#nick").val();
        if (email && pwd && nick) {
          rest.registrarUsuario(email, pwd, nick);
        }
      });
    });
  };

  this.showLogin = function () {
    $("#iniText").hide();
    $("#hookRegister").remove();
    $("#modalMsg").remove();
    $("#login").load("./cliente/login.html", function () {
      $("#btnLogin").on("click", function (e) {
        e.preventDefault();
        let email = $("#email").val();
        let pwd = $("#pwd").val();
        if (email && pwd) {
          rest.loginUsuario(email, pwd);
        }
      });
    });
    // Aquí el menú de partidas -->("#iniText").show();
  };

  this.selectToShow = function () { 
    if (this.page == "register") {
      this.showRegister();
    } else if (this.page == "login") {
      this.showLogin();
    }
  }

  this.showGameMenu = function(){
    $("#gameMenu").load("./cliente/gameMenu.html", function(){
      $("#btnCreateGame").on("click",  function () {
        ws.crearPartida();
      });
      $("#btnJoinGame").on("click", function () {
        cw.showJoinGameModal();
      });
      $("#btnVsComputer").on("click", function () {
        cw.showVsComputer();
      });
      cw.showLobbies();
    });
  };

  this.showLobbies = function(){
    $("#gameList").remove();
    console.log(ws.gameList.length);
    if (ws.gameList.length > 0){
      $("#gameListContainer").show();
      let listToShow = '<ul id="gameList" class="w-full divide-y dark:divide-gray-700  bg-gradient-to-br from-sky-50 to-green-200 shadow-xl border rounded-md border-green-100 border-4">';
      listToShow += '<li class="flex pb-3 p-4 sm:pb-4 border-4 border rounded-md"><p class="text-l text-blue-900 font-bold">List of available games</p></li>';
      console.log(ws.gameList);
      for (var game in ws.gameList){
        console.log("Mostrando lista in da for..");
        console.log(game)
        let key = ws.gameList[game].codigo;
        key = key.toString();
        let creador = ws.gameList[game].email;
        listToShow += `<li id="${key}" class="pb-3 p-4 sm:pb-4  border rounded-md border rounded-md">`;
        listToShow += '<div class="flex items-center space-x-5 rtl:space-x-reverse justify-between ">';
        listToShow += '<div class="flex-shrink-0"><img class="w-8 h-8 rounded-full" src="cliente/img/chesspieces/wK.png"></div><div class="flex-1 min-w-0"><p id="emailPlayer" class="text-sm font-medium text-blue-900 truncate dark:text-white">'
        listToShow += creador+`</p></div><button class="join-game-btn" data-key="${key}"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25" /></svg></button></div></li>`;
      }
      listToShow += '</ul>';
      $("#gameListContainer").append(listToShow);

      $(".join-game-btn").each(function() {
        $(this).on("click", function() {
            var key = $(this).data("key");
            ws.unirAPartida(key);
        });
      });
    }
  }

  this.showVsComputer = function(){
    logic.vsComputer = true;
    $("#gameContainer").show();
    $("#hookModal").remove();
    $("#hookGameMenu").remove();
    $("#hookMsg").remove();
    $("#gameBoard").show();
    $("#gameChat").show();
    $("#leftGame").show();
    $("#gameChat").load("./cliente/ingame-chat.html", function(){
      cw.receiveChatMessage('You are playing against the computer, you will receive just messages about the game status',true);

    });
    logic.playingAgainstAI = true;
    logic.gameHasStarted=true;
    logic.playerColor = 'white';
    cw.page = 'ingame';
    logic.initGame();
    console.log("Jugando contra la IA");
  };

  this.showMsg = function(msg,msg2) {
    $("#hookMsg").remove();
    let cadena = '<div id="hookMsg" class="flex items-center p-6 mb-6 text-2xl text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400 mx-auto" role="alert" style="width: 80vw;">';
    cadena += '<svg class="flex-shrink-0 inline w-12 h-12 me-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">';
    cadena += '<path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>';
    cadena += '</svg>';
    cadena += '<span class="sr-only">Info</span><div><span class="font-medium">'
    cadena += msg;
    cadena+= '</span>';
    cadena += msg2;
    cadena += '</div></div>';
    $("#msg").append(cadena);
  };

  this.sendChatMessage = function(){
    let msg = $("#inputChat").val();
    this.sendMessage(msg);
    $("#inputChat").val("");
  }

  this.sendMessage = function(msg) {
    if (msg && (logic.playerColor == "white" || logic.playerColor == "black")) {
        let messageToShow = '<div class="chat-message"><div class="flex items-end"><div class="flex flex-col space-y-1 text-xs max-w-xs mx-2 order-2 items-start"><div><span class="px-4 py-2 rounded-lg inline-block rounded-bl-none bg-green-300 text-gray-600">'
        let messageContent = msg;
        messageContent += '</span></div><div>';
        let date = new Date();
        let hours = date.getHours();
        let minutes = date.getMinutes();
        let formattedTime = (hours < 10 ? '0' : '') + hours + ':' + (minutes < 10 ? '0' : '') + minutes;
        messageContent += formattedTime;
        messageToShow += messageContent;
        messageToShow += '</div></div></div>';
        $("#messages").append(messageToShow);
        ws.sendChatMessage(messageContent);
    }
  }

  this.receiveChatMessage = function(msg, isSystemMessage=false){
    if ( msg != null && isSystemMessage) {
      console.log("Mensaje del sistema: " + msg);
      let messageToShow='<div class="chat-message"><div class="flex items-end justify-end"><div class="flex flex-col space-y-1 text-xs max-w-xs mx-2 order-1 items-end"><div><span class="px-4 py-2 rounded-lg inline-block rounded-br-none bg-red-400 text-white ">'
      messageToShow += msg;
      messageToShow+='</div></div></div>';
      $("#messages").append(messageToShow);
      console.log("Mensaje del sistema: " + msg);
      console.log("Mensaje del sistema: " + messageToShow);
      return true;
    } 
    if( msg != null && (logic.playerColor == "white" || logic.playerColor == "black")){
      let messageToShow='<div class="chat-message"><div class="flex items-end justify-end"><div class="flex flex-col space-y-1 text-xs max-w-xs mx-2 order-1 items-end"><div><span class="px-4 py-2 rounded-lg inline-block rounded-br-none bg-green-600 text-white ">'
      messageToShow += msg;
      messageToShow+='</div></div></div>';
      $("#messages").append(messageToShow);
    }
  }

  this.showMoves = function(){
    $("#messages").hide();
    $("#messageForm").hide();
    $("#moves").show();
  }

  this.showChat = function(){
    $("#moves").hide();
    $("#messages").show();
    $("#messageForm").show();
  }

  this.showMove = function(move){
    let pieceImg =  `cliente/img/chesspieces/${move.color}${move.piece.toUpperCase()}.png`;
    let moveToShow = '';
    if (move.color == "w"){
      moveToShow += '<div id="move" class="grid grid-cols-2 justify-between">'
      moveToShow += `<div class="flex col-span-1 items-center justify-center secondary-button rounded-lg">`;
      moveToShow += `<img src="${pieceImg}" alt="" class="w-8 h-8">`;
      moveToShow += `<span class="ml-2 text-black-400">${'From: ' + move.from + ' to: ' + move.to}</span>`;
      moveToShow += `</div>`;
      $("#moves").append(moveToShow);
    }

    if (move.color === "b") {
      let lastMoveContainer = $("#moves > div:last-child");
      if (lastMoveContainer.length > 0) {
        moveToShow += '<div class="flex col-span-1 items-center justify-center secondary-button rounded-lg ml-2">';
        moveToShow += `<img src="${pieceImg}" alt="" class="w-8 h-8">`;
        moveToShow += `<span class="ml-2 text-black-400">${'From: ' + move.from + ' to: ' + move.to}</span>`;
        moveToShow += `</div>`;
        moveToShow += `</div>`;
        lastMoveContainer.append(moveToShow);
      }
    }
  };

  this.showModal = function(msg, page){
    this.page = page;
    if(page == 'login'){
      $("#hookLogin").remove();
    }else{
      $("#hookRegister").remove();
      console.log("Register oculto");
    }
    $("#modalMsgContainer").load("./cliente/modal.html", function() {
      $("#hookModal").text(msg);
    });
  };

  this.showWaitingModal = function(codigo){
    $("#hookModal").remove();
    $("#hookGameMenu").remove();
    $("#modalMsgContainer").load("./cliente/waitingModal.html", function() {
      $("#copyCodeMessageSuccess").hide();
      $("#copyCodeMessageError").hide();
      $("#gameCodeValue").text(codigo);
      $("#copyCode").on("click", function () {

        const gameCodeValue = document.getElementById("gameCodeValue");
        const range = document.createRange();
        range.selectNode(gameCodeValue);
        window.getSelection().removeAllRanges();
        window.getSelection().addRange(range);
    
        try {
          document.execCommand("copy");
          $("#copyCodeMessageSuccess").show();
        } catch (err) {
          $("#copyCodeMessageError").show();
        }
          window.getSelection().removeAllRanges();
        });

    });
  };
  
  this.showJoinGameModal = function(){
    $("#hookMsg").remove();
    $("#hookModal").remove();
    $("#hookGameMenu").remove();
    $("#modalMsgContainer").load("./cliente/joinLobby.html", function(){
      $("#btnJoinGame").on("click", function () {
        let code = $("#code").val();
        if (code) {
          console.log("Unirse a partida: " + code);
          ws.unirAPartida(code);
        }
      });
    });
  }

  this.goHomeFromJoin = function(){
    this.goHome();
    ws.listaPartidas();
  }

  this.showChessboard = function(){
    $("#gameContainer").show();
    $("#gameChat").show();
    $("#hookModal").remove();
    $("#hookGameMenu").remove();
    $("#hookMsg").remove();
    $("#gameBoard").show();
    $("#leftGame").show();
    $("#gameChat").load("./cliente/ingame-chat.html", function(){
    });
    
  };


  this.startGame = function(){
    logic.initGame()
  };

  this.goHome = function(){
    if (typeof ws.email === 'string') {
      if(cw.page == 'ingame' ){
        if (!logic.playingAgainstAI ){
          cw.page = 'home';
        }
        $("#leftGame").hide();
      }
      this.cleanMainLogged();
      $("#hookMsg").remove();
    } else {
      this.cleanNotLogged();
      $("#iniText").show();
    }
  };

  this.createGame = function(){
    ws.createGame();
  };

  this.injectStatus = function(status){
    this.numStatus++;
    msg = status+'<br>'
    if(this.numStatus == 24){
      this.numStatus = 0;
      $("#gameInfo").empty();
    }
    $("#gameInfo").append(msg);
  }
}