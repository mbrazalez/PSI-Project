function Sistema(){
  this.usuarios = {};
  this.partidas = {};

  this.agregarUsuario=function(usr){
    let res = {email:-1}
    console.log(usr);
    console.log("el email es.... "+ usr.email);
    console.log("Agregando usuario "+usr.email);
    if (this.usuarios[usr.email]){
      console.log("El usuario "+usr.email+" ya existe");
    }else{
      this.usuarios[usr.email]=new Usuario(usr);
      console.log("Usuario "+usr.nick+" ha sido registrado");
    }
    return res;
  };

    this.crearPartida=function(email){
      res={codigo:-1};
      creator=this.usuarios[email];
      if (creator){
        newPartida=new Partida(this.obtenerCodigo());
        this.partidas[newPartida.codigo]=newPartida;
        newPartida.jugadores.push(creator);
        console.log("Partida "+newPartida.codigo+" creada por "+creator.nick);
        res=newPartida.codigo;
      }
      return res;
    }

    this.obtenerCodigo=function(){
      code = uuidv4().toString().substr(0,6);
      return code;
    }

    this.unirAPartida=function(email,codigo){
      let res={codigo:-1};
      let partida=this.partidas[codigo];
      if (partida){
        if (partida.jugadores.length<partida.maxJug){
          partida.jugadores.push(this.usuarios[email]);
          console.log("El usuario con email "+email+" se ha unido a la partida con codigo "+codigo);
          res.codigo=partida.codigo;
        }
      }
      return res;
    }

    this.obtenerPartidasDisponibles = function(){
      let lista=[];
      for (var key in this.partidas){
        let partida=this.partidas[key];
        let creador = partida.jugadores[0];
        if (partida.jugadores.length<partida.maxJug){
          lista.push({codigo:partida.codigo, nick:creador.nick});
        }
      }
      return lista;
    }
}

function Usuario(data){
    this.nick=data.nick;
    this.email=data.email;
    this.clave;
    this.partidasGanadas=0;
    this.partidasPerdidas=0;
}

function Partida(codigo){
  this.codigo=codigo;
  this.jugadores=[]; 
  this.maxJug=2;
}

