const nodemailer = require('nodemailer');
//const url="https://procesos-bnruumvxca-ew.a.run.app/";
const url="http://localhost:3000/";
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
        subject: '¡Bienvenido a ProcessChess! Confirmación de cuenta',
        text: 'Pulsa aquí para confirmar cuenta',
        html: `
        <div style="background-color: #f4f4f4; padding: 20px; text-align: center;">
            <h2 style="color: #333;">¡Bienvenido a ProcessChess!</h2>
            <p style="color: #555; font-size: 16px;">Gracias por unirte a nuestra comunidad de ajedrez en línea. Para completar tu registro, simplemente haz clic en el enlace de abajo:</p>
            <p style="margin-top: 30px;">
                <a href="${url}confirmarUsuario/${direccion}/${key}" style="background-color: #007bff; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 16px;">Confirmar mi cuenta</a>
            </p>
            <p style="color: #555; font-size: 14px; margin-top: 20px;">¡Esperamos que disfrutes jugando al ajedrez con tus amigos en ProcessChess!</p>
        </div>
    `,    });
}