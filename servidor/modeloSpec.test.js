const e = require('express');
const modelo = require('./modelo.js');

 describe('El sistema', function() {
    let sistema;
    let usrTest = { email: "test@test.es", password: "test", nick: "test" };
    let usrTest2 = { email: "test2@test.es", password: "test", nick: "test" };
    
  beforeEach(function() {
    sistema=new modelo.Sistema()
  }); 

  it('Agregar un usuario', function() {
    let res = sistema.numeroUsuarios();
    expect(res.num).toEqual(0);
    sistema.agregarUsuario("Juan");
    res = sistema.numeroUsuarios();
    expect(res.num).toEqual(1);
    expect(sistema.usuarios["Juan"].email).toEqual("Juan");

  });

  it('Eliminar un usuario', function() {  
    let res=sistema.numeroUsuarios();
    expect(res.num).toEqual(0);
    sistema.agregarUsuario("Juan");
    res = sistema.numeroUsuarios();
    expect(res.num).toEqual(1);
    let res2 = sistema.eliminarUsuario("Juan");
    expect(res2.usuario_eliminado).toEqual("Juan");
    res = sistema.eliminarUsuario("Pepe");
    expect(res.usuario_eliminado).toEqual(-1);
    res = sistema.numeroUsuarios();
    expect(res.num).toEqual(0);
  });

  describe("Metodos que acceden a datos", function () {    
    beforeEach(function (done) {
      sistema.cad.conectar(function () {
        // sistema.registrarUsuario(usrTest, function () {
          //     sistema.confirmarCuenta(usrTest.email, function(){
          done();
              //  })
        //});
        // done();
      });
    })

    it("Inicio de sesión correcto", function (done) {
      sistema.loginUsuario(usrTest, function(res){
        expect(res.email).toEqual(usrTest.email);
        done();
      });
    });

    it("Inicio de sesión incorrecto", function (done) {
      sistema.loginUsuario(usrTest2, function(res){
        expect(res.email).toEqual(-1);
        done();
      });
    });
  });


  describe("Metodos para comprobar las partidas", function () {
    
    beforeEach(function () {
      sistema.agregarUsuario(usrTest.email);
      sistema.agregarUsuario(usrTest2.email);
    });

    it("Crear partida", function () {
      sistema.crearPartida(usrTest.email);
      expect(sistema.obtenerPartidasDisponibles().length).toEqual(1);
    });

    it("Unirse a partida", function () {
      let codigo = sistema.crearPartida(usrTest.email);
      sistema.unirAPartida(usrTest2.email,codigo);
      expect(sistema.obtenerPartidasDisponibles().length).toEqual(0);
    });
    
    it("Eliminar partida", function () {
      let codigo = sistema.crearPartida(usrTest.email);
      expect(sistema.obtenerPartidasDisponibles().length).toEqual(1);
      sistema.unirAPartida(usrTest2.email,codigo);
      sistema.eliminarPartida(codigo);
      expect(sistema.obtenerPartidasDisponibles().length).toEqual(0);
    });
    
  });


});