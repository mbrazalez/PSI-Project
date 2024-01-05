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
    $("#logout-link").show();
    this.showGameMenu();
  }

  this.logout = function(){
    $("#hookGameMenu").remove();
    $("#modalMsg").remove();
    $("#gameBoard").hide();
    cw.showMsg("Session finished, see you soon ", ws.email +"!");
    $.removeCookie("email");
    rest.cerrarSesion();
    setTimeout(function(){
      location.reload();}, 1000);
  };

  this.cleanNotLogged = function(){
    $("#register-link").show();
    $("#login-link").show();
    $("#logout-link").hide();
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
    });
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
      $("#gameCodeValue").text(codigo);
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

  this.showChessboard = function(){
    $("#gameInfo").show();
    $("#hookModal").remove();
    $("#hookGameMenu").remove();
    $("#hookMsg").remove();
    $("#hookModal").remove();
    $("#gameBoard").show();
    $("#leftGame").show();
  };


  this.startGame = function(){
    logic.initGame()
  };

  this.goHome = function(){
    if (typeof ws.email === 'string') {
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