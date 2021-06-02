const gameBoard = (() => {
    let board = [
                    ["", "", ""],
                    ["", "", ""],
                    ["", "", ""]
                ];

    const getBoard = () => board;
    const getRows = () => board;
    const getColumns = () => {
        let columns = [];
        for (let i = 0; i <= 2; i++) {
            columns.push(getRows().map(row => row[i]));
        }

        return columns;
    };
    const getDiagonals = () => {
        const diagonal1 =  getColumns().map((column, index) => column[index]);
        const diagonal2 = getColumns().reverse().map((column, index) => column[index]);

        return [diagonal1, diagonal2];
    };
    const placeToken = (token, x, y) => {
        //Reversing board array flips board vertically so board[0][0] is bottom left rather than top left.
        //Temporary flip makes x and y coordinates less confusing to use.
        let rotatedBoard = board.reverse();
        rotatedBoard[x - 1][y - 1] = token;
        board = rotatedBoard.reverse();
    };

    return { getBoard, getRows, getColumns, getDiagonals, placeToken };
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
        
    };

    const isWinner = () => {
        const rows = gameBoard.getRows();
        const columns = gameBoard.getColumns();
        const diagonals = gameBoard.getDiagonals();
        let matchingLine;
        [rows, columns, diagonals].forEach(direction => {
            direction.forEach(line => {
                if (line.every(token => token === "x") || line.every(token => token === "o")) {
                    matchingLine = true;
                }
            });
        });

        return matchingLine || false;
    };

    return { play, getPlayers, getCurrentPlayer, swapCurrentPlayer, isWinner };
})();

const displayController = (() => {
    const getBoard = () => document.querySelector(".board");
    const getBoardSquares = () => document.querySelectorAll(".board-square");
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
        const playMove = (e) => {
            if (e.target.textContent != "") return;
            const currentPlayerToken = game.getCurrentPlayer().getToken();
            e.target.textContent = currentPlayerToken;
            gameBoard.placeToken(currentPlayerToken, e.target.dataset.row, e.target.dataset.column);
            if (game.isWinner()) {
                setTurnDisplay(`Congrats ${game.getCurrentPlayer().getName()}, you won!`);
                makeSquaresUnclickable();
                return;
            }
            game.swapCurrentPlayer();
            setTurnDisplay(game.getCurrentPlayer().getName());
        };
        const makeSquaresUnclickable = () => {
            getBoardSquares().forEach(square => square.removeEventListener("click", playMove));
        };
        getBoardSquares().forEach(square => {
            square.addEventListener("click", playMove);
        });
    };
    const initializeBoard = () => {
        setTurnDisplay(game.getCurrentPlayer().getName());
        populateBoard();
        makeSquaresClickable();
    };

    return { initializeBoard, getBoardSquares };
})();

game.play();