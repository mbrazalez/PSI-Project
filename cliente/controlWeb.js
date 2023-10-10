function ControlWeb(){
    this.mostrarAgregarUsuario=function(){
        $("#mAU").remove();
        let cadena = '<div id="mAU" class="form-group">';
        cadena += '<label for="nick">Introduce el nick:</label>';
        cadena += '<input type="text" class="form-control" id="nick">';
        cadena += '<button  id="btnAU" type="submit" class="btn btn-primary">Agregar usuario</button>';
        cadena += '</div>';
        $("#au").append(cadena);
        $("#btnAU").on("click", function(){
            let nick = $("#nick").val();
            if (nick){
                rest.agregarUsuario(nick);
            }
        });

        this.mostrarMsg= function(msg){
            $("#mMsg").remove();
            let cadena = '<div id="mMsg" class="alert alert-danger" role="alert">';
            cadena += msg;
            cadena += '</div>';
            $("#msg").append(cadena);
        }
        
    }
}