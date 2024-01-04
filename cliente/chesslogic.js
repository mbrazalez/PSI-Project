function ChessLogic(){ 
    let board;
    let game;
    this.playerColor=undefined;
    this.gameOver=false;
    this.gameHasStarted=false;

    // This function is used for creating the board and the game
    this.initGame = function(){
        var conf = {
            draggable: true,
            position: 'start',
            onDragStart: logic.onDragStart,
            onDrop: logic.handleMove,
            onSnapEnd: logic.onSnapEnd
        }
        board = new ChessBoard('gameBoard',conf);
        game = new Chess();
        logic.isBlack();
    };

     // Function controlling when you can move the pieces
     this.onDragStart = function (source, piece, position, orientation) {
        // do not pick up pieces if the game is over

        if (game.game_over()) return false
        if (!logic.gameHasStarted) return false;
        if (logic.gameOver) return false;
    
        if ((logic.playerColor === 'black' && piece.search(/^w/) !== -1) || (logic.playerColor === 'white' && piece.search(/^b/) !== -1)) {
            return false;
        }
    
        // only pick up pieces for the side to move
        if ((game.turn() === 'w' && piece.search(/^b/) !== -1) || (game.turn() === 'b' && piece.search(/^w/) !== -1)) {
            return false
        }
    };

    // Function for handling the moves during the game
    this.handleMove = function (source, target){
        var move = game.move({from:source, to:target});
        if (move === null) return 'snapback';
        ws.newMove(move)
        logic.updateStatus();
    };

    // Function for updating the board after a move
    this.onSnapEnd = function () {
        board.position(game.fen())
    };

    // Function for getting the move of the other player and update the board
    this.updateBoard = function(move){
        game.move(move);
        board.position(game.fen());
        logic.updateStatus();
    }

    // Function for flipping the board if the player is black
    this.isBlack = function(){
        if (logic.playerColor == 'black'){
            logic.gameHasStarted = true;
            logic.startGame();
            board.flip();
        }
    };

    // Function for starting the game when the two players are in the lobby
    this.startGame = function(){
        logic.gameHasStarted = true;
        ws.startGame();
    };


    // Function for updating the status of the game
    this.updateStatus = function() {
        var status = ''

        var moveColor = 'White'
        if (game.turn() === 'b') {
            moveColor = 'Black'
        }
    
        // checkmate?
        if (game.in_checkmate()) {
            status = 'Game over, ' + moveColor + ' is in checkmate.'
        }
    
        // draw?
        else if (game.in_draw()) {
            logic.status = 'Game over, drawn position'
            logic.gameOver = true;
        }
    
        else if (logic.gameOver) {
            logic.status = 'Opponent disconnected, you win!'
            logic.gameOver = true;
        }
    
        else if (!logic.gameHasStarted) {
            status = 'Waiting for black to join'
        }
    
        // game still on
        else {
            status = moveColor + ' to move'
    
            // check?
            if (game.in_check()) {
                status += ', ' + moveColor + ' is in check'
            }
            
        }
    };
}