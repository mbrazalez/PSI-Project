function ClienteRest() {
  this.enviarJwt=function(jwt){
    $.ajax({
      type:'POST',
      url:'/enviarJwt',
      data: JSON.stringify({"jwt":jwt}),
      success:function(data){
        let msg="El email "+data.email+" está ocupado";
        if (data.email!=-1){
          console.log("Usuario "+data.email+" ha sido registrado");
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
          cw.showMsg("Bienvenid@ al sistema, " + data.email);
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
      console.log(data);
        if (data.email!=-1){
            console.log("Usuario "+email+" ha sido registrado")
            msg="Usuario " + email + " ha sido registrado";
            $.cookie("email", email);
        }
        else{
            console.log("El email ya está ocupado");
            msg="El email " + email + " ya está ocupado";
        }
        cw.showMsg(msg);
    })
  }

  this.eliminarUsuario=function(email){
    var cli=this;
    $.getJSON("/eliminarUsuario/"+email,function(data){
        if (data.usuario_eliminado != -1){
            console.log("Usuario "+email+" ha sido eliminado")
            msg="Usuario "+email+" ha sido eliminado";
        }
        else{
            console.log("El usuario " + email + " no se ha podido eliminar");
            msg="El usuario " + email + " no se ha podido eliminar";
        }
        cw.showMsg(msg);
    })
  }

  this.obtenerUsuarios=function(){
    var cli=this;
    $.getJSON("/obtenerUsuarios/",function(data){
        var usuarios = Object.keys(data); // Obtiene las claves (nombres de usuario) del objeto
        var nombresUsuarios = usuarios.map(function (usuario) {
            return data[usuario].email; // Obtiene el nombre de usuario para cada clave
        });
        console.log(nombresUsuarios);
        cw.mostrarMsg(JSON.stringify("Los usuarios agregados son: " + nombresUsuarios))
    })
  }
}