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
        cw.limpiar();
        cw.mostrarMsg(msg);
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

    this.agregarUsuario=function(email){
      var cli=this;
      $.getJSON("/agregarUsuario/"+email,function(data){
          if (data.email!=-1){
              console.log("Usuario "+email+" ha sido registrado")
              msg="Usuario " + email + " ha sido registrado";
              $.cookie("email", email);
          }
          else{
              console.log("El email ya está ocupado");
              msg="El email " + email + " ya está ocupado";
          }
          cw.mostrarMsg(msg);
      })
  }

  this.agregarUsuario2=function(email){
      $.ajax({
          type:'GET',
          url:'/agregarUsuario/'+email,
          success:function(data){
              if (data.email!=-1){
                  console.log("Usuario "+email+" ha sido registrado")
              }
              else{
                  console.log("El email ya está ocupado");
              }
          },
          error:function(xhr, textStatus, errorThrown){
              console.log("Status: " + textStatus);
              console.log("Error: " + errorThrown);
          },
          contentType:'application/json'
      });
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

  this.numeroUsuarios=function(){
      var cli=this;
      $.getJSON("/numeroUsuarios/",function(data){
          console.log(data);
          cw.mostrarMsg("Número de usuarios: " + data.num);
      })
  }

  this.UsuarioActivo=function(email){
      var cli=this;
      $.getJSON("/usuarioActivo/"+email,function(data){
          if (data.res == true){
              console.log("Usuario "+email+" esta activo")
              msg="El usuario " + email + " está activo";
          }
          else{
              console.log("Usuario "+email+" no esta activo");
              msg="El usuario " + email + " no está activo";
          }
          cw.mostrarMsg(msg);
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
          cw.mostrarMsg(msg);
      })
  }


    this.registrarUsuario = function (email, password) {
      $.ajax({
        type:'POST',
        url:'/registrarUsuario',
        data: JSON.stringify({"email":email, "password": password}),
        success:function(data){
          if (data.email !=-1){
            cw.limpiar();
            cw.mostrarLogin();
          }else{
            cw.limpiar();
            cw.mostrarPopUp('El email ya está ocupado');
            cw.mostrarRegistro();
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
            cw.limpiar();
            cw.mostrarMsg("Bienvenid@ al sistema, " + data.email);
            cw.mostrarAgregarUsuario(); 
            cw.obtenerUsuarios();
            cw.numeroUsuarios();
            cw.usuarioActivo();
            cw.eliminarUsuario();
          } else {
            cw.mostrarPopUp("No se ha podido iniciar sesión");
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
        $.removeCookie("email");
      });
    }
      

  }