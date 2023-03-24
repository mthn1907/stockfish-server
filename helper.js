export function fenToBoard(fen) {
    let board = [
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0]
    ];

    let fenArray = fen.split(" ");
    let fenPosition = fenArray[0].split("/");

    let rowNumber = 7;
    for (let rows of fenPosition) {
        let colNumber = 0;
        for (let square of rows.split("")) {
            switch (square) {
                case 'R':
                    board[rowNumber][colNumber] = 5;
                    colNumber++;
                    break;
                case 'N':
                    board[rowNumber][colNumber] = 2;
                    colNumber++;
                    break;
                case 'B':
                    board[rowNumber][colNumber] = 3;
                    colNumber++;
                    break;
                case 'Q':
                    board[rowNumber][colNumber] = 8;
                    colNumber++;
                    break;
                case 'K':
                    board[rowNumber][colNumber] = 9;
                    colNumber++;
                    break;
                case 'P':
                    board[rowNumber][colNumber] = 1;
                    colNumber++;
                    break;

                case 'r':
                    board[rowNumber][colNumber] = -5;
                    colNumber++;
                    break;
                case 'n':
                    board[rowNumber][colNumber] = -2;
                    colNumber++;
                    break;
                case 'b':
                    board[rowNumber][colNumber] = -3;
                    colNumber++;
                    break;
                case 'q':
                    board[rowNumber][colNumber] = -8;
                    colNumber++;
                    break;
                case 'k':
                    board[rowNumber][colNumber] = -9;
                    colNumber++;
                    break;
                case 'p':
                    board[rowNumber][colNumber] = -1;
                    colNumber++;
                    break;
                default:
                    colNumber += parseInt(square)
            }
        }
        rowNumber--;
    }

    return board
}

export function boardToFen(move, board, oldfen) {
    let oldFenArray = oldfen.split(" ");
    let columnArray = "abcdefgh".split("");

    let moveStartRow = move.charAt(1) - 1;
    let moveDestiRow = move.charAt(3) - 1;
    let moveStartCol = columnArray.indexOf(move.charAt(0));
    let moveDestiCol = columnArray.indexOf(move.charAt(2));

    let sourcePiece = board[moveStartRow][moveStartCol];
    let destinPiece = board[moveDestiRow][moveDestiCol];

    let FEN = oldFenArray;

    if (sourcePiece > 0) {
        FEN[1] = 'b';
    } else if (sourcePiece < 0) {
        FEN[1] = 'w'
        FEN[5] ++;
    }

    if (sourcePiece == 1 && moveDestiRow - moveStartRow == 2) {
        FEN[3] = move.charAt(0) + "3";
    } else if (sourcePiece == -1 && moveDestiRow - moveStartRow == -2) {
        FEN[3] = move.charAt(0) + "6";
    } else {
        FEN[3] = "-";
    }

    if (destinPiece != 0) {
        FEN[4] = 0;
    }

    if (sourcePiece == 9 && (move == "e1g1" || move == "e1c1")) {
        FEN[2] = FEN[2].replace("K", "").replace("Q", "");
    }

    if (sourcePiece == -9 && (move == "e8g8" || move == "e8c8")) {
        FEN[2] = FEN[2].replace("k", "").replace("q", "");
    }

    if (FEN[2] == "") {
        FEN[2] = "-";
    }

    let fen0 = [];

    board[moveStartRow][moveStartCol] = 0;
    switch (move) {
        case 'e8g8':
            board[7][7] = 0;
            board[7][5] = -5;
            break;
        case 'e8c8':
            board[7][0] = 0;
            board[7][3] = -5;
            break;
        case 'e1g1':
            board[0][7] = 0;
            board[0][5] = 5;
            break;
        case 'e1c1':
            board[0][0] = 0;
            board[0][3] = 5;
            break;
    }

    board[moveDestiRow][moveDestiCol] = sourcePiece;

    let shouldUpper = (sign, letter) => {
        if (sign) {
            return letter.toUpperCase();
        }

        return letter;
    }

    for (let i of board.reverse()) {
        let rowString = "";
        let zeroCounter = 0;
        for (let j of i) {
            let sign = Math.abs(j) == j;

            switch (Math.abs(j)) {
                case 0:
                    zeroCounter++;
                    break;
                case 1:
                    rowString += zeroCounter > 0 ? zeroCounter: "";
                    zeroCounter = 0;
                    rowString += shouldUpper(sign, "p");
                    break;
                case 2:
                    rowString += zeroCounter > 0 ? zeroCounter: "";
                    zeroCounter = 0;
                    rowString += shouldUpper(sign, "n");
                    break;
                case 3:
                    rowString += zeroCounter > 0 ? zeroCounter: "";
                    zeroCounter = 0;
                    rowString += shouldUpper(sign, "b");
                    break;
                case 5:
                    rowString += zeroCounter > 0 ? zeroCounter: "";
                    zeroCounter = 0;
                    rowString += shouldUpper(sign, "r");
                    break;
                case 8:
                    rowString += zeroCounter > 0 ? zeroCounter: "";
                    zeroCounter = 0;
                    rowString += shouldUpper(sign, "q");
                    break;
                case 9:
                    rowString += zeroCounter > 0 ? zeroCounter: "";
                    zeroCounter = 0;
                    rowString += shouldUpper(sign, "k");
                    break;
            }
        }

        if (zeroCounter > 0) {
            rowString += zeroCounter;
        }

        fen0.push(rowString);
    }

    FEN[0] = fen0.join("/");

    return FEN.join(" ");

}

function findPawn(column, board, turn) {
    let sign = turn == "w" ? 1 : -1;
    let indexes = "abcdefgh".split("");
    let index = indexes.indexOf(column);
    let row = 1;

    for (let i in board) {
        if (i[index] == sign) {
            break;
        }
        row++;
    }

    return column + row;
}

function findKnight(column, board, turn) {
    let sign = turn == "w" ? 1 : -1;
    let indexes = "abcdefgh".split("");
    let row = 1;
    let col = "";
    for (let i in board) {
        let ind = i.indexOf(2 * sign);
        if (ind > 0) {
            col = indexes[ind];
            break;
        }
        row++;
    }

    return column + row;
}

export function convertMove(move, board, turn) {
    if (move.length == 2) {
        let beginSquare = findPawn(move.charAt(0), board, turn);
        return beginSquare + move;
    }

    if (move.length == 3) {
        let firstChar = move.charAt(0).toLowerCase();
        switch (firstChar) {
            case 'n':
                let beginSquare = findKnight(board, turn);
        }

        return beginSquare + move;
    }
}