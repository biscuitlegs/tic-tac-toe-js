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
    const resetBoard = () => {
        board = [
            ["", "", ""],
            ["", "", ""],
            ["", "", ""]
        ];
    };

    return { getBoard, getRows, getColumns, getDiagonals, placeToken, resetBoard };
})();

const Player = (playerName = "Player1", playerToken = "x", playerId = 1) => {
    let name = playerName;
    let token = playerToken;
    let id = playerId;
    const getPlayerId = () => id;
    const getName = () => name;
    const getToken = () => token;
    const setName = (newName) => name = newName;

    return { getName, getToken, setName, getPlayerId };
};

const game = (() => {
    let players = [Player("Player1", "x", 1), Player("Player2", "o", 2)];
    const getPlayers = () => players;
    const player1 = players.find(player => player.getPlayerId() === 1);
    const player2 =  players.find(player => player.getPlayerId() === 2);
    const getCurrentPlayer = () => players[0];
    const swapCurrentPlayer = () => {
        players = players.reverse();
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
    const isDraw = () => {
        return gameBoard.getBoard().flat().every(square => square != "");
    };
    const isGameOver = () => {
        return isWinner() || isDraw();
    };
    const newGameButton = document.querySelector(".new-game-btn");
    newGameButton.addEventListener("click", () => {
        displayController.resetBoard();
        gameBoard.resetBoard();
        displayController.populateBoard();
        const player1NameInput = document.querySelector(".player1-name-input");
        const player2NameInput = document.querySelector(".player2-name-input");
        player1.setName(player1NameInput.value || player1.getName());
        player2.setName(player2NameInput.value || player2.getName());
        displayController.setTurnDisplay(`<p>It's <span class="has-text-weight-bold">${getCurrentPlayer().getName()}</span>'s turn.</p>`);
        displayController.makeSquaresClickable();
    });

    return { getPlayers, getCurrentPlayer, swapCurrentPlayer, isWinner, isDraw, isGameOver };
})();

const displayController = (() => {
    const getBoard = () => document.querySelector(".board");
    const getBoardSquares = () => document.querySelectorAll(".board-square");
    const turnDisplay = document.querySelector(".turn-display");
    const setTurnDisplay = (html) => {
        turnDisplay.innerHTML = html;
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
            if (e.target.childElementCount > 0  || e.target != e.currentTarget) {
                return;
            }
            const currentPlayerToken = game.getCurrentPlayer().getToken();
            if (currentPlayerToken === "o") {
                e.target.insertAdjacentHTML("beforeend", `<i class="bi bi-circle"></i>`);
            } else {
                e.target.insertAdjacentHTML("beforeend", `<i class="bi bi-x-lg"></i>`);
            }
            gameBoard.placeToken(currentPlayerToken, e.target.dataset.row, e.target.dataset.column);
            if (game.isGameOver()) {
                switch (true) {
                    case game.isWinner():
                        setTurnDisplay(`<p>Congrats <span class="has-text-weight-bold">${game.getCurrentPlayer().getName()}</span>, you won!</p>`);
                        break;
                    case game.isDraw():
                        setTurnDisplay("<p>Well, looks like this game was a tie!<p>");
                        break;
                }
                makeSquaresUnclickable();
                
                return;
            }
            game.swapCurrentPlayer();
            setTurnDisplay(`<p>It's <span class="has-text-weight-bold">${game.getCurrentPlayer().getName()}</span>'s turn.<p>`);
        };
        const makeSquaresUnclickable = () => {
            getBoardSquares().forEach(square => square.removeEventListener("click", playMove));
        };
        getBoardSquares().forEach(square => {
            square.addEventListener("click", playMove);
        });
    };
    const resetBoard = () => {
        document.querySelector(".board").innerHTML = "";
    };

    return { populateBoard, makeSquaresClickable, getBoardSquares, resetBoard, setTurnDisplay };
})();

displayController.populateBoard();