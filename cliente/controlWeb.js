function ControlWeb(){
    this.mostrarAgregarUsuario=function(){
        let cadena = '<div id="mAU" class="form-group">';
        cadena += '<label for="nick">Introduce el nick:</label>';
        cadena += '<input type="text" class="form-control" id="nick">';
        cadena += '<button  id="btnAU" type="submit" class="btn btn-primary">Agregar usuario</button>';
        cadena += '</div>';
        $("#au").append(cadena);
        $("#btnAU").on("click", function(){
            let nick = $("#nick").val();
            rest.agregarUsuario(nick);
            $("#mAU").remove();
        });
        
    }
}