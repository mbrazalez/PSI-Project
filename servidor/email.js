const nodemailer = require('nodemailer');
const url="https://procesos-bnruumvxca-ew.a.run.app/";
//const url="http://localhost:3000/";


const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'pacopepejimenez1@gmail.com',
        pass: 'hygw iusz iqdj npzg'
    }
});

//send();

module.exports.enviarEmail=async function(direccion, key,men) {
    const result = await transporter.sendMail({
        from: 'pacopepejimenez1@gmail.com',
        to: direccion,
        subject: 'Confirmar cuenta',
        text: 'Pulsa aquí para confirmar cuenta',
        html: '<p>Bienvenido a Sistema</p><p><a href="'+url+'confirmarUsuario/'+direccion+'/'+key+'">Pulsa aquí para confirmar cuenta</a></p>'
    });
}