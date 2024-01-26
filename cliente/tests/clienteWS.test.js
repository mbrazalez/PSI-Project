const ClienteWS = require('../clienteWS');

// Test case 1: Test the initialization of the ClienteWS class
test('Test initialization of ClienteWS class', () => {
  const cliente = new ClienteWS();
  expect(cliente.socket).toBeUndefined();
  expect(cliente.email).toBeUndefined();
  expect(cliente.code).toBeUndefined();
});

// Test case 2: Test the crearPartida function when email is undefined
test('Test crearPartida function with undefined email', () => {
  const cliente = new ClienteWS();
  console.log = jest.fn(); // Mock console.log
  const result = cliente.crearPartida();
  expect(console.log).toHaveBeenCalledWith('Tienes que estar registrado');
  expect(result).toBe(false);
});

// Test case 3: Test the crearPartida function when email is defined
test('Test crearPartida function with defined email', () => {
  const cliente = new ClienteWS();
  cliente.email = 'test@example.com';
  cliente.socket = {
    emit: jest.fn()
  };
  const result = cliente.crearPartida();
  expect(cliente.socket.emit).toHaveBeenCalledWith('crearPartida', { email: 'test@example.com' });
  expect(result).toBe(true);
});

// Test case 4: Test the unirAPartida function
test('Test unirAPartida function', () => {
  const cliente = new ClienteWS();
  cliente.email = 'test@example.com';
  cliente.code = '123456';
  cliente.socket = {
    emit: jest.fn()
  };
  cliente.unirAPartida('ABCDEF');
  expect(cliente.socket.emit).toHaveBeenCalledWith('unirAPartida', { email: 'test@example.com', codigo: 'ABCDEF' });
});

// Test case 5: Test the startGame function
test('Test startGame function', () => {
  const cliente = new ClienteWS();
  cliente.code = '123456';
  cliente.socket = {
    emit: jest.fn()
  };
  cliente.startGame();
  expect(cliente.socket.emit).toHaveBeenCalledWith('startGame', { codigo: '123456' });
});

// Test case 6: Test the newMove function
test('Test newMove function', () => {
  const cliente = new ClienteWS();
  cliente.code = '123456';
  cliente.socket = {
    emit: jest.fn()
  };
  cliente.newMove({ from: 'e2', to: 'e4' });
  expect(cliente.socket.emit).toHaveBeenCalledWith('move', { codigo: '123456', move: { from: 'e2', to: 'e4' } });
});

// Test case 7: Test the leftGame function
test('Test leftGame function', () => {
  const cliente = new ClienteWS();
  cliente.email = 'test@example.com';
  cliente.code = '123456';
  cliente.socket = {
    emit: jest.fn()
  };
  console.log = jest.fn(); // Mock console.log
  cliente.leftGame();
  expect(console.log).toHaveBeenCalledWith('El jugador test@example.com ha abandonado la partida');
  expect(cliente.socket.emit).toHaveBeenCalledWith('leftGame', { email: 'test@example.com', codigo: '123456' });
});

// Test case 8: Test the sendChatMessage function
test('Test sendChatMessage function', () => {
  const cliente = new ClienteWS();
  cliente.code = '123456';
  cliente.socket = {
    emit: jest.fn()
  };
  cliente.sendChatMessage('Hello, world!');
  expect(cliente.socket.emit).toHaveBeenCalledWith('chat', { codigo: '123456', msg: 'Hello, world!' });
});