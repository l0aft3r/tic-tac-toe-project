function Cell() {
    let value = 0;

    const addToken = (player) => {
        value = player;
    };

    const getValue = () => value;

    return {
        addToken,
        getValue
    }
}

function Gameboard() {
    let gameboard = [];
    const rows = 3;
    const columns = 3;

    const resetBoard = () => {
        for (let i = 0; i < rows; i++) {
            gameboard[i] = [];
            for (let j = 0; j < columns; j++) {
                gameboard[i].push(Cell());
            }
        }
    };

    resetBoard()

    //gameboard[0][2].addToken(1);
    //gameboard[1][2].addToken(1);

    const getBoard = () => gameboard;

    const isOccupied = (row, column) => !!gameboard[row][column].getValue();

    const dropToken = (row, column, player) => {
        gameboard[row][column].addToken(player); //Return null if cell is already occupied
        return checkWinner(row, column, player);
    };

    const checkWinner = (row, column, player) => {
        if (gameboard[row].filter((col) => col.getValue() === player).length === 3) {
            return true
        } else if ( //If 3 same tokens in a column
            gameboard[0][column].getValue() === player && gameboard[1][column].getValue() === player && gameboard[2][column].getValue() === player 
        ) {
            return true
        } else if(gameboard[1][1].getValue() === player) {
            return gameboard[0][0].getValue() === player && gameboard[2][2].getValue() === player || gameboard[0][2].getValue() === player && gameboard[2][0].getValue()? true: false;
        }
    };

    const printBoard = () => {
        const boardWithValues = gameboard.map((row) => row.map((cell) => cell.getValue()));
        console.log(boardWithValues)
    };

    return {getBoard, dropToken, printBoard, isOccupied, resetBoard};
}

function GameController(playerOneName = "Player1", playerTwoName = "Player2") {
    const board = Gameboard();
    let gameEnded = false;
    let movesPlayed = 0;

    const players = [
        {
            name: playerOneName,
            token: 1,
            score: 0
        },
        {
            name: playerTwoName,
            token: 2,
            score: 0
        }
    ];

    let activePlayer = players[0];

    const addScore = (winner) => {
        winner.score++;
    }

    const changeName = (index, newName) => {
        players[index].name = newName;
    }

    const getScores = () => [players[0].score, players[1].score];

    const resetGame = () => {
        players[0].score = 0;
        players[1].score = 0;
        gameEnded = false;
        movesPlayed = 0;
        board.resetBoard();
        activePlayer = players[0];
        return;
    };

    const switchPlayerTurn = () => {
        activePlayer = activePlayer === players[0]? players[1]: players[0];
    };

    const getActivePlayer = () => activePlayer;

    const printNewRound = () => {
        board.printBoard();
        console.log(`${getActivePlayer().name}'s turn.`);
    };

    const printAlreadyOccupied = () => {
        console.log("Cell is already Occupied");
    };

    const printWinner = (player) => {
        console.log(`${player.name} won!`);
    };

    const playRound = (row, column) => {
        if (gameEnded) {
            gameEnded = false;
            movesPlayed = 0;
            board.resetBoard();
            activePlayer = players[0];
            return;
        } else if (board.isOccupied(row,column)) {
            printAlreadyOccupied();
            return;
        } else if (board.dropToken(row, column, activePlayer.token)) { //If someone won
            printWinner(getActivePlayer());
            addScore(getActivePlayer());
            gameEnded = true;
            return getActivePlayer().name;
        }
        movesPlayed++;
        switchPlayerTurn();
        printNewRound();
        if (movesPlayed >= 9) {
            gameEnded = true
            movesPlayed = 0;
            return 'tie';
        }
    }

    printNewRound();

    return {
        playRound,
        getActivePlayer,
        getBoard: board.getBoard,
        changeName,
        getScores,
        resetGame
    };
}

function ScreenController() {
    const game = GameController();
    const playerTurnDiv = document.querySelector('.turn');
    const boardDiv = document.querySelector('.board');
    const dialog = document.querySelector('.declare');
    const inputOne = document.querySelector('.player1');
    const inputTwo = document.querySelector('.player2');
    const scoreOne = document.querySelector('.scoreOne');
    const scoreTwo = document.querySelector('.scoreTwo');
    const resetBtn = document.querySelector('.resetBtn');

    resetBtn.addEventListener("click", () => {
        console.log('H')
        game.resetGame();
        updateScreen();
    });

    inputOne.addEventListener("input", () => {
        game.changeName(0, inputOne.value);
        updateScreen();
    });

    inputOne.addEventListener("onchange", () => {
        game.changeName(1, inputTwo.value);
        updateScreen();
    });
    
    dialog.close();

    dialog.addEventListener("click", () => {
        game.playRound(0,0);
        updateScreen();
        dialog.close();
    });

    const updateScreen = () => {
        boardDiv.textContent = "";
        
        const board = game.getBoard();
        const activePlayer = game.getActivePlayer();

        playerTurnDiv.textContent = `${activePlayer.name}'s turn...`;
        scoreOne.textContent = `Score: ${game.getScores()[0]}`;
        scoreTwo.textContent = `Score: ${game.getScores()[1]}`;

        board.forEach((row, rowIndex) => {
            row.forEach((cell, index) => {
                const cellButton = document.createElement("button");
                cellButton.classList.add("cell");

                cellButton.dataset.column = index;
                cellButton.dataset.row = rowIndex;
                cellButton.textContent = (() => {
                    switch (cell.getValue()){
                        case 0:
                            return '';
                        case 1:
                            return 'X';
                        case 2: 
                            return 'O';
                    }
                })();
                boardDiv.appendChild(cellButton);
            })
        })
    }

    function clickHandlerBoard(e) {
        const selectedColumn = e.target.dataset.column;
        const selectedRow = e.target.dataset.row;

        if (!selectedColumn || !selectedRow) return;

        const result = game.playRound(selectedRow, selectedColumn);
        updateScreen();
        if (result) {
            if (result === 'tie') {
                dialog.textContent = "It's a tie!";
            } else {
                dialog.textContent = `${result} wins!`;
            }
            dialog.showModal();
        }
    }
    boardDiv.addEventListener("click", clickHandlerBoard);

    updateScreen();
}

ScreenController();