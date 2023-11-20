function ServidorWS(){

    this.lanzarServidor=function(io){
        io.on('connection', function (socket) {
            console.log("Capa WS operativa");
        });
    }

};

module.exports.ServidorWS = ServidorWS;