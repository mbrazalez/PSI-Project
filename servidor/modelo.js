const e = require("express");
const datos = require("./cad.js");
const correo = require("./email.js");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require('uuid');

function Sistema(){
  this.usuarios = {};
  this.partidas = {};
  this.cad = new datos.CAD();
  
  this.registrarUsuario=function(obj,callback){
    let modelo=this;
      if (!obj.email){
          obj.email=obj.email;
      }
      this.cad.buscarUsuario({"email":obj.email},function(usr){
        if (!usr){
          obj.nick=obj.nick;
          obj.key=Date.now().toString();
          obj.confirmada=false; 
          bcrypt.hash(obj.password, 10, function (err, hash) {
            obj.password = hash;
            modelo.cad.insertarUsuario(obj,function(res){
              callback(res);
            });
          });
          //console.log/({obj});
          //correo.enviarEmail(obj.email,obj.key,"Confirmar cuenta");
          if (!modelo.test){
            correo.enviarEmail(obj.email,obj.key,"Confirmar cuenta")
          }
        }
        else
        {
          callback({"email":-1});
        }
      });
    }

    this.loginUsuario = function (obj, callback) {
        let modelo = this;
        this.cad.buscarUsuario(
          { email: obj.email, confirmada: true },
          function (usr) {
            if (!usr) {
              callback({ email: -1 });
              return -1;
            } else {
              bcrypt.compare(obj.password, usr.password, function (err, result) {
                if (err) {
                  console.error("Error al comparar contraseñas:", err);
                  callback({
                    email: -1,
                    mensaje: "Error al comparar contraseñas",
                  });
                } else if (result) {
                    callback(usr); // Contraseña válida
                } else {
                  callback({ email: -1, mensaje: "Contraseña incorrecta" }); // Contraseña incorrecta
                }
              });
            }
          }
        );
      };
        
    this.usuarioGoogle=function(usr,callback){
        this.cad.buscarOCrearUsuario(usr,function(obj){
            callback(obj);
        });
    };

    this.confirmarUsuario=function(obj,callback){
        let modelo=this;
        this.cad.buscarUsuario({email:obj.email,confirmada:false,key:obj.key},function(usr){
            if (usr){
                usr.confirmada=true;
                modelo.cad.actualizarUsuario(usr,function(res){
                    callback({"email":res.email}); //callback(res)
                })
            }
            else
            {
                callback({"email":-1});
            }
        })
    };

    this.usuarioOAuth = function (usr, callback) {
        let copia = usr;
        usr.confirmada = true;
        this.cad.buscarOCrearUsuario(usr, function (obj) {
          if (obj.email == null) {
            console.log("El usuario " + usr.email + " ya estaba registrado");
            obj.email = copia;
          }
          callback(obj);
        });
    };

    correo.conectar(function(res){
        console.log("Variables secretas obtenidas");
        console.log(res);
    });

    this.cad.conectar(function(db){
        console.log("Conectado a la base de datos");
    });

    this.agregarUsuario=function(email){
      let res = {email:-1}
      console.log("Agregando usuario "+email);
      if (this.usuarios[email]){
        console.log("El usuario "+email+" ya existe");
      }else{
        this.usuarios[email]=new Usuario(email);
        console.log("Usuario "+email+" ha sido registrado");
        res.email=email;
      }
      console.log(this.usuarios);
      return res;
    };

    this.eliminarUsuario=function(email){
      let res={"usuario_eliminado":-1};
      if (this.usuarios[email]){
          delete(this.usuarios[email]);
          console.log("Se ha eliminado el usuario con email " + email);
          res.usuario_eliminado = email;
      }
      else {
          console.log("No existe un usuario con email " + email);
      }
      return res;
    }

    this.obtenerUsuario=function(email){
      let res={"usuario":-1};
      if (this.usuarios[email]){
          res.usuario=this.usuarios[email];
          console.log("El usuario con email " + email + " existe");
      }
      else{
          console.log("El usuario con email " + email + " no existe");
      }
      return res;
    }

    this.crearPartida=function(email){
      res={codigo:-1};
      creator=this.usuarios[email].email;
      if (creator){
        codigo = this.obtenerCodigo();
        newPartida=new Partida(codigo);
        newPartida.jugadores.push(creator);
        this.partidas[codigo]=newPartida;
        res=newPartida.codigo;
      }
      return res;
    }
  
    // Gestion de partidas
    this.obtenerCodigo=function(){
      code = uuidv4().toString().substr(0, 6);
      return code;
    }
    this.unirAPartida=function(email,codigo){
      let res={codigo:-1,color:undefined, email:email};
      let partida=this.partidas[codigo];
      if (partida){
        if (partida.jugadores.length<partida.maxJug){
          partida.jugadores.push(email);
          console.log(partida.jugadores);
          console.log("El usuario con email "+email+" se ha unido a la partida con codigo "+codigo);
          res.codigo=partida.codigo;
          res.color='black';
        }
      }
      return res;
    }
  
    this.obtenerPartidasDisponibles = function(){
      console.log("Obteniendo partidas disponibles");
      console.log(this.partidas);
      let lista=[];
      for (var key in this.partidas){
        let partida=this.partidas[key];
        let creador = partida.jugadores[0];
        if (partida.jugadores.length<partida.maxJug){
          lista.push({codigo:partida.codigo, email:creador});
        }
      }
      return lista;
    }

    this.eliminarPartida=function(codigo){
      let res={"partida_eliminada":-1};
      if (this.partidas[codigo]){
          delete(this.partidas[codigo]);
          console.log("Se ha eliminado la partida con codigo " + codigo);
          res.partida_eliminada = codigo;
      }
      else {
          console.log("No existe una partida con codigo " + codigo);
      }
      return res;
    }
}

function Usuario(email){
  this.email=email;
  this.nick;
  this.partidasGanadas=0;
  this.partidasPerdidas=0;
}

function Partida(codigo){
  this.codigo=codigo;
  this.jugadores=[]; 
  this.maxJug=2;
  this.partidaAcabada=false;
}

module.exports.Sistema=Sistema;
