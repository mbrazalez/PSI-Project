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
      console.log("Se va a agrear el usuario " + email);
      rest.agregarUsuario(email);
      $("#iniText").hide();
      return true;
    }
    return false;
  };

  this.logout = function(){
    let email = $.cookie("email");
    $.removeCookie("email");
    location.reload();
    cw.showMsg("Sesión cerrada, hasta luego "+ email);
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
    let isLogged = this.checkSession();
    cw.clean();
    if (!isLogged){
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
      return isLogged;
    }
    // Aquí el menú de partidas -->("#iniText").show();
    return isLogged;
  };

  // Esta para mostrar página principal cuando la tenga
  this.showHome = function(){
    cw.clean();
    if (this.checkSession()){

    }
  };

  this.showMsg= function(msg){
    $("#hookMsg").remove();
    let cadena = '<div id="hookMsg" class="alert alert-success" role="alert">';
    cadena += msg;
    cadena += '</div>';
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
}