function ControlWeb(){
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
      $("#iniText").hide();
      $("#register-link").hide();
      $("#login-link").hide();
      $("#leftGame").hide();
      if (!rest.usuarioExiste(email)){
        rest.agregarUsuario(email);
        cw.showGameMenu();
      }
      return true;
    }
    $("#leftGame").hide();
    return false;
  };

  this.logout = function(){
    let email = $.cookie("email");
    $.removeCookie("email");
    location.reload();
    cw.showMsg("Sesión cerrada, hasta luego "+ email);
    rest.eliminarUsuario(email);
    rest.cerrarSesion();
  };

  this.showRegister = function () {
    cw.clean();
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
    cw.clean();
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

  this.showGameMenu = function(){
    $("#gameMenu").load("./cliente/gameMenu.html", function(){
      $("#btnCreateGame").on("click", function () {
        console.log("Create Game");
      });
      $("#btnJoinGame").on("click", function () {
        console.log("Join Game");
      });
    });
  };

  this.showMsg = function(msg) {
    $("#hookMsg").remove();
    let cadena = '<div id="hookMsg" class="flex items-center p-6 mb-6 text-2xl text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400 mx-auto" role="alert" style="width: 80vw;">';
    cadena += '<svg class="flex-shrink-0 inline w-12 h-12 me-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">';
    cadena += '<path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>';
    cadena += '</svg>';
    cadena += '<span class="sr-only">Info</span><div><span class="font-medium">Welcome to ProcessChess! </span>';
    cadena += msg;
    cadena += '</div></div>';
    $("#msg").append(cadena);
  };

  this.showModal = function(msg){
    $("#hookLogin").remove();
    $("#hookModal").remove();
    $("#modalMsgContainer").load("./cliente/modal.html", function() {
      $("#hookModal").append(msg);
      $("#modalMsg").modal("show");
    });
  };

  this.showWaitingModal = function(codigo){
    $("#hookLogin").remove();
    $("#hookModal").remove();
    $("#gameMenu").hide();
    $("#modalMsgContainer").load("./cliente/waitingModal.html", function() {
      $("#hookModal").modal("show");
      $("#gameCodeValue").text(codigo);
    });
  };

  this.clean = function(){
    $("#iniText").hide();
    $("#hookRegister").remove();
    $("#hookLogin").remove();
    $("#hookMsg").remove();
    $("#hookModal").remove();
  };

  this.cleanModal = function(){
    $("#hookModal").remove();
    $("#modalMsgContainer").empty();  
  };

  this.startGame = function(){
    logic.initGame()
    cw.clean()
  };

  this.goHome = function(){
    cw.clean();
    if (this.checkSession()){
      cw.showMsg(ws.email);
    }else{
      $("#iniText").show();
    }
  };

  this.createGame = function(){
    ws.createGame();
  };
}