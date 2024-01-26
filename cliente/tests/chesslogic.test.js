// Import the ChessLogic class
const ChessLogic = require('../chesslogic');

// Test case 1: Test the initialization of the game
test('Test initialization of the game', () => {
  const logic = new ChessLogic();
  logic.initGame();
  expect(logic.playerColor).toBeUndefined();
  expect(logic.gameOver).toBe(false);
  expect(logic.gameHasStarted).toBe(false);
  expect(logic.vsMachines).toBe(false);
});

// Test case 2: Test the onDragStart function
test('Test onDragStart function', () => {
  const logic = new ChessLogic();
  logic.initGame();
  logic.playerColor = 'white';
  logic.gameOver = false;
  logic.gameHasStarted = true;
  logic.vsMachines = false;

  // Test when the game is not over and the player color is white
  expect(logic.onDragStart('a2', 'wp', 'start', 'white')).toBe(false);

  // Test when the game is over
  logic.gameOver = true;
  expect(logic.onDragStart('a2', 'wp', 'start', 'white')).toBe(false);

  // Test when the game has not started
  logic.gameOver = false;
  logic.gameHasStarted = false;
  expect(logic.onDragStart('a2', 'wp', 'start', 'white')).toBe(false);

  // Test when the player color is black and the piece is white
  logic.gameHasStarted = true;
  logic.playerColor = 'black';
  expect(logic.onDragStart('a2', 'wp', 'start', 'white')).toBe(false);

  // Test when the player color is white and the piece is black
  logic.playerColor = 'white';
  expect(logic.onDragStart('a2', 'bp', 'start', 'white')).toBe(false);

  // Test when it is not the turn of the player
  expect(logic.onDragStart('a2', 'wp', 'start', 'black')).toBe(false);
});

// Test case 3: Test the handleMove function
test('Test handleMove function', () => {
  const logic = new ChessLogic();
  logic.initGame();
  logic.updateStatus = jest.fn();

  // Test a valid move
  logic.handleMove('e2', 'e4');
  expect(logic.updateStatus).toHaveBeenCalled();

  // Test an invalid move
  logic.handleMove('e2', 'e5');
  expect(logic.updateStatus).not.toHaveBeenCalled();
});

// Test case 4: Test the onSnapEnd function
test('Test onSnapEnd function', () => {
  const logic = new ChessLogic();
  logic.initGame();
  logic.updateStatus = jest.fn();

  logic.onSnapEnd();
  expect(logic.updateStatus).toHaveBeenCalled();
});

// Test case 5: Test the updateBoard function
test('Test updateBoard function', () => {
  const logic = new ChessLogic();
  logic.initGame();
  logic.updateStatus = jest.fn();

  logic.updateBoard({ from: 'e2', to: 'e4', promotion: 'q' });
  expect(logic.updateStatus).toHaveBeenCalled();
});

// Test case 6: Test the isBlack function
test('Test isBlack function', () => {
  const logic = new ChessLogic();
  logic.initGame();
  logic.startGame = jest.fn();
  logic.board.flip = jest.fn();

  // Test when the player color is black
  logic.playerColor = 'black';
  logic.isBlack();
  expect(logic.startGame).toHaveBeenCalled();
  expect(logic.board.flip).toHaveBeenCalled();

  // Test when the player color is white
  logic.playerColor = 'white';
  logic.isBlack();
  expect(logic.startGame).not.toHaveBeenCalled();
  expect(logic.board.flip).not.toHaveBeenCalled();
});

// Test case 7: Test the startGame function
test('Test startGame function', () => {
  const logic = new ChessLogic();
  logic.initGame();
  logic.startGame();

  expect(logic.gameHasStarted).toBe(true);
});

// Test case 8: Test the updateStatus function
test('Test updateStatus function', () => {
  const logic = new ChessLogic();
  logic.initGame();
  logic.cw.receiveChatMessage = jest.fn();

  // Test when the game is in checkmate
  logic.game.in_checkmate = jest.fn(() => true);
  logic.updateStatus();
  expect(logic.cw.receiveChatMessage).toHaveBeenCalledWith('Game over, Black is in checkmate.', true);

  // Test when the game is in a drawn position
  logic.game.in_checkmate = jest.fn(() => false);
  logic.game.in_draw = jest.fn(() => true);
  logic.updateStatus();
  expect(logic.cw.receiveChatMessage).toHaveBeenCalledWith('Game over, drawn position', true);

  // Test when the game is over
  logic.gameOver = true;
  logic.updateStatus();
  expect(logic.cw.receiveChatMessage).toHaveBeenCalledWith('Opponent disconnected, you win!', true);

  // Test when the game has not started
  logic.gameOver = false;
  logic.gameHasStarted = false;
  logic.updateStatus();
  expect(logic.cw.receiveChatMessage).toHaveBeenCalledWith('Waiting for black to join', true);

  // Test when the game is still on
  logic.gameHasStarted = true;
  logic.game.in_check = jest.fn(() => true);
  logic.updateStatus();
  expect(logic.cw.receiveChatMessage).toHaveBeenCalledWith('Black is in check', true);
});