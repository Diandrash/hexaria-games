document.addEventListener('DOMContentLoaded', () => {
    const gameBoard = document.getElementById('game-board');
    const currentPlayerDisplay = document.getElementById('current-player');
    const currentHex = document.querySelector('.current-hex .hexagon .main');

    // const rows = 8;
    // const cols = 10;
    const rows = 2;
    const cols = 3;
    let currentPlayer = 1; // Player 1 starts first
    let player1Score = 0;
    let player2Score = 0;
    let filledHexagon = 0;

    const player1ScoreDisplay = document.getElementById('player1-score');
    const player2ScoreDisplay = document.getElementById('player2-score');

    // Set nilai acak untuk current hexagon saat game dimulai
    setRandomValue(currentHex);
    setCurrentHexColor();
    player1ScoreDisplay.textContent = player1Score;
    player2ScoreDisplay.textContent = player2Score;
    
    console.log({ Turn: currentPlayer });

    // Inisialisasi papan permainan dengan hexagon
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

                // Ambil nilai acak dari current hexagon
                const randomValue = parseInt(currentHex.textContent);
                // Set nilai acak ke heksagon yang diklik
                setHexagonValue(hexagon, randomValue);

                // Set owner untuk heksagon yang diklik
                hexagon.dataset.owner = currentPlayer;

                // Ganti warna heksagon berdasarkan pemain saat ini
                const mainColor = currentPlayer === 1 ? 'red' : 'yellow';
                mainDiv.style.backgroundColor = mainColor;
                topDiv.style.borderBottomColor = mainColor;
                bottomDiv.style.borderTopColor = mainColor;

                // Periksa dan hitung skor jika heksagon bergabung dengan heksagon lainnya
                calculateScore(hexagon);
                checkAndCaptureNeighbours(hexagon);
                filledHexagon++;
                console.log({filledHexagon: filledHexagon});
                // Ganti giliran pemain
                currentPlayer = currentPlayer === 1 ? 2 : 1;

                // Set nilai acak baru untuk current hexagon
                setCurrentHexColor();
                setRandomValue(currentHex);
                
                if (filledHexagon === rows * cols) {
                    if (player1Score > player2Score) {
                        alert('Player 1 wins with the highest score!');
                    } else if (player1Score < player2Score) {
                        alert('Player 2 wins with the highest score!');
                    } else {
                        alert('GAME DRAW');
                    }
                } 
            });

            hexRow.appendChild(hexagon);
        }

        gameBoard.appendChild(hexRow);
    }

    // Fungsi untuk mengatur nilai acak pada hexagon
    function setHexagonValue(hexagon, value) {
        const mainDiv = hexagon.querySelector('.main');
        mainDiv.textContent = value;
    }

    // Fungsi untuk menghasilkan nilai acak dan mengatur pada current hexagon
    function setRandomValue(hexagon) {
        const randomValue = Math.floor(Math.random() * 20) + 1; // Generate random value (1-20)
        setHexagonValue(hexagon.parentElement, randomValue); // Set value to current hexagon
    }

    // Fungsi untuk mengatur warna pada current hexagon
    function setCurrentHexColor() {
        const mainColor = currentPlayer === 1 ? 'red' : 'yellow';
        const currentHexTop = document.querySelector('.current-hex .hexagon .top');
        const currentHexBottom = document.querySelector('.current-hex .hexagon .bottom');

        currentHex.style.backgroundColor = mainColor;
        currentHexTop.style.borderBottomColor = mainColor;
        currentHexBottom.style.borderTopColor = mainColor;
    }

    // Fungsi untuk memeriksa dan menghitung skor
    // Fungsi untuk memeriksa dan menghitung skor
    function calculateScore(hexagon) {
        const row = parseInt(hexagon.dataset.row);
        const col = parseInt(hexagon.dataset.col);
        const owner = currentPlayer;
        const mainValue = parseInt(hexagon.querySelector('.main').textContent);

        // Array yang berisi arah-arah tetangga (diagonal dan sejajar)
        const directions = [
            { row: -1, col: 0 }, // atas
            { row: 1, col: 0 },  // bawah
            { row: 0, col: -1 }, // kiri
            { row: 0, col: 1 },  // kanan
            { row: -1, col: 1 }, // diagonal atas-kanan
            { row: 1, col: -1 }, // diagonal bawah-kiri
        ];

        let scoreToAdd = mainValue; // Skor untuk heksagon saat ini
        let visitedHexagons = new Set(); // Set untuk melacak heksagon yang sudah dikunjungi

        // Cek setiap arah tetangga
        for (const dir of directions) {
            const neighborRow = row + dir.row;
            const neighborCol = col + dir.col;
            const neighborHexagon = document.querySelector(`[data-row="${neighborRow}"][data-col="${neighborCol}"]`);

            if (neighborHexagon && neighborHexagon.dataset.owner && parseInt(neighborHexagon.dataset.owner) === owner) {
                const neighborValue = parseInt(neighborHexagon.querySelector('.main').textContent);

                if (!visitedHexagons.has(`${neighborRow},${neighborCol}`)) {
                    // Heksagon tetangga dimiliki oleh pemain yang sama dan memiliki nilai yang sama
                    scoreToAdd += neighborValue;
                    visitedHexagons.add(`${neighborRow},${neighborCol}`);
                }
            }
        }

        // Update skor pemain jika ada skor tambahan
        if (scoreToAdd > mainValue) {
            if (currentPlayer === 1) {
                player1Score += scoreToAdd;
                player1ScoreDisplay.textContent = player1Score;
            } else {
                player2Score += scoreToAdd;
                player2ScoreDisplay.textContent = player2Score;
            }
        }
    }

    function checkAndCaptureNeighbours(hexagon) {
        const row = parseInt(hexagon.dataset.row);
        const col = parseInt(hexagon.dataset.col);
        const owner = currentPlayer;
        const mainValue = parseInt(hexagon.querySelector('.main').textContent);

        // Array yang berisi arah-arah tetangga (diagonal dan sejajar)
        const directions = [
            { row: -1, col: 0 }, // atas
            { row: 1, col: 0 },  // bawah
            { row: 0, col: -1 }, // kiri
            { row: 0, col: 1 },  // kanan
            { row: -1, col: 1 }, // diagonal atas-kanan
            { row: 1, col: -1 }, // diagonal bawah-kiri
        ];

        for (const dir of directions) {
            const neighborRow = row + dir.row;
            const neighborCol = col + dir.col;
            const neighborHexagon = document.querySelector(`[data-row="${neighborRow}"][data-col="${neighborCol}"]`);

            if (neighborHexagon && neighborHexagon.dataset.owner && parseInt(neighborHexagon.dataset.owner) !== currentPlayer) {
                const neighborMainValue = parseInt(neighborHexagon.querySelector('.main').textContent);

                if (neighborMainValue < mainValue) {
                    // Rebut heksagon tetangga
                    neighborHexagon.dataset.owner = currentPlayer;
                    calculateScore(hexagon)
                    const mainColor = currentPlayer === 1 ? 'red' : 'yellow';
                    neighborHexagon.querySelector('.main').style.backgroundColor = mainColor;
                    neighborHexagon.querySelector('.top').style.borderBottomColor = mainColor;
                    neighborHexagon.querySelector('.bottom').style.borderTopColor = mainColor;
                }
            }
        }
    }
});
