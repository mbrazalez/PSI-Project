function ClienteRest() {
    this.enviarJwt=function(jwt){
      $.ajax({
        type:'POST',
        url:'/enviarJwt',
        data: JSON.stringify({"jwt":jwt}),
      success:function(data){
        let msg="El nick "+data.nick+" está ocupado";
        if (data.nick!=-1){
          console.log("Usuario "+data.nick+" ha sido registrado");
          msg="Bienvenido al sistema, "+data.nick;
          $.cookie("nick",data.nick);
        }else{
          console.log("El nick ya está ocupado");
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

    this.agregarUsuario=function(nick){
      var cli=this;
      $.getJSON("/agregarUsuario/"+nick,function(data){
          if (data.nick!=-1){
              console.log("Usuario "+nick+" ha sido registrado")
              msg="Usuario " + nick + " ha sido registrado";
              // localStorage.setItem("nick",nick);
              $.cookie("nick", nick);
          }
          else{
              console.log("El nick ya está ocupado");
              msg="El nick " + nick + " ya está ocupado";
          }
          cw.mostrarMsg(msg);
      })
  }

  this.agregarUsuario2=function(nick){
      $.ajax({
          type:'GET',
          url:'/agregarUsuario/'+nick,
          success:function(data){
              if (data.nick!=-1){
                  console.log("Usuario "+nick+" ha sido registrado")
              }
              else{
                  console.log("El nick ya está ocupado");
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
              return data[usuario].nick; // Obtiene el nombre de usuario para cada clave
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

  this.UsuarioActivo=function(nick){
      var cli=this;
      $.getJSON("/usuarioActivo/"+nick,function(data){
          if (data.res == true){
              console.log("Usuario "+nick+" esta activo")
              msg="El usuario " + nick + " está activo";
          }
          else{
              console.log("Usuario "+nick+" no esta activo");
              msg="El usuario " + nick + " no está activo";
          }
          cw.mostrarMsg(msg);
      })
  }

  this.eliminarUsuario=function(nick){
      var cli=this;
      $.getJSON("/eliminarUsuario/"+nick,function(data){
          if (data.usuario_eliminado != -1){
              console.log("Usuario "+nick+" ha sido eliminado")
              msg="Usuario "+nick+" ha sido eliminado";
          }
          else{
              console.log("El usuario " + nick + " no se ha podido eliminar");
              msg="El usuario " + nick + " no se ha podido eliminar";
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
          if (data.nick !=-1){
            cw.limpiar();
            cw.mostrarLogin();
          }else{
            cw.limpiar();
            cw.mostrarPopUp('El nick ya está ocupado');
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
          if (data.nick != -1) {
            $.cookie("nick", data.nick);
            cw.limpiar();
            cw.mostrarMsg("Bienvenid@ al sistema, " + data.nick);
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
        $.removeCookie("nick");
      });
    }
      

  }