const gameBoard = (() => {
    const board = [
                    ["", "", ""],
                    ["", "", ""],
                    ["", "", ""]
                ];
    
    const getBoard = () => board;
    const placeToken = (token, x, y) => {
        board[x][y] = token;
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
        
        displayController.populateBoard();
        displayController.addEventListeners();
    };

    return { play, getPlayers, getCurrentPlayer, swapCurrentPlayer };
})();

const displayController = (() => {
    const getBoard = () => document.querySelector(".board");

    const populateBoard = () => {
        const board = getBoard();
        gameBoard.getBoard().flat().forEach(token => {
            let boardSquare = document.createElement("div");
            boardSquare.classList.add("board-square");
            boardSquare.textContent = token;
            board.appendChild(boardSquare);
        });
    };

    const addEventListeners = () => {
        const boardSquares = document.querySelectorAll(".board-square");
        boardSquares.forEach(square => {
            square.addEventListener("click", () => {
                square.textContent = game.getCurrentPlayer().getToken();
            });
        });
    };

    const updateBoard = () => {
        const board = getBoard();
        board.innerHTML = "";
        populateBoard(board);
    };

    return { populateBoard, updateBoard, addEventListeners };
})();

game.play();