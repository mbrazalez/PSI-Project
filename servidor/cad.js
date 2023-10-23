function CAD(){
    const mongo = require("mongodb").MongoClient;
    const ObjectId = require('mongodb').ObjectId;
    this.usuarios;

    this.conectar=async function(callback){
        try{
            let cad = this;
            let client = new
            mongo("mongodb+srv://mbrazalez:chanchi@cluster0.bi8a5yc.mongodb.net/?retryWrites=true&w=majority");
            await client.connect();
            const database = client.db("sistema");
            cad.usuarios = database.collection("usuarios");
            callback(database);
        }catch(error){
            console.log(error);
        }
    }

    this.buscarOCrearUsuario=function(email,callback){
            obtenerOCrear(this.usuarios,{email:email},callback);
        }
    
        function obtenerOCrear(coleccion,criterio,callback){
            coleccion.findOneAndUpdate(criterio, {$set: criterio}, {upsert: true,returnDocument:"after",projection:{email:1}}, function(err,doc) {
            if (err) { throw err; }
            else {
                console.log("Elemento actualizado");
                console.log(doc.value.email);
                callback({email:doc.value.email});
            }
        });
    }
    
    
}

module.exports.CAD = CAD;