const gameBoard = (() => {
    let board = [
                    ["", "", ""],
                    ["", "", ""],
                    ["", "", ""]
                ];
    
    const getBoard = () => board;
    const placeToken = (token, x, y) => {
        //Reversing board array flips board vertically so board[0][0] is bottom left rather than top left.
        //Temporary flip makes x and y coordinates less confusing to use.
        let rotatedBoard = board.reverse();
        rotatedBoard[x - 1][y - 1] = token;
        board = rotatedBoard.reverse();
    };

    return { getBoard, placeToken };
})();

const Player = (name = "Player1", token = "x") => {
    const getName = () => name;
    const getToken = () => token;

    return { getName, getToken };
};

const game = (() => {
    let players = [Player("Player1", "x"), Player("Player2", "o")];

    const getPlayers = () => players;
    const getCurrentPlayer = () => players[0];
    const swapCurrentPlayer = () => {
        players = players.reverse();
    };

    const play = () => {
        displayController.initializeBoard();
        displayController.setTurnDisplay(`It's your turn, ${getCurrentPlayer().getName()}!`);
        
    };

    return { play, getPlayers, getCurrentPlayer, swapCurrentPlayer };
})();

const displayController = (() => {
    const getBoard = () => document.querySelector(".board");

    const setTurnDisplay = (text) => {
        turnDisplay = document.querySelector(".turn-display");
        turnDisplay.textContent = text;
    };

    const populateBoard = () => {
        const board = getBoard();
        let rowNum = 3;
        let colNum = 1;

        gameBoard.getBoard().flat().forEach(token => {
            let boardSquare = document.createElement("div");
            boardSquare.classList.add("board-square");
            boardSquare.setAttribute("data-row", rowNum);
            boardSquare.setAttribute("data-column", colNum);
            boardSquare.textContent = token;
            board.appendChild(boardSquare);

            if (boardSquare.dataset.column == 3) {
                rowNum--;
                colNum = 1;
            } else {
                colNum++;
            }
        });
    };

    const makeSquaresClickable = () => {
        const boardSquares = document.querySelectorAll(".board-square");
        boardSquares.forEach(square => {
            square.addEventListener("click", () => {
                const currentPlayerToken = game.getCurrentPlayer().getToken();
                square.textContent = currentPlayerToken;
                gameBoard.placeToken(currentPlayerToken, square.dataset.row, square.dataset.column);
                game.swapCurrentPlayer();
                setTurnDisplay(game.getCurrentPlayer().getName());
            });
        });
    };

    const initializeBoard = () => {
        setTurnDisplay(game.getCurrentPlayer().getName());
        populateBoard();
        makeSquaresClickable();
    };

    return { initializeBoard };
})();

game.play();