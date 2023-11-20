const nodemailer = require('nodemailer');
const url="https://procesos-bnruumvxca-ew.a.run.app/";
// const url="http://localhost:3000/";
const gv = require('./gestorVariables.js');
let transporter;
let options;

// const transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//         user: 'pacopepejimenez1@gmail.com',
//         pass: 'hygw iusz iqdj npzg'
//     }
// });

//send();

// gv.obtenerOptions(function(res){
//         options = res;
// });


module.exports.conectar=function(callback){
    gv.obtenerOptions(function(res){
        options=res;
        callback(res);
    });
}

module.exports.enviarEmail=async function(direccion, key, men) {
    
    transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: options
    });

    const result = await transporter.sendMail({
        from: options.user,
        to: direccion,
        subject: 'Confirmar cuenta',
        text: 'Pulsa aquí para confirmar cuenta',
        html: '<p>Bienvenido a Sistema</p><p><a href="'+url+'confirmarUsuario/'+direccion+'/'+key+'">Pulsa aquí para confirmar cuenta</a></p>'
    });
}