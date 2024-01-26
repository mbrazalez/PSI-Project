function ChessLogic(){ 
    let board;
    let game;
    this.playerColor=undefined;
    this.gameOver=false;
    this.gameHasStarted=false;
    this.playingAgainstAI=false;

    // This function is used for creating the board and the game
    this.initGame = function(){
        if (logic.playingAgainstAI){
            var conf = {
                draggable: true,
                position: 'start',
                onDragStart: logic.onDragStartAI,
                onDrop: logic.onDropAI,
                onSnapEnd: logic.onSnapEnd
            }
        }else{
            var conf = {
                draggable: true,
                position: 'start',
                onDragStart: logic.onDragStart,
                onDrop: logic.handleMove,
                onSnapEnd: logic.onSnapEnd
            }
        }
      
        board = new ChessBoard('gameBoard',conf);
        game = new Chess();
        logic.isBlack();
    };

    this.onDragStartAI = function (source, piece, position, orientation) {
        // do not pick up pieces if the game is over
        if (game.game_over()) return false

        // only pick up pieces for White
        if (piece.search(/^b/) !== -1) return false
    };

    this.onDropAI = function (source, target) {
        // see if the move is legal
        var move = game.move({
            from: source,
            to: target,
            promotion: 'q' // NOTE: always promote to a queen for example simplicity
        })

        // illegal move
        if (move === null) return 'snapback';
        cw.showMove(move);
        // make random legal move for black
        window.setTimeout(logic.makeRandomMove, 250);
        logic.updateStatus();
    };

    this.makeRandomMove = function () {
        var possibleMoves = game.moves();

        // game over
        if (possibleMoves.length === 0) return

        var randomIndex = Math.floor(Math.random() * possibleMoves.length);
        let move = game.move(possibleMoves[randomIndex]);
        board.position(game.fen());
        console.log("Movimiento de la IA: ");
        console.log(possibleMoves[randomIndex]);
        cw.showMove(move);
        logic.updateStatus();
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
        var move = game.move({from:source, to:target, promotion:'q'});
        if (move === null) return 'snapback';
        console.log(move);
        cw.showMove(move);
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
    };

    // Function for flipping the board if the player is black
    this.isBlack = function(){
        console.log("Mi color es: " + logic.playerColor);
        if (logic.playerColor == 'black'){
            console.log("Flipo el tablero");
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
        var status = undefined;

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
            status = 'Game over, drawn position'
            logic.gameOver = true;
        }
    
        else if (logic.gameOver) {
            status = 'Opponent disconnected, you win!'
        }
    
        else if (!logic.gameHasStarted) {
            status = 'Waiting for black to join'
        }
    
        // game still on
        else {
            //status = moveColor + ' to move'
    
            // check?
            if (game.in_check()) {
                status = moveColor + ' is in check'
            }
        };
        console.log(status);
        cw.receiveChatMessage(status, true);
    };
}