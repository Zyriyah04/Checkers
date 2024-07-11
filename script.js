const board = document.getElementById('board');
const rows = 8;
const cols = 8;
let selectedPiece = null; // Track the current selected piece
let currentPlayer = 'white'; // Track the current player

// Function to create the initial board
const createBoard = () => {
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const square = document.createElement('div');
            square.classList.add('square');
            square.classList.add((row + col) % 2 === 0 ? 'light' : 'dark');
            square.dataset.row = row;
            square.dataset.col = col;
            board.appendChild(square);

            // Place pieces on the first three rows
            if (row < 3 && (row + col) % 2 === 1) {
                const piece = document.createElement('div');
                piece.classList.add('piece', 'black');
                piece.dataset.color = 'black';
                square.appendChild(piece);
            } 
            // Place pieces on the last three rows
            else if (row > 4 && (row + col) % 2 === 1) {
                const piece = document.createElement('div');
                piece.classList.add('piece', 'white');
                piece.dataset.color = 'white';
                square.appendChild(piece);
            }
        }
    }
};

// Function to move a piece to a new square
const movePiece = (square) => {
    if (selectedPiece && square.children.length === 0) {
        // Check if the move is valid
        if (isValidMove(selectedPiece.parentElement, square)) {
            square.appendChild(selectedPiece);
            selectedPiece = null;
            switchPlayer(); // Switch to the other player after a move
        }
    } 
    // Select a piece if it belongs to the current player
    else if (square.children.length > 0 && square.children[0].dataset.color === currentPlayer) {
        selectedPiece = square.children[0];
    }
};

// Function to check if a move is valid
const isValidMove = (fromSquare, toSquare) => {
    const fromRow = parseInt(fromSquare.dataset.row);
    const fromCol = parseInt(fromSquare.dataset.col);
    const toRow = parseInt(toSquare.dataset.row);
    const toCol = parseInt(toSquare.dataset.col);

    const rowDiff = Math.abs(toRow - fromRow);
    const colDiff = Math.abs(toCol - fromCol);

    return rowDiff === 1 && colDiff === 1;
};

// Function to switch the current player and CPU move if needed
const switchPlayer = () => {
    currentPlayer = currentPlayer === 'white' ? 'black' : 'white';
    if (currentPlayer === 'black') {
        setTimeout(cpuMove, 500); // Delay CPU move for 500ms
    }
};

// Function for the CPU to make a move
const cpuMove = () => {
    const pieces = Array.from(document.querySelectorAll('.piece.black'));
    const validMoves = pieces.map(piece => {
        const parent = piece.parentElement;
        const row = parseInt(parent.dataset.row);
        const col = parseInt(parent.dataset.col);
        return [
            { piece, toRow: row + 1, toCol: col - 1 },
            { piece, toRow: row + 1, toCol: col + 1 }
        ].filter(move => isValidMove(parent, getSquare(move.toRow, move.toCol)));
    }).flat();

    const move = validMoves[Math.floor(Math.random() * validMoves.length)];
    if (move) {
        const toSquare = getSquare(move.toRow, move.toCol);
        if (toSquare) {
            movePiece(toSquare);
        }
    }

    currentPlayer = 'pink'; // Switch back to the user after the CPU move
};

// Function to get a square by its row and column
const getSquare = (row, col) => {
    return document.querySelector(`.square[data-row="${row}"][data-col="${col}"]`);
};

// Event listener for handling user clicks on the board
board.addEventListener('click', (e) => {
    const square = e.target.closest('.square');
    if (square) movePiece(square);
});

// Initialize the board when the page loads
createBoard();
