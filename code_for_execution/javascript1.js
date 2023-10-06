// Dimensions of board
SIZE = 0; // Size of the board
PLAYERS = 11;

// Add score of the player
SCORE1 = 0;
SCORE2 = 0;

// Adding variables for protection from fielders
PROTECT1 = 0;
PROTECT2 = 0;
PROTECT = 0;

// Attributes added
multiplier = false;
protection = false;

// An additional boolean for multiplayer games
multi = false;
wasMulti = false;
player = 1;

// Game state
let board = [];
let revealedCount = 0;

// Create the board
function createBoard() {
    // Initialize the board
    board = [];
    for (let i = 0; i < SIZE; i++) {
        board[i] = [];
        for (let j = 0; j < SIZE; j++) {
            board[i][j] = {
                value: 0,
                revealed: false,
                hasPlayer: false,
                special: "",
            };
        }
    }

    // Place players randomly
    let PlayersPlaced = 0;
    while (PlayersPlaced < 11) {
        const row = Math.floor(Math.random() * SIZE);
        const col = Math.floor(Math.random() * SIZE);
        if (!board[row][col].hasPlayer) {
            board[row][col].hasPlayer = true;
            PlayersPlaced++;
        }
    }

    // Add special attributes of X2
    let specials = 0
    if (multiplier) {
        while (specials < SIZE) {
            const row = Math.floor(Math.random() * SIZE);
            const col = Math.floor(Math.random() * SIZE);
            if (!board[row][col].hasPlayer && (board[row][col].special === "")) {
                board[row][col].special = "X2";
                specials++;
            }
        }
    }

    // Add special attributes of protecting from fielders
    specials = 0
    if (protection) {
        while (specials < SIZE) {
            const row = Math.floor(Math.random() * SIZE);
            const col = Math.floor(Math.random() * SIZE);
            if (!board[row][col].hasPlayer && (board[row][col].special === "")) {
                board[row][col].special = "protect";
                specials++;
            }
        }
    }

    // Calculate the value at each cell
    for (let i = 0; i < SIZE; i++) {
        for (let j = 0; j < SIZE; j++) {
            if (!board[i][j].hasPlayer && (board[i][j].special === "")) {
                board[i][j].value = Math.ceil(Math.random() * 6);
            }
        }
    }
}

// Reveal a cell
function revealCell(row, col) {
    const cell = board[row][col];
    if (!cell.revealed) {
        cell.revealed = true;
        revealedCount++;

        const td = document.getElementById(`cell-${row}-${col}`);
        td.classList.add('revealed');

        // Different operations need to be performed if the cell has special attributes
        if (cell.special === "") {
            td.textContent = cell.value || '';

            // increasing the score for multiplayer
            if (multi) {
                if (player === 1) {
                    SCORE1 = SCORE1 + cell.value;
                    player = 2;
                }
                else {
                    player = 1;
                    SCORE2 = SCORE2 + cell.value;
                }
                const score1 = document.getElementById('multiplayer1');
                score1.innerHTML = "Player1: " + SCORE1.toString();
                const score2 = document.getElementById('multiplayer2');
                score2.innerHTML = "Player2: " + SCORE2.toString();
            }

            // increasing the score for single player or if one of the players in players is out
            else {
                // one of the players in multiplayer is out
                if (wasMulti) {
                    if (player === 1) {
                        SCORE1 = SCORE1 + cell.value;
                        const score1 = document.getElementById('multiplayer1');
                        score1.innerHTML = "Player1: " + SCORE1.toString();
                        const score2 = document.getElementById('multiplayer2');
                        score2.innerHTML = "Player2: " + SCORE2.toString();
                    }
                    else {
                        SCORE2 = SCORE2 + cell.value;
                        const score1 = document.getElementById('multiplayer1');
                        score1.innerHTML = "Player1: " + SCORE1.toString();
                        const score2 = document.getElementById('multiplayer2');
                        score2.innerHTML = "Player2: " + SCORE2.toString();
                    }
                }
                // game is single player
                else {
                    SCORE1 = SCORE1 + cell.value;
                    const score = document.getElementById('score');
                    score.innerHTML = "Score: " + SCORE1.toString();
                }
            }

            // if the chosen cell has a player in it then the operations are to be performed based on special attributes the players have collected
            if (cell.hasPlayer) {
                // if the game is multiplayer and both the players are playing
                if (multi) {
                    // if the player playing is not having a protection then that player is out
                    if ((player === 1 && PROTECT2 === 0) || (player === 2 && PROTECT1 === 0)) {
                        td.classList.add('Player');
                        PLAYERS--;
                        multi = false;
                        wasMulti = true;
                        if (player === 1)
                        {
                            window.alert("Player 2's turn is over");
                        }
                        if (player === 2)
                        {
                            window.alert("Player 1's turn is over");
                        }
                    }
                    // if the player is having a protection, then the player loses one point on the protection
                    else if (player === 1) {
                        PROTECT2 -= 1;
                        PLAYERS--;
                        td.classList.add('Player');
                    }
                    else if (player === 2) {
                        PLAYERS--;
                        td.classList.add('Player');
                        PROTECT1 -= 1;
                    }
                }
                // if the game is single player or one of the players is out in multiplayer
                else {
                    // one of the players is out in multiplayer
                    if (wasMulti) {
                        // if the player does not have any protection, then that player is out and if he has, he loses one point on protection
                        if (player === 1) {
                            if (PROTECT1 === 0) {
                                for (let i = 0; i < SIZE; i++) {
                                    for (let j = 0; j < SIZE; j++) {
                                        if (board[i][j].hasPlayer) {
                                            const c = document.getElementById(`cell-${i}-${j}`)
                                            c.classList.add('Player');
                                        }
                                        if (board[i][j].special === "protect") {
                                            const c = document.getElementById(`cell-${i}-${j}`)
                                            c.textContent = "Pr";
                                        }
                                    }
                                }
                                setTimeout(gameOver, 30);
                            }
                            else {
                                PROTECT1--;
                                PLAYERS--;
                                td.classList.add('Player');
                            }
                        }
                        else {
                            if (PROTECT2 === 0) {
                                for (let i = 0; i < SIZE; i++) {
                                    for (let j = 0; j < SIZE; j++) {
                                        if (board[i][j].hasPlayer) {
                                            const c = document.getElementById(`cell-${i}-${j}`)
                                            c.classList.add('Player');
                                        }
                                        if (board[i][j].special === "protect") {
                                            const c = document.getElementById(`cell-${i}-${j}`)
                                            c.textContent = "Pr";
                                        }
                                    }
                                }
                                setTimeout(gameOver, 30);
                            }
                            else {
                                PROTECT2--;
                                PLAYERS--;
                                td.classList.add('Player');
                            }
                        }
                    }
                    // game is single player
                    else {
                        if (PROTECT === 0) {
                            for (let i = 0; i < SIZE; i++) {
                                for (let j = 0; j < SIZE; j++) {
                                    if (board[i][j].hasPlayer) {
                                        const c = document.getElementById(`cell-${i}-${j}`)
                                        c.classList.add('Player');
                                    }
                                    if (board[i][j].special === "protect") {
                                        const c = document.getElementById(`cell-${i}-${j}`)
                                        c.textContent = "Pr";
                                    }
                                }
                            }
                            setTimeout(gameOver, 30);
                        }
                        else {
                            PROTECT--;
                            PLAYERS--;
                            td.classList.add('Player');
                        }
                    }
                }
            }
            // if all the cells that do not have players are revealed, then the game is over
            if (revealedCount === SIZE * SIZE - PLAYERS) {
                setTimeout(gameOver, 30);
            }
        }
        // if the cell has some special attribute, then some special functions are to be performed
        else {
            // special attribute is multiplier
            if (cell.special === "X2") {
                // the score of the player multiplies by 2
                if (!multi) {
                    if (wasMulti) {
                        if (player === 1) {
                            SCORE1 = SCORE1 * 2;
                            td.textContent = "X2";
                            const score1 = document.getElementById('multiplayer1');
                            score1.innerHTML = "Player1: " + SCORE1.toString();
                            const score2 = document.getElementById('multiplayer2');
                            score2.innerHTML = "Player2: " + SCORE2.toString();
                        }
                        else {
                            SCORE2 = SCORE2 * 2;
                            td.textContent = "X2";
                            const score1 = document.getElementById('multiplayer1');
                            score1.innerHTML = "Player1: " + SCORE1.toString();
                            const score2 = document.getElementById('multiplayer2');
                            score2.innerHTML = "Player2: " + SCORE2.toString();
                        }
                    }
                    else {
                        SCORE1 = SCORE1 * 2;
                        td.textContent = "X2";
                        const score = document.getElementById('score');
                        score.innerHTML = "Score: " + SCORE1.toString();
                    }
                }
                else {
                    if (player === 1) {
                        SCORE1 = SCORE1 * 2;
                        td.textContent = "X2";
                        player = 2;
                    }
                    else {
                        SCORE2 = SCORE2 * 2;
                        td.textContent = "X2";
                        player = 1;
                    }
                    const score1 = document.getElementById('multiplayer1');
                    score1.innerHTML = "Player1: " + SCORE1.toString();
                    const score2 = document.getElementById('multiplayer2');
                    score2.innerHTML = "Player2: " + SCORE2.toString();
                }
            }
            // the attribute is protection
            else {
                // the player attains a protection
                if (multi) {
                    if (player === 1) {
                        PROTECT1++;
                        player = 2;
                        td.textContent = "Pr1";
                    }
                    else {
                        PROTECT2++;
                        player = 1;
                        td.textContent = "Pr2";
                    }
                }
                else {
                    if (wasMulti) {
                        if (player === 1) {
                            PROTECT1++;
                            td.textContent = "Pr1";
                        }
                        else {
                            PROTECT2++;
                            td.textContent = "Pr2";
                        }
                    }
                    else {
                        PROTECT++;
                        td.textContent = "Pr";
                    }
                }
            }
        }
    }
}

// Game over
function gameOver() {
    // for mulitplyer, a message is popped that the game is over and who won the game
    if (wasMulti || multi) {
        if (SCORE1 > SCORE2) {
            alert('Game over! Player 1 won!! ');
        }
        else if (SCORE1 < SCORE2) {
            alert('Game over! Player 2 won!! ');
        }
        else {
            alert('Game over! Game tied!! ');
        }
        multi = true;
        wasMulti = false;
    }
    // for single player, a message is popped that the game is over and how many points were scored by the player
    else {
        alert('Game over! You scored ' + SCORE1.toString() + ' points');
    }
    playAgain();
}



// Show the Submit button on accepting the policy
function click_checkbox() {
    element = document.getElementById("acceptance_policy");
    if (element.checked) {
        el = document.getElementById("submit");
        el.disabled = false;
    }
    else {
        el = document.getElementById("submit");
        el.disabled = true;
    }
}

// Remove the welcome page
function submitMessage() {
    // setting the background
    document.body.style.backgroundColor = "grey";


    // Checking for the preferences of the player
    const s = document.getElementById("size");
    if (s.value === "6") {
        SIZE = 6;
    }
    else if (s.value === "7") {
        SIZE = 7;
    }
    else if (s.value === "9") {
        SIZE = 9;
    }
    else if (s.value === "11") {
        SIZE = 11;
    }

    multiplayer = document.getElementById('players')
    if (multiplayer.value === "Multiplayer") {
        multi = true
    }
    if (multi) {
        const score1 = document.getElementById('multiplayer1');
        score1.innerHTML = "Player1: " + SCORE1.toString();
        const score2 = document.getElementById('multiplayer2');
        score2.innerHTML = "Player2: " + SCORE2.toString();
    }
    else {
        const score = document.getElementById('score');
        score.innerHTML = "Score: " + SCORE1.toString();
    }
    
    const attr = document.getElementById("attribute")
    if (attr.value === "Protection") {
        protection = true;
    }
    else if (attr.value === "X2") {
        multiplier = true;
    }
    else if (attr.value === "both") {
        protection = true;
        multiplier = true;
    }

    // removing the content of the startup page before the gameplay
    document.getElementById("startpage").remove();

    // setting up the table on the screen
    const table = document.getElementById('board' + s.value);
    createBoard();
    
    for (let i = 0; i < SIZE; i++) {
        const tr = document.createElement('tr');
        for (let j = 0; j < SIZE; j++) {
            const td = document.createElement('td');
            td.id = `cell-${i}-${j}`;
            td.addEventListener('click', () => revealCell(i, j));
            tr.appendChild(td);
        }
        table.appendChild(tr);
    }
    
    const newgame = document.getElementById('newgame');
    newgame.hidden = false;
    const newgame1 = document.getElementById('newgame1');
    newgame1.hidden = false;
}

function playAgain() {
    // setting all the values to the default numbers
    player = 1;
    SCORE1 = 0;
    SCORE2 = 0;
    PROTECT = 0;
    PROTECT1 = 0;
    PROTECT2 = 0;

    // removing the current table
    const table = document.getElementById('board' + SIZE.toString());
    table.remove();

    // setting up the score boards
    if (multi) {
        const score1 = document.getElementById('multiplayer1');
        score1.innerHTML = "Player1: " + SCORE1.toString();
        const score2 = document.getElementById('multiplayer2');
        score2.innerHTML = "Player2: " + SCORE2.toString();
    }
    else {
        const score = document.getElementById('score');
        score.innerHTML = "Score: " + SCORE1.toString();
    }
    
    // creating a new table
    const table1 = document.createElement("table");
    table1.id = 'board' + SIZE.toString();
    table1.className = 'board' + SIZE.toString();
    document.body.insertBefore(table1, document.getElementById("multiplayer1"));
    createBoard();
    
    for (let i = 0; i < SIZE; i++) {
        const tr = document.createElement('tr');
        for (let j = 0; j < SIZE; j++) {
            const td = document.createElement('td');
            td.id = `cell-${i}-${j}`;
            td.addEventListener('click', () => revealCell(i, j));
            tr.appendChild(td);
        }
        table1.appendChild(tr);
    }
}