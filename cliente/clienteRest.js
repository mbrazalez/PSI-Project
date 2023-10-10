function ClienteRest() {
    this.agregarUsuario = function (nick) {
      $.getJSON("/agregarUsuario/" + nick, function(data) {
        if (data.nick!=-1) {
          console.log("Usuario " + nick + " ha sido registrado");
          msg = "El usuario "+ nick +" ha sido registrado";       
        } else {
          console.log("El nick ya está ocupado");
          msg = "El nick "+nick+" ya está ocupado";
        }
        cw.mostrarMsg(msg);
      });
    }

    this.agregarUsuario2 = function (nick) {
      $.ajax({
      type:'GET',
      url:'/agregarUsuario/'+nick,
      success:function(data){
        if (data.nick!=-1){
          console.log("Usuario "+nick+" ha sido registrado")
        }else{
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

    this.obtenerUsuarios = function () {
      $.getJSON("/obtenerUsuarios", function(data) {
        console.log(data);
      });
    }	
    
    this.eliminarUsuario = function (nick) {
      $.getJSON("/eliminarUsuario/" + nick, function(data) {
        if (data.nick != -1) {
          console.log("Usuario " + nick + " ha sido eliminado");
        } else {
          console.log("El nick no existe");
        }
      });
    }

    this.numeroUsuarios = function () {
      $.getJSON("/numeroUsuarios", function(data) {
        console.log(data);
      });
    }

    this.usuarioActivo = function (nick) {
      $.getJSON("/usuarioActivo/" + nick, function(data) {
        if (data.activo) {
          console.log("Usuario " + nick + " está activo");
        } else {
          console.log("El nick no existe");
        }
      });
    }
  }