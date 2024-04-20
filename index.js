// script.js

const homeAudio = document.getElementById('homeAudio')
homeAudio.play()
homeAudio.loop = true

function togglePlayerNameInputs() {
    const gameModeRadios = document.getElementsByName('game-mode');
    const playerTwoInput = document.querySelector('.playerTwoInput');

    // Loop through game mode radios to find the selected mode
    for (const radio of gameModeRadios) {
        if (radio.checked) {
            // Show player name inputs if "Player vs Player" mode is selected
            if (radio.value === 'player') {
                playerTwoInput.style.display = 'block';
            } else {
                // Hide player name inputs for other modes (e.g., "Play Against Bot")
                playerTwoInput.style.display = 'none';
            }
            break;
        }
    }
}

function startGame() {
    const selectedMode = document.querySelector('input[name="game-mode"]:checked').value;
    const selectedDifficulty = document.querySelector('input[name="difficulty"]:checked').value;
    let player1Name = '';
    let player2Name = '';

    // Get player names if "Player vs Player" mode is selected
    if (selectedMode === 'player') {
        player1Name = document.getElementById('player1-name').value.trim();
        player2Name = document.getElementById('player2-name').value.trim();

        // Check if both player names are provided
        if (player1Name === '' || player2Name === '') {
            alert('Please enter names for both players.');
            return;
        }

        window.location.href = `game.html?mode=player&difficulty=${selectedDifficulty}&player1=${player1Name}&player2=${player2Name}`;
    } else if (selectedMode === 'bot') {
        player1Name = document.getElementById('player1-name').value.trim();
        window.location.href = `game.html?mode=bot&difficulty=${selectedDifficulty}&player1=${player1Name}&player2=Computer`;
    }

    w
}
