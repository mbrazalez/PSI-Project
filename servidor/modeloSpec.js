 const e = require('express');
const modelo = require('./modelo.js');
 
 describe('El sistema', function() {
    let sistema;
  
  beforeEach(function() {
    sistema=new modelo.Sistema()
  });
  
  it('inicialmente no hay usuarios', function() {
    let res = sistema.numeroUsuarios();
    expect(res.num).toEqual(0);
   });

  it('Agregar un usuario', function() {
    let res = sistema.numeroUsuarios();
    expect(res.num).toEqual(0);
    sistema.agregarUsuario("Juan");
    res = sistema.numeroUsuarios();
    expect(res.num).toEqual(1);
    expect(sistema.usuarios["Juan"].nick).toEqual("Juan");

  });

  it('Eliminar un usuario', function() {  
    let res=sistema.numeroUsuarios();
    expect(res.num).toEqual(0);
    sistema.agregarUsuario("Juan");
    res = sistema.numeroUsuarios();
    expect(res.num).toEqual(1);
    let res2 = sistema.eliminarUsuario("Juan");
    expect(res2.nick).toEqual("Juan");
    res = sistema.eliminarUsuario("Pepe");
    expect(res.nick).toEqual(-1);
    res = sistema.numeroUsuarios();
    expect(res.num).toEqual(0);
  });

  it('Usuario activo', function() {
    let res = sistema.usuarioActivo("Juan");
    expect(res.activo).toEqual(false);
    sistema.agregarUsuario("Juan");
    res = sistema.usuarioActivo("Juan");
    expect(res.activo).toEqual(true);
  });

  it('Obtener usuarios', function() {
    let res = sistema.obtenerUsuarios();
    expect(res.usuarios).toEqual(-1);
    sistema.agregarUsuario("Juan");
    sistema.agregarUsuario("Pepe");
    res = sistema.obtenerUsuarios();
    expect(Object.keys(res.usuarios)).toEqual(["Juan","Pepe"]);
  });

  it('Numero de usuarios', function() {
    let res = sistema.numeroUsuarios();
    expect(res.num).toEqual(0);
    sistema.agregarUsuario("Juan");
    sistema.agregarUsuario("Pepe");
    res = sistema.numeroUsuarios();
    expect(res.num).toEqual(2);
  });

});