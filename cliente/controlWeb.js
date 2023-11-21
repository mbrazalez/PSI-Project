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

    this.comprobarSesion = function(){
        let email = $.cookie("email");
        if(email){
          $("#iniText").hide();
          cw.mostrarAgregarUsuario(); 
          cw.obtenerUsuarios();
          cw.numeroUsuarios();
          cw.usuarioActivo();
          cw.eliminarUsuario();
        }else{
            //cw.init();
        }
    };

    this.mostrarAgregarUsuario=function(){
      $("#mAU").remove();
      let cadena='<div id="mAU">';  
      cadena = cadena + '<div class="card" style="margin-top: 30px;"><div class="card-body">';
      cadena = cadena +'<div class="form-group">';
      cadena = cadena + '<label for="email">Agregar un nuevo usuario:</label>';
      cadena = cadena + '<p><input type="text" class="form-control" id="email" placeholder="Introduce un email"></p>';
      cadena = cadena + '<button id="btnAU" type="submit" class="btn btn-primary" style="background-color: #424881; color: #fff; border: none; padding: 10px 20px; border-radius: 5px; font-size: 18px;">Agregar Usuario</button>';
      cadena = cadena + '<style>#btnAU:hover {background-color: #333;}</style>'
      cadena = cadena + '</div>';
      cadena = cadena + '</div></div></div>'; 
      
      $("#au").append(cadena); 

      $("#btnAU").on("click",function(){ 
          let email=$("#email").val();
          if (email){
              rest.agregarUsuario(email);
          }
      })
  }

  this.obtenerUsuarios=function(){
    $("#mOU").remove();
    let cadena='<div id="mOU">';
    cadena = cadena + '<div class="card" style="margin-top: 30px;"><div class="card-body">';
    cadena = cadena +'<div class="form-group">';
    cadena = cadena + '<label style="display: block;">Obtener la lista de usuarios:</label>';
    cadena = cadena + '<button id="btnOU" type="submit" class="btn btn-primary" style="background-color: #424881; color: #fff; border: none; padding: 10px 20px; border-radius: 5px; font-size: 18px;">Obtener usuarios</button>';
    cadena = cadena + '</div>';
    $("#ou").append(cadena); 

    $("#btnOU").on("click",function(){ 
      rest.obtenerUsuarios();
    })
  }

  this.numeroUsuarios=function(){
      $("#mNU").remove();
      let cadena='<div id="mNU">';
      cadena = cadena + '<div class="card" style="margin-top: 30px;"><div class="card-body">';
      cadena = cadena +'<div class="form-group">';
      cadena = cadena + '<label style="display: block;">Obtener el número de usuarios:</label>';
      cadena = cadena + '<button id="btnNU" type="submit" class="btn btn-primary" style="background-color: #424881; color: #fff; border: none; padding: 10px 20px; border-radius: 5px; font-size: 18px;">Numero de usuarios</button>';
      cadena = cadena + '</div>';
      
      $("#nu").append(cadena); 

      $("#btnNU").on("click",function(){ 
          rest.numeroUsuarios();
      })
  }

  this.usuarioActivo=function(){
      let cadena='<div id="mUA">';
      cadena = cadena + '<div class="card" style="margin-top: 30px;"><div class="card-body">';
      cadena = cadena +'<div class="form-group">';
      cadena = cadena + '<label style="display: block;">¿Usuario activo?:</label>';
      cadena = cadena + '<p><input type="text" class="form-control" id="UA" placeholder="Introduce un email"></p>';
      cadena = cadena + '<button id="btnUA" type="submit" class="btn btn-primary" style="background-color: #424881; color: #fff; border: none; padding: 10px 20px; border-radius: 5px; font-size: 18px;">Submit</button>';
      cadena = cadena + '</div>';
      $("#ua").append(cadena); 
      $("#btnUA").on("click",function(){ 
          let email=$("#UA").val();
          rest.UsuarioActivo(email);
      })
  }

  this.eliminarUsuario=function(){
      $("#mEU").remove();
      let cadena='<div id="mEU">';
      cadena = cadena + '<div class="card" style="margin-top: 30px;"><div class="card-body">';
      cadena = cadena +'<div class="form-group">';
      cadena = cadena + '<label style="display: block;">Eliminar un usuario:</label>';
      cadena = cadena + '<p><input type="text" class="form-control" id="EU" placeholder="Introduce un email"></p>';
      cadena = cadena + '<button id="btnEU" type="submit" class="btn btn-primary" style="background-color: #424881; color: #fff; border: none; padding: 10px 20px; border-radius: 5px; font-size: 18px;">Submit</button>';
      cadena = cadena + '</div>';
      
      $("#eu").append(cadena); //au es una etiqueta que viene de agregarUsuario

      $("#btnEU").on("click",function(){ 
          let email=$("#EU").val();
          if (email){
              rest.eliminarUsuario(email);
          }
      })
  }

    this.salir = function(){
        let email = $.cookie("email");
        $.removeCookie("email");
        location.reload();
        cw.mostrarMsg("Sesión cerrada, hasta luego "+ email);
        rest.cerrarSesion();
    };

    this.limpiar = function(){
      $("#iniText").hide();
      $("#hookRegistro").remove();
      $("#hookLogin").remove();
      $("#hookMsg").remove();
      $("#hookModal").remove();
      $("#mAU").remove();
      $("#mEU").remove();
      $("#mOU").remove();
      $("#mNU").remove();
      $("#mUA").remove();
    };

    this.mostrarRegistro = function () {
        if ($.cookie("email")) {
          cw.limpiar();
          cw.mostrarAgregarUsuario(); 
          cw.obtenerUsuarios();
          cw.numeroUsuarios();
          cw.usuarioActivo();
          cw.eliminarUsuario();
          return true;
        }
        cw.limpiar();
        $("#registro").load("./cliente/registro.html", function(){
          $("#btnRegistro").on("click", function () {
            let email = $("#email").val();
            let pwd = $("#pwd").val();
            if (email && pwd) {
              rest.registrarUsuario(email, pwd);
            }
          });
        });
    };

    this.mostrarMsg= function(msg){
      $("#hookMsg").remove();
      let cadena = '<div id="hookMsg" class="alert alert-success" role="alert">';
      cadena += msg;
      cadena += '</div>';
      $("#msg").append(cadena);
  };

  this.cleanModal = function(){
    $("#hookModal").remove();
    $("#modalMsgContainer").empty();  
  };

  this.mostrarModal = function(msg){
    $("#hookModal").remove();
    $("#modalMsgContainer").load("./cliente/modal.html", function() {
      // The content is loaded, now you can show the modal
      $("#hookModal").append(msg);
      $("#modalMsg").modal("show");
    });
  };

  this.mostrarLogin = function () {
      if ($.cookie("email")){
        cw.limpiar();
        cw.mostrarAgregarUsuario(); 
        cw.obtenerUsuarios();
        cw.numeroUsuarios();
        cw.usuarioActivo();
        cw.eliminarUsuario();
        return true;
      }
      cw.limpiar();
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
  };
}