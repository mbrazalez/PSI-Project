const datos = require("./cad.js");
const correo = require("./email.js");
const bcrypt = require("bcrypt");

function Sistema(){
    const datos = require('./cad.js');
    this.usuarios={};
    this.cad = new datos.CAD();

    this.cad.conectar(function(db){
        console.log("Conectado a la base de datos");
    });

    this.agregarUsuario=function(nick){
        let res = {nick:-1}
        console.log("Agregando usuario "+nick);
        if (this.usuarios[nick]){
            console.log("El usuario "+nick+" ya existe");
        }else{
            this.usuarios[nick]=new Usuario(nick);
            res.nick=nick;
            console.log("Usuario "+nick+" ha sido registrado");
        }
        return res;
    }

    this.obtenerUsuarios=function(){
        let list = Object.keys(this.usuarios);
        if (list.length==0)
            return {usuarios:-1};
        return {usuarios: this.usuarios};
    }

    this.obtenerTodosNick=function(){
        return Object.keys(this.usuarios);
    }
    
    this.usuarioActivo=function(nick){
        let res={activo:false};
        res.activo=(nick in this.usuarios);
        return res;
    }
    
    this.eliminarUsuario=function(nick){
        let res={"usuario_eliminado":-1};
        if (this.usuarios[nick]){
            delete(this.usuarios[nick]);
            console.log("Se ha eliminado el usuario con nick " + nick);
            res.usuario_eliminado = nick;
        }
        else {
            console.log("No existe un usuario con nick " + nick);
        }
        return res;
    }

    this.numeroUsuarios=function(){
        let list = Object.keys(this.usuarios);
        return {num: list.length};
    }

    this.registrarUsuario=function(obj,callback){
        let modelo=this;
        if (!obj.nick){
            obj.nick=obj.email;
        }
        this.cad.buscarUsuario({"email":obj.email},function(usr){
            if (!usr){
                //el usuario no existe, luego lo puedo registrar
                obj.key=Date.now().toString();
                obj.confirmada=false; 
                bcrypt.hash(obj.password, 10, function (err, hash) {
                    obj.password = hash;
                    modelo.cad.insertarUsuario(obj,function(res){
                        callback(res);
                    });
                });
                console.log/({obj});
                correo.enviarEmail(obj.email,obj.key,"Confirmar cuenta");
            }
            else
            {
                callback({"email":-1});
            }
        });
    }

    this.loginUsuario = function (obj, callback) {
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

}

function Usuario(nick){
    this.nick=nick;
    this.email;
    this.clave;
}

module.exports.Sistema=Sistema;
