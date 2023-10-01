 const modelo = require('./modelo.js');
 
 describe('El sistema', function() {
    let sistema;
  
  beforeEach(function() {
    sistema=new modelo.Sistema()
  });
  
  it('inicialmente no hay usuarios', function() {
    expect(sistema.numeroUsuarios()).toEqual(0);
   });

  it('agrega un usuario', function() {
    sistema.agregarUsuario("pepe");
    expect(sistema.numeroUsuarios()).toEqual(1);
  });

  it('agrega un usuario y lo devuelve', function() {
    sistema.agregarUsuario("pepe");
    expect(sistema.obtenerTodosNick()).toEqual(["pepe"]);
  });

  it('devuelve true si el usuario esta activo', function() {
    sistema.agregarUsuario("pepe");
    expect(sistema.usuarioActivo('pepe')).toBeTruthy();
  });

  it('elimina un usuario', function() {
    sistema.agregarUsuario("pepe");
    sistema.eliminarUsuario("pepe");
    expect(sistema.numeroUsuarios()).toEqual(0);
  });

  it('numero de usuarios', function() {
    sistema.agregarUsuario("pepe");
    sistema.agregarUsuario("juan");
    expect(sistema.numeroUsuarios()).toEqual(2);
  });

 });