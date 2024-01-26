// Import the ClienteRest class
const ClienteRest = require('../clienteRest');

// Test case 1: Test the enviarJwt function
test('Test enviarJwt function', () => {
  const cliente = new ClienteRest();
  const jwt = 'example-jwt';

  // Mock the ajax request
  $.ajax = jest.fn((options) => {
    options.success({ email: 'example-email' });
  });

  cliente.enviarJwt(jwt);

  // Verify the cookie is set
  expect($.cookie).toHaveBeenCalledWith('email', 'example-email');

  // Verify the showMsg function is called
  expect(cw.showMsg).toHaveBeenCalledWith('Welcome to the system!', 'example-email');
});

// Test case 2: Test the registrarUsuario function
test('Test registrarUsuario function', () => {
  const cliente = new ClienteRest();
  const email = 'example-email';
  const password = 'example-password';
  const nick = 'example-nick';

  // Mock the ajax request
  $.ajax = jest.fn((options) => {
    options.success({ email: 'example-email' });
  });

  cliente.registrarUsuario(email, password, nick);

  // Verify the showLogin function is called
  expect(cw.showLogin).toHaveBeenCalled();

  // Verify the showModal function is not called
  expect(cw.showModal).not.toHaveBeenCalled();
});

// Test case 3: Test the loginUsuario function
test('Test loginUsuario function', () => {
  const cliente = new ClienteRest();
  const email = 'example-email';
  const password = 'example-password';

  // Mock the ajax request
  $.ajax = jest.fn((options) => {
    options.success({ email: 'example-email' });
  });

  cliente.loginUsuario(email, password);

  // Verify the cookie is set
  expect($.cookie).toHaveBeenCalledWith('email', 'example-email');

  // Verify the checkSession function is called
  expect(cw.checkSession).toHaveBeenCalled();

  // Verify the showModal function is not called
  expect(cw.showModal).not.toHaveBeenCalled();
});

// Test case 4: Test the cerrarSesion function
test('Test cerrarSesion function', () => {
  const cliente = new ClienteRest();

  // Mock the getJSON request
  $.getJSON = jest.fn((url, callback) => {
    callback();
  });

  cliente.cerrarSesion();

  // Verify the eliminarUsuario function is called
  expect(rest.eliminarUsuario).toHaveBeenCalled();
});

// Test case 5: Test the agregarUsuario function
test('Test agregarUsuario function', () => {
  const cliente = new ClienteRest();
  const email = 'example-email';

  // Mock the getJSON request
  $.getJSON = jest.fn((url, callback) => {
    callback({ email: 'example-email' });
  });

  cliente.agregarUsuario(email);

  // Verify the cookie is set
  expect($.cookie).toHaveBeenCalledWith('email', 'example-email');
});

// Test case 6: Test the eliminarUsuario function
test('Test eliminarUsuario function', () => {
  const cliente = new ClienteRest();
  const email = 'example-email';

  // Mock the getJSON request
  $.getJSON = jest.fn((url, callback) => {
    callback({ usuario_eliminado: 'example-email' });
  });

  cliente.eliminarUsuario(email);

  // Verify the console.log is not called
  expect(console.log).not.toHaveBeenCalled();
});

// Test case 7: Test the usuarioExiste function
test('Test usuarioExiste function', () => {
  const cliente = new ClienteRest();
  const email = 'example-email';

  // Mock the getJSON request
  $.getJSON = jest.fn((url, callback) => {
    callback({ usuario: 'example-email' });
  });

  const result = cliente.usuarioExiste(email);

  // Verify the result is true
  expect(result).toBe(true);
});