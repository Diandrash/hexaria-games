document.addEventListener('DOMContentLoaded', () => {
    // Take Value from URL
    const urlParams = new URLSearchParams(window.location.search)
    const player1 = urlParams.get('player1')
    const player2 = urlParams.get('player2')
    const mode = urlParams.get('mode')
    const difficulty = urlParams.get('difficulty')
    
    
    // Initialize Default Value on Board
    const mainAudio = document.getElementById('mainAudio')
    mainAudio.play()
    mainAudio.loop = true
    const gameBoard = document.getElementById('game-board');
    const currentHex = document.querySelector('.current-hex .hexagon .main');
    const rows = 8;
    const cols = 10;
    // const rows = 2;
    // const cols = 3;
    let currentPlayer = 1; // Player 1 starts first
    let player1Score = 0;
    let player2Score = 0;
    let filledHexagon = 0;

    // Disabled Hex Featured
    let disabledHexCount = 0
    let disabledHexPosition = []

    // Initialize display value
    const player1ScoreDisplay = document.getElementById('player1-score');
    const player2ScoreDisplay = document.getElementById('player2-score');
    const player1Name = document.getElementById('player1-name')
    const player2Name = document.getElementById('player2-name')

    // Set nilai acak untuk current hexagon saat game dimulai
    setRandomValue(currentHex);
    setCurrentHexColor();

    // Display Data on Screen
    player1ScoreDisplay.textContent = player1Score;
    player2ScoreDisplay.textContent = player2Score;
    player1Name.textContent = player1
    player2Name.textContent = player2

    console.log({TotalHexagon: rows * cols});

    // Difficulty Features
    if (difficulty === 'easy') {
        disabledHexCount = parseInt(rows * cols / 10)
    } else if (difficulty === 'medium') {
        disabledHexCount = parseInt(rows * cols / 6)
    } else if (difficulty === 'hard'){
        disabledHexCount = parseInt(rows * cols / 4);
    }
    // Generate posisi acak untuk heksagon yang terdisabled
    while (disabledHexPosition.length <= disabledHexCount) {
        const randomRow = Math.floor(Math.random() * rows)
        const randomCol = Math.floor(Math.random() * cols)
        const position = `${randomRow}, ${randomCol}`
        if (!disabledHexPosition.includes(position)) {
            disabledHexPosition.push(position);
        }
        // console.log({hexagonDisabled});
    }


    console.log({disabledHexPosition: disabledHexPosition.length});

    // Leaderboard Features
    const leaderboardArea = document.querySelector('.leaderboard-area');
    // Ambil data leaderboard dari localStorage
    const parsingData = JSON.parse(localStorage.getItem('leaderboard')) || [];
    const numEntries = 5;
    // Ambil lima entri terakhir (atau kurang jika tidak cukup)
    const startIndex = Math.max(parsingData.length - numEntries, 0);
    const leaderboardData = parsingData.slice(startIndex);
    // Loop data leaderboard untuk membuat elemen HTML
    leaderboardData.forEach(entry => {
        // Buat elemen untuk setiap entri leaderboard
        const leaderboardDetails = document.createElement('div');
        leaderboardDetails.classList.add('leaderboard-details');

        // Tambahkan informasi nama pemain dan skor
        const playerNameText = `${entry.player1.name} Vs ${entry.player2.name}`;
        const playerScoreText = `${entry.player1.score} - ${entry.player2.score}`;

        // Buat struktur elemen HTML untuk setiap entri leaderboard
        leaderboardDetails.innerHTML = `
            <h1 class="players-name">${playerNameText}</h1>
            <div class="score-details">
                <h1 class="score">${playerScoreText}</h1>
                <button class="btn-leaderboard">Show Details</button>
            </div>
        `;
        // Tambahkan elemen ke area leaderboard
        leaderboardArea.appendChild(leaderboardDetails);
    });



    console.log({ Turn: currentPlayer });


    // Looping Hexagon
    // Inisialisasi papan permainan dengan hexagon
    for (let row = 1; row <= rows; row++) {
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

             // Disable heksagon jika posisinya terdapat dalam daftar posisi yang terdisabled
            const position = `${row}, ${col}`
            if (disabledHexPosition.includes(position)) {
                hexagon.classList.add('disabled')
            }

            hexagon.addEventListener('click', () => {
                if (hexagon.dataset.owner || hexagon.classList.contains('disabled')) {
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
                console.log({filledHexagon});
                // Ganti giliran pemain
                currentPlayer = currentPlayer === 1 ? 2 : 1;

                // Set nilai acak baru untuk current hexagon
                setCurrentHexColor();
                setRandomValue(currentHex);
                
                if (mode === 'bot' && currentPlayer === 2) {
                    playerBotTurn()
                }

                console.log({filledHexagon});
                console.log({disabledHexCount});
                console.log({total: rows * cols});
                decideWinner()
            });

            hexRow.appendChild(hexagon);
        }

        gameBoard.appendChild(hexRow);
    }

    const hexagonDisabled = document.querySelectorAll('.disabled')
    const countHexagonDisabled = hexagonDisabled.length
    console.log({countHexagonDisabled});

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

    function playerBotTurn() {
        const emptyHexagon = Array.from(document.querySelectorAll('.game-board .hexagon:not([data-owner])'));
    
        // Filter hanya hexagon yang tidak terdisabled
        const validEmptyHexagon = emptyHexagon.filter(hexagon => !hexagon.classList.contains('disabled'));
        console.log({validEmptyHexagon});
        if (validEmptyHexagon.length > 0) {
            const randomIndex = Math.floor(Math.random() * validEmptyHexagon.length);
            const botHexagon = validEmptyHexagon[randomIndex];
    
            const randomValue = Math.floor(Math.random() * 20) + 1;
            setHexagonValue(botHexagon, randomValue);
            botHexagon.dataset.owner = 2;
    
            const mainColor = 'yellow';
            botHexagon.querySelector('.main').style.backgroundColor = mainColor;
            botHexagon.querySelector('.top').style.borderBottomColor = mainColor;
            botHexagon.querySelector('.bottom').style.borderTopColor = mainColor;
    
            calculateScore(botHexagon);
            checkAndCaptureNeighbours(botHexagon);
            filledHexagon++;
    
            currentPlayer = 1;
            setCurrentHexColor();
        }
    }
    

    function saveScoreToLocalStorage(player1Name, player1Score, player2Name, player2Score) {
        const leaderboardEntry = {
            player1: {
                name: player1Name,
                score: player1Score
            },
            player2: {
                name: player2Name,
                score: player2Score
            }
        };
    
        // Menyimpan data leaderboard ke localStorage
        const leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
        leaderboard.push(leaderboardEntry);
        localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
    }
    
    function decideWinner() {
        if (filledHexagon + countHexagonDisabled === rows * cols) {
            let winner = '';
            if (player1Score > player2Score) {
                winner = player1;
                alert(`${player1} wins with the highest score!`);
            } else if (player1Score < player2Score) {
                winner = player2;
                alert(`${player2} wins with the highest score!`);
            } else {
                alert('GAME DRAW');
                return; // Jika draw, tidak perlu menyimpan ke leaderboard
            }
    
            // Simpan skor ke Local Storage
            saveScoreToLocalStorage(player1, player1Score, player2, player2Score);
        }
    }
    
    function saveScoreToLocalStorage(player1Name, player1Score, player2Name, player2Score) {
        const gameResult = {
            player1: { name: player1Name, score: player1Score },
            player2: { name: player2Name, score: player2Score }
        };
    
        let leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
        leaderboard.push(gameResult);
        localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
    }
    
});
