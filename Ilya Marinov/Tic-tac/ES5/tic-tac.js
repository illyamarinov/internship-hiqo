var TicTac = (function() {

  /*
   * game symbols
   * empty cells symbol
   * flag 'emptyChange' = false
   * when user overwrite's default empty symbol
   */
  var gameField = [];
  var playerList = {};
  var gamePlayersOrder = [];
  var turnCounter = 0;
  var currentPlayerTurn = null;
  var emptySymbol = '';
  var emptyChange = true;
  var newGame = true;

  // flag 'tie' returns true when is tie
  var tie = true;
  var winner = null;

  // field length default is 3
  var defaultFieldSize = 3;
  var fieldSize = 0;

  // erros list
  var TICTAC_ERRORS = {
    ERROR_INIT: 'Error. Init is not complete.',
    ERROR_SIZE: 'Error. Incorrect field size. Check your input.',
    ERROR_SIZE_MIN: 'Error. Incorrect field size. Minimum size is 3.',
    ERROR_PLAYERS_MIN: 'Error. Minimum number of players is 2.',
    ERROR_SYMBOLS: 'Error. Game symbols must be unique.',
    ERROR_INVALID: 'Error. Field is not valid. Check your input.'
  }

  var menuWrap = '.game-menu-field';
  var wrapId = 'TicTacGame';
  var wrapClass = 'field-wrap';
  var cellClass = 'field-cell';
  var cellClassActive = 'field-cell-activated';
  var cellClassLastRow = 'field-cell-last-row';
  var cellClassLastColumn = 'field-cell-last-column';
  var dataCoordX = 'data-coord-x';
  var dataCoordY = 'data-coord-y';

  var TICTAC_STATUS = {
    STATUS_INIT_COMPLETE: 'Init complete. Generating field for new game.',
    STATUS_INIT_CURRENT_PLAYER: 'Init complete. Game continues, turn player ',
    STATUS_TIE: 'Tie. Nobody is win.',
    STATUS_WINNER_ROW: 'Winner on the row: ',
    STATUS_WINNER_DIAGONAL_L: 'Winner on the left diagonal: ',
    STATUS_WINNER_DIAGONAL_R: 'Winner on the right diagonal: ',
    STATUS_WINNER_COLUMN: 'Winner on the column: '
  }

  /**
   * @function init
   * @description init game field for tic-tac-toe
   * @param {array} players
   * @param {array|number} config
   * @returns {string}
   */
  var init = function(players, config) {
    playersInit(players);

    if (config !== undefined) {
      if (typeof config === 'object' && Array.isArray(config)) {
        return fieldInit(config);
      } else if (typeof config === 'number') {
        if (config < defaultFieldSize) {
          return TICTAC_ERRORS.ERROR_SIZE;
        }
        fieldSize = config;
        fieldCreate();
        checkCurrentPlayerTurn();
        renderField();
        return TICTAC_STATUS.STATUS_INIT_COMPLETE + ' Turn player ' + currentPlayerTurn;
      } else {
        return TICTAC_ERRORS.ERROR_INIT;
      }
    }
  }

  /**
   * @function isValid
   * @description checks for valid of game field. return true or false
   * @param {array} players - players list
   * @param {array} field - field config
   * @returns {boolean}
   */
  var isValid = function(players, field) {
    var max = 0;
    var min = Infinity;
    playersInit(players);

    /*
     * 1) counting game symbols in field if one of these more by 1 than others => return false
     * 2) if field have its own empty symbol replace default for users symbol, after flag false
     */
    for (var i = 0; i < fieldSize; i++) {
      for (var j = 0; j < fieldSize; j++) {
        if (players.includes(field[i][j])) {
          playerList[field[i][j]] += 1;
        } else if (field[i][j] === emptySymbol) {
          emptyChange = false;
        } else {
          if (!emptyChange) {
            return false;
          }
          emptySymbol = field[i][j];
          emptyChange = false;
        }
      }
    }
    checkCurrentPlayerTurn();
    for (var key in playerList) {
      if (playerList[key] > max) {
        max = playerList[key];
      }
      if (playerList[key] < min) {
        min = playerList[key];
      }
    }

    if (max - min <= 1) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * @function isEmptyRemain
   * @description checks for remaining empty cells. return true or false
   * @returns {boolean}
   */
  var isEmptyRemain = function(field) {
    for (var i = 0; i < fieldSize; i++) {
      for (var j = 0; j < fieldSize; j++) {
        if (field[i][j] === emptySymbol) {
          return true;
        }
      }
    }
    return false;
  }

  /**
   * @function renderField
   * @description renders game field and add listener for user clicks
   */
  var renderField = function() {
    var cellsAmount = Math.pow(fieldSize, 2);
    var fieldWrap = document.createElement('div');
    var menuWrapper = document.querySelector(menuWrap);
    var buttonBack = document.createElement('button');
    var gameStatus = document.createElement('h1');
    gameStatus.className = 'game-status';
    buttonBack.className = 'button-back';
    buttonBack.innerHTML = 'Back to menu';
    fieldWrap.id = wrapId;
    fieldWrap.className = wrapClass;
    fieldWrap.style.width = 103 * fieldSize + 'px';
    fieldWrap.style.height = 103 * fieldSize + 'px';
    menuWrapper.appendChild(fieldWrap);
    menuWrapper.appendChild(buttonBack);
    fieldWrap.addEventListener('click', cellHandler);

    for (var i = 0; i < fieldSize; i++) {
      for (var j = 0; j < fieldSize; j++) {
        var fieldCell = document.createElement('div');
        fieldCell.className = cellClass;
        fieldCell.setAttribute(dataCoordX, i);
        fieldCell.setAttribute(dataCoordY, j);
        if (i === fieldSize - 1) {
          fieldCell.className = fieldCell.className + ' ' + cellClassLastRow;
        }
        if (j === fieldSize - 1) {
          fieldCell.className = fieldCell.className + ' ' + cellClassLastColumn;
        }
        if (!newGame) {
          if (gameField[i][j] !== emptySymbol) {
            fieldCell.classList.add(cellClassActive);
          }
          fieldCell.innerHTML = gameField[i][j];
        }
        fieldWrap.appendChild(fieldCell);
      }
    }
  }

  /**
   * @function cellHandler
   * @description event handler click
   * @param {object} event
   */
  var cellHandler = function(e) {
    var x = +e.target.dataset.coordX;
    var y = +e.target.dataset.coordY;
    var gameStatus = document.querySelector('.game-status');

    if (e.target.className.indexOf(cellClass) !== -1) {
      var checkMove = moveTo(x, y);

      if (checkMove) {
        e.target.innerHTML = currentPlayerTurn;

        if (e.target.innerHTML === 'x'){
          e.target.classList.add('field-cell-x');
          e.target.style.color = '#545454';
        }
        if (e.target.innerHTML === 'o'){
          e.target.classList.add('field-cell-o');
          e.target.style.color = '#f2ebd3';
        }
        e.target.classList.add(cellClassActive);
        currentPlayerTurn = gamePlayersOrder[turnCounter].player;
        gameStatus.innerHTML = `Turn player '${currentPlayerTurn}'`;
      }

      var winnerResult = checkWinner(gameField);
      if (winnerResult) {
        gameStatus.innerHTML = winner;
        var fieldWrap = document.getElementById(wrapId);
        fieldWrap.removeEventListener('click', cellHandler);
      }

      var emptyResult = isEmptyRemain(gameField);
      if (!emptyResult) {
        var fieldWrap = document.getElementById(wrapId);
        fieldWrap.removeEventListener('click', cellHandler);
        if (tie) {
          gameStatus.innerHTML = 'Tie. Nobody is win.';
          return TICTAC_STATUS.STATUS_TIE;
        }
      }
    }
  }

  /**
   * @function moveTo
   * @description checks if user may to move to clicked cell
   * @param {number} coordX
   * @param {number} coordY
   * @returns {boolean}
   */
  var moveTo = function(x, y) {
    if (gameField[x][y] === emptySymbol) {
      gameField[x][y] = currentPlayerTurn;
      turnCounter++;
      if (turnCounter > gamePlayersOrder.length - 1) {
        turnCounter = 0;
      }
      return true;
    }
    return false;
  }

  /**
   * @function checkRow
   * @returns {string}
   */
  var checkRow = function(field) {
    for (var i = 0; i < fieldSize; i++) {
      var comparableRow = field[i][0];
      for (var j = 0; j < fieldSize; j++) {
        if (comparableRow === emptySymbol || comparableRow !== field[i][j + 1]) {
          break;
        } else if (j + 2 === fieldSize) {
          tie = false;
          return TICTAC_STATUS.STATUS_WINNER_ROW + field[i][j] + ' – ' + (i + 1) + '.';
        }
      }
    }
    return '';
  }

  /**
   * @function checkColumn
   * @returns {string}
   */
  var checkColumn = function(field) {
    for (var i = 0; i < fieldSize; i++) {
      var comparableColumn = field[0][i];
      for (var j = 0; j < fieldSize; j++) {
        if (comparableColumn === emptySymbol || comparableColumn !== field[j + 1][i]) {
          break;
        } else if (j + 2 === fieldSize) {
          tie = false;
          return TICTAC_STATUS.STATUS_WINNER_COLUMN + field[j][i] + ' – ' + (i + 1) + '.';
        }
      }
    }
    return '';
  }


  /**
   * @function checkDiogonals
   * @returns {string}
   */
  var checkDiogonals = function(field) {
    // left
    var comparableLeftDiagonal = field[0][0];
    for (var i = 0; i < fieldSize; i++) {
      if (comparableLeftDiagonal === emptySymbol || comparableLeftDiagonal !== field[i+1][i+1]) {
        break;
      } else if (i + 2 === fieldSize) {
        tie = false;
        return TICTAC_STATUS.STATUS_WINNER_DIAGONAL_L + field[i][i] + '.';
      }
    }

    var j = fieldSize;

    // right
    var comparableRightDiagonal = field[0][j - 1];
    for (var i = 0; i < fieldSize; i++) {
      if (comparableRightDiagonal === emptySymbol || comparableRightDiagonal !== field[i + 1][j - 2]) {
        break;
      } else if (i + 2 === fieldSize) {
        tie = false;
        return TICTAC_STATUS.STATUS_WINNER_DIAGONAL_R + field[i][j-1] + '.';
      } else {
        j--;
      }
    }
    return '';
  }

  /**
   * @function playersInit
   * @description init input data of game players
   * @param {array} array - array of players
   * @returns {boolean}
   */
  var playersInit = function(array) {

    if (array.length < 2) {
      return TICTAC_ERRORS.ERROR_PLAYERS_MIN;
    }

    for (var i = 0; i < array.length; i++) {
      for (var j = i + 1; j < array.length; j++) {
        if (array[i] === array[j] || array[i] === emptySymbol) {
          return TICTAC_ERRORS.ERROR_SYMBOLS;
        }
      }
    }

    array.forEach(function(i) {
      playerList[i] = 0;
    });
  }

  /**
   * @function fieldCreate
   * @description creating field for new game
   */
  var fieldCreate = function() {
    gameField.length = 0;
    for (var i = 0; i < fieldSize; i++) {
      gameField.push([]);
      for (var j = 0; j < fieldSize; j++) {
        gameField[i].push('');
      }
    }
  }

  /**
   * @function fieldInit
   * @description init users field
   * @param {array} field
   * @returns {string}
   */
  var fieldInit = function(field) {

    // checking for field size config
    if (field.length < defaultFieldSize) {
      return TICTAC_ERRORS.ERROR_SIZE_MIN;
    }

    fieldSize = field.length;

    // checking for square form of game field
    for (var i = 0; i < fieldSize; i++) {
      if (fieldSize !== field[i].length) {
        return TICTAC_ERRORS.ERROR_SIZE;
      }
    }

    // checking config for valid input
    var validResult = isValid(input.players, field);
    if (validResult) {
      newGame = false;
      gameField = field;

      // if valid, check winners
      var winnerResult = checkWinner(gameField);

      // if has no winner, check for available moves by existing empty cells
      if (!winnerResult) {

        // if empty true, then calculate who must to do the next move
        var emptyResult = isEmptyRemain(gameField);
        if (emptyResult) {
          checkCurrentPlayerTurn();
          renderField();
          return TICTAC_STATUS.STATUS_INIT_CURRENT_PLAYER + currentPlayerTurn;
        } else {
          // if field has no empty cells and no winner, then return tie
          renderField();
          return TICTAC_STATUS.STATUS_TIE;
        }
      } else {
        renderField();
        return winner.trim();
      }
    } else {
      return TICTAC_ERRORS.ERROR_INVALID;
    }
  }

  /**
   * @function checkWinner
   * @param {array} gameField
   * @returns {boolean}
   */
  var checkWinner = function(gameField) {

    // if valid, check winners
    winner = (checkRow(gameField) + '\n' + checkColumn(gameField) + '\n' + checkDiogonals(gameField)).trim();

    return !tie;
  }

  /**
   * @function checkCurrentPlayerTurn
   */
  var checkCurrentPlayerTurn = function() {
    var tempArr = [];
    for (var key in playerList) {
      if (playerList.hasOwnProperty(key)) {
        tempArr.push({
          player: key,
          count: playerList[key]
        });
      }
    }
    tempArr.sort(function(a, b) {
      return a.count - b.count;
    });
    gamePlayersOrder = tempArr;
    currentPlayerTurn = gamePlayersOrder[turnCounter].player;
  }

  var renderPlayer = function() {
    var playerCount = document.getElementsByClassName('player-panel-info');
    var counter = playerCount.length + 1;
    var playerPanel = document.querySelector('.player-panel');
    var playerForm = document.createElement('div');
    playerForm.className = 'player-panel-info';
    var playerDelete = document.createElement('span');
    playerDelete.innerHTML = 'x';
    playerDelete.className = 'player-panel-info-delete';
    playerDelete.addEventListener('click', removePlayer);
    var playerLabel = document.createElement('label');
    playerLabel.setAttribute('for', 'player-panel-info-name' + counter);
    playerLabel.innerHTML = 'Player ' + counter;
    var playerInput = document.createElement('input');
    playerInput.id = 'player-panel-info-name' + counter;
    playerInput.setAttribute('type', 'text');
    playerInput.setAttribute('name', 'player-name');
    playerInput.setAttribute('maxlength', '8');
    playerInput.setAttribute('autocomplete', 'name');
    var symbolLabel = document.createElement('label');
    symbolLabel.setAttribute('for', 'player-panel-info-symbol' + counter);
    symbolLabel.innerHTML = 'Symbol';
    var symbolInput = document.createElement('input');
    symbolInput.id = 'player-panel-info-symbol' + counter;
    symbolInput.setAttribute('type', 'text');
    symbolInput.setAttribute('maxlength', '1');
    symbolInput.setAttribute('name', 'player-symbol');
    playerForm.appendChild(playerDelete);    playerForm.appendChild(playerLabel);
    playerForm.appendChild(playerInput);
    playerForm.appendChild(symbolLabel);
    playerForm.appendChild(symbolInput);
    playerPanel.appendChild(playerForm);
    if (counter === 4) {
      var addPlayerButton = document.querySelector('.player-panel-add');
      addPlayerButton.style.visibility = 'hidden';
    }
  }

  var removePlayer = function() {
    var playerList = document.getElementsByClassName('player-panel-info');
    var playerParent = document.querySelector('.player-panel');
    playerList[playerList.length - 1].remove();
    var addPlayerButton = document.querySelector('.player-panel-add');
    addPlayerButton.style.visibility = 'visible';
  }

  var startGame = function() {
    var addPlayerButton = document.querySelector('.player-panel-add');
    addPlayerButton.addEventListener('click', renderPlayer);
    var gameForm = document.forms['tic-tac'];
    var startButton = gameForm['start-game'];
    startButton.addEventListener('click', startHandler);
  }

  var startHandler = function() {
    var gameForm = document.forms['tic-tac'];
    var sizeInput = +gameForm['field-size'].value;
    var playerName;
    var symbolsListInputs = gameForm['player-symbol'];
    var playersList = [];

    for (var i = 0; i < symbolsListInputs.length; i++) {
      playersList.push(symbolsListInputs[i].value);
    }

    if (playersInit(playersList) === TICTAC_ERRORS.ERROR_SYMBOLS) {
      for (var i = 0; i < symbolsListInputs.length; i++) {
        symbolsListInputs[i].style.borderBottom = '2px solid red';
      }
      return;
    }

    if (sizeInput <= 7 && sizeInput >= 3) {
      var gameMenu = document.querySelector('.game-menu');
      gameMenu.style.transform = 'translateY(-52%)';
      var gameStatus = document.createElement('h1');
      gameStatus.className = 'game-status';
      var menuWrapper = document.querySelector(menuWrap);
      menuWrapper.appendChild(gameStatus);
      for (var i = 0; i < symbolsListInputs.length; i++) {
        symbolsListInputs[i].style.borderBottom = '1px solid black';
      }
      var initRes = init(playersList, sizeInput);
    }
    gameStatus.innerHTML = initRes;
    var backButton = document.querySelector('.button-back');
    backButton.addEventListener('click', backHandler);
  }

  var backHandler = function() {
    var gameMenu = document.querySelector('.game-menu');
    var backButton = document.querySelector('.button-back');
    var gameStatus = document.querySelector('.game-status');
    gameMenu.style.transform = 'translateY(0)';
    var fieldWrap = document.getElementById(wrapId);
    fieldWrap.remove();
    gameField.length = 0;
    playerList = {};
    gamePlayersOrder.length = 0;
    newGame = true;
    fieldSize = 0;
    turnCounter = 0;
    currentPlayerTurn = null;
    tie = true;
    winner = null;
    backButton.remove();
    gameStatus.remove();
  }

  return {
   start: startGame
  };

})();

TicTac.start();
