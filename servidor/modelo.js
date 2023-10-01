function Sistema(){
    this.usuarios={};
    this.agregarUsuario=function(nick){
        console.log("Agregando usuario "+nick);
        if (this.usuarioActivo[nick]){
            console.log("El usuario ya existe");
        }else{
            this.usuarios[nick]=new Usuario(nick);
        }
    }
    this.obtenerUsuarios=function(){
        return this.usuarios;
    }

    this.obtenerTodosNick=function(){
        return Object.keys(this.usuarios);
    }
    
    this.usuarioActivo=function(nick){
        return (nick in this.usuarios);
    }
    
    this.eliminarUsuario=function(nick){
        if (this.usuarioActivo(nick))
            delete this.usuarios[nick];
        else
            console.log("El usuario no existe");
    }

    this.numeroUsuarios=function(){
        return Object.keys(this.usuarios).length;
    }

}
function Usuario(nick){
    this.nick=nick;
}

module.exports.Sistema=Sistema;
