
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
        if (this.usuarios[nick.toString()]){
            delete this.usuarios[nick];
            return {nick:nick};
        }else{
            console.log("El usuario no existe");
            return {nick:-1};
        }
    }

    this.numeroUsuarios=function(){
        let list = Object.keys(this.usuarios);
        return {num: list.length};
    }

    this.buscarOCrearUsuario=function(email,callback){
        this.cad.buscarOCrearUsuario(email,function(obj){
            callback(obj);
        });
    }
}

function Usuario(nick){
    this.nick=nick;
    this.email;
    this.clave;
}

module.exports.Sistema=Sistema;
