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

    const players = [
        {
            name: playerOneName,
            token: 1
        },
        {
            name: playerTwoName,
            token: 2
        }
    ];

    let activePlayer = players[0];

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
        if (board.isOccupied(row,column)) {
            printAlreadyOccupied();
            return;
        }
        console.log(`Dropping ${getActivePlayer().name}'s token into row ${row}, column ${column}...`);
        if (board.dropToken(row, column, activePlayer.token)) { //If someone won
            printWinner();
            board.resetBoard();
        }
        switchPlayerTurn();
        printNewRound();
    }

    printNewRound();

    return {
        playRound,
        getActivePlayer,
        getBoard: board.getBoard
    };
}

const game = GameController();