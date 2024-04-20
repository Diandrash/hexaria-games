const urlParams = new URLSearchParams(window.location.search)
const gameMode = urlParams.get('mode');
const playerOneName = urlParams.get('player1');
const playerTwoName = urlParams.get('player2');

function selectComputerMode() {
    window.location.href = '/solo.html?mode=bot'
}
function selectMultiplayerMode() {
    window.location.href = '/multiplayer.html?mode=player'
}

function soloNameInput() {
    const playerOneInput = document.getElementById('playerOneInput').value
    window.location.href = `/difficulty.html?mode=${gameMode}&player1=${playerOneInput}&player2=Computer`
}
function multiNameInput() {
    const playerOneInput = document.getElementById('playerOneInput').value
    const playerTwoInput = document.getElementById('playerTwoInput').value
    window.location.href = `/difficulty.html?mode=${gameMode}&player1=${playerOneInput}&player2=${playerTwoInput}`
}

function easyMode() {
    console.log('Hai');
    window.location.href = `/game.html?mode=${gameMode}&player1=${playerOneName}&player2=${playerTwoName}&difficulty=easy`
}
function mediumMode() {
    window.location.href = `/game.html?mode=${gameMode}&player1=${playerOneName}&player2=${playerTwoName}&difficulty=medium`
}
function hardMode() {
    window.location.href = `/game.html?mode=${gameMode}&player1=${playerOneName}&player2=${playerTwoName}&difficulty=hard`
}