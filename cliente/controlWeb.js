function ControlWeb(){

    this.comprobarSesion = function(){
        let nick = $.cookie("nick");
        if(nick){
            cw.mostrarMsg("Bienvenido "+nick);
        }else{
            cw.mostrarAgregarUsuario();
        }
    }

    this.mostrarAgregarUsuario=function(){
        $('#bnv').remove();
        $('#mAU').remove();
        let cadena='<div id="mAU">';
        cadena = cadena + '<div class="card"><div class="card-body">';
        cadena = cadena +'<div class="form-group">';
        cadena = cadena + '<label for="nick">Nick:</label>';
        cadena = cadena + '<p><input type="text" class="form-control" id="nick" placeholder="introduce un nick"></p>';
        cadena = cadena + '<button id="btnAU" type="submit" class="btn btn-primary">Submit</button>';
        cadena=cadena+'<div><a href="/auth/google"><img src="./cliente/img/btn_google_signin_dark_focus_web@2x.png" style="height:40px;"></a></div>';
        cadena = cadena + '</div>';
        cadena = cadena + '</div></div></div>';
        $("#au").append(cadena);

        $("#btnAU").on("click", function(){
            let nick = $("#nick").val();
            if (nick){
                rest.agregarUsuario(nick);
            }
        });
    }

    this.mostrarMsg= function(msg){
        $("#mMsg").remove();
        let cadena = '<div id="mMsg" class="alert alert-danger" role="alert">';
        cadena += msg;
        cadena += '</div>';
        $("#msg").append(cadena);
    }


    this.eliminarUsuario = function(){
        $("#mEU").remove();
        let cadena = '<div id="mEU" class="form-group">';   
        cadena += '<label for="nick">Introduce el nick del usuario que deseas eliminar:</label>';
        cadena += '<input type="text" class="form-control" id="nick">';
        cadena += '<button id="btnEU" type="submit" class="btn btn-primary">Eliminar usuario</button>';
        cadena += '</div>';
        $("#eu").append(cadena);
        $("#btnEU").on("click", function(){
            let nick = $("#nick").val();
            if (nick){
                rest.eliminarUsuario(nick);
            }
        });
    }

    this.salir = function(){
        let nick = $.cookie("nick");
        $.removeCookie("nick");
        location.reload();
        cw.mostrarMsg("Sesión cerrada, hasta luego"+ nick);
    }


}