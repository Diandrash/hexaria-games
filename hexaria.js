document.addEventListener('DOMContentLoaded', () => {
    const gameBoard = document.getElementById('game-board');
    const currentPlayerDisplay = document.getElementById('current-player');

    const rows = 8;
    const cols = 10;
    let currentPlayer = 1; // Player 1 starts first

    // Initialize the game board with hexagons
    for (let row = 0; row < rows; row++) {
        const hexRow = document.createElement('div');
        hexRow.classList.add('hex-row');
        if (row % 2 === 1) {
            hexRow.classList.add('even');
        }

        for (let col = 0; col < cols; col++) {
            const hexagon = document.createElement('div');
            hexagon.classList.add('hexagon');
            hexagon.dataset.row = row;
            hexagon.dataset.col = col;

            const topDiv = document.createElement('div');
            topDiv.classList.add('top');

            const mainDiv = document.createElement('div');
            mainDiv.classList.add('main');

            const bottomDiv = document.createElement('div');
            bottomDiv.classList.add('bottom');

            hexagon.appendChild(topDiv);
            hexagon.appendChild(mainDiv);
            hexagon.appendChild(bottomDiv);

            hexagon.addEventListener('click', () => {
                if (hexagon.dataset.owner) {
                    // Jika heksagon sudah dimiliki, keluar dari fungsi
                    return;
                }
                // Set owner untuk heksagon
                hexagon.dataset.owner = currentPlayer;
                // Set warna main berdasarkan pemain saat ini
                mainDiv.style.backgroundColor = currentPlayer === 1 ? 'red' : 'yellow';
                // Set warna border
                topDiv.style.borderBottomColor = currentPlayer === 1 ? 'red' : 'yellow';
                bottomDiv.style.borderTopColor = currentPlayer === 1 ? 'red' : 'yellow';

                // Ganti giliran pemain
                currentPlayer = currentPlayer === 1 ? 2 : 1;
                currentPlayerDisplay.textContent = `Player ${currentPlayer}`;
            });

            hexRow.appendChild(hexagon);
        }

        gameBoard.appendChild(hexRow);
    }
});
