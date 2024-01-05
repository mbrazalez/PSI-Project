function ClienteRest() {
  this.enviarJwt=function(jwt){
    $.ajax({
      type:'POST',
      url:'/enviarJwt',
      data: JSON.stringify({"jwt":jwt}),
      success:function(data){
        let msg="El email "+data.email+" está ocupado";
        if (data.email!=-1){
          msg="Bienvenido al sistema, "+data.email;
          $.cookie("email",data.email);
        }else{
          console.log("El email ya está ocupado");
        }
        cw.clean();
        cw.showMsg(msg);
      },
      error:function(xhr, textStatus, errorThrown){
        //console.log(JSON.parse(xhr.responseText));
        console.log("Status: " + textStatus);
        console.log("Error: " + errorThrown);
      },
        contentType:'application/json'
        //dataType:'json'
    });
  };

  this.registrarUsuario = function (email, password, nick) {
    $.ajax({
      type:'POST',
      url:'/registrarUsuario',
      data: JSON.stringify({"email":email, "password": password, "nick": nick}),
      success:function(data){
        if (data.email !=-1){
          cw.clean();
          cw.showLogin();
        }else{
          cw.clean();
          cw.showModal('The introduced email is already in use.');
          cw.showRegister();
        }
      },
      error:function(xhr, textStatus, errorThrown){
        console.log("Status: " + textStatus);
        console.log("Error: " + errorThrown);
      },
        contentType:'application/json'
    });
  }

  this.loginUsuario = function (email, password) {
    $.ajax({
      type: "POST",
      url: "/loginUsuario",
      data: JSON.stringify({ email: email, password: password }),
      success: function (data) {
        if (data.email != -1) {
          $.cookie("email", data.email);
          ws.email = data.email;
          cw.clean();
          cw.checkSession();
          console.log("Usuario " + data.email + " ha iniciado sesión");
          cw.showMsg(data.email);
        } else {
          cw.showModal("The introduced data is not correct, please try it again.");
        }
      },
      error: function (xhr, textStatus, errorThrown) {
        console.log("Status: " + textStatus);
        console.log("Error: " + errorThrown);
      },
      contentType: "application/json",
    });
  };

  this.cerrarSesion=function(){
    $.getJSON("/cerrarSesion",function(){
      console.log("Sesión cerrada");
      let email = $.cookie("email");
      $.removeCookie("email");
      rest.eliminarUsuario(email);
    });
  }
  
  this.agregarUsuario=function(email){
    var cli=this;
    $.getJSON("/agregarUsuario/"+email, function(data){
      console.log(data.email + " ha sido agregado");
        if (data.email!=-1){
            console.log("Usuario "+email+" ha sido registrado")
            $.cookie("email", email);
        }
        else{
            console.log("El email ya está ocupado");
        }
    })
  }

  this.eliminarUsuario=function(email){
    var cli=this;
    $.getJSON("/eliminarUsuario/"+email,function(data){
        if (data.usuario_eliminado != -1){
        }
        else{
            console.log("El usuario " + email + " no se ha podido eliminar");
        }
    })
  }

  this.usuarioExiste=function(email){
    var cli=this;
    $.getJSON("/obtenerUsuario/"+email,function(data){
        if (data.usuario != -1){
            return true;
        }
        return false;
    })
  }
}