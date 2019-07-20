import { TICTAC } from './constants.js';

const { STATUS, ERROR } = TICTAC;

function TicTacToe() {

    // game field
    this._gameField = [];

    // field length default is 3
    this._defaultFieldSize = 3;
    this._fieldSize = 0;

    /*
     * player list when it's init
     * counter for change players turn
     */
    this._playersList = [];
    this._turnCounter = 0;
    this._currentPlayerTurn = null;

    // empty symbol and flag
    this._emptySymbol = '';
    this._emptyChange = true;

    // newgame flag, for init
    this._newGame = true;

    // status where game is on
    this._gameStatus = '';
    // winner
    this._winnerPosition = null;
    this._winner = null;


    // flag 'tie' returns true when is tie
    this._tie = true;
    // flag for error in game
    this._error = false;
}

TicTacToe.prototype = (function() {

  /**
   * @function init
   * @description init game field for tic-tac-toe
   * @param {array} players
   * @param {array|number} config
   */
  const init = function(players, config) {
    playersInit.call(this, players);
    if (config !== undefined && (!this._error)) {

      if (typeof config === 'object' && Array.isArray(config)) {
        fieldInit.call(this, config);
        return;
      } else if (typeof config === 'number') {
        if (config < this._defaultFieldSize) {
          this._gameStatus = ERROR.SIZE_MIN;
          this._error = true;
          return;
        }

        this._fieldSize = config;
        newFieldCreate.call(this);
        checkCurrentPlayerTurn.call(this);
        this._gameStatus = `Turn player  -${this._currentPlayerTurn.name}-`;
        return;
      }
    } else {
      return;
    }
    this._gameStatus = ERROR.INIT;
    return;
  }

  /**
   * @function playersInit
   * @description init input data of game players
   * @param {array} array - array of players name and symbols pairs
   * @returns {boolean}
   */
  const playersInit = function(array) {
    if (array !== undefined && Array.isArray(array)) {
      if (array.length < 2) {
        this._gameStatus = ERROR.PLAYERS_MIN;
        this._error = true;
        return;
      }

      let symbols = [];
      let names = [];
      array.forEach((player) => {
        names.push(player['name']);
        symbols.push(player['symbol']);
      });

      symbols.forEach((element, i) => {
        if (symbols.indexOf(element, i+1) !== -1 || element === this.emptySymbol) {
          this._gameStatus = ERROR.SYMBOLS;
          this._error = true;
          return;
        }
      });

      names.forEach((element, i) => {
        if (names.indexOf(element, i+1) !== -1) {
          this._gameStatus = ERROR.NAMES;
          this._error = true;
          return;
        }
      });

      array.forEach((i) => {
        i.count = 0;
        this._playersList.push(i);
      });
    }
  };

  /**
   * @function fieldInit
   * @description init users field
   * @param {array} field
   * @returns {string}
   */
  const fieldInit = function(field) {

    // checking for field size config
    if (field.length < this._defaultFieldSize) {
      this._gameStatus = ERROR.SIZE_MIN
      this._error = true;
      return;
    }

    this._fieldSize = field.length;

    // checking for square form of game field
    for (let i = 0; i < this._fieldSize; i++) {
      if (this._fieldSize !== field[i].length) {
        this._gameStatus = ERROR.SIZE;
        this._error = true;
        return;
      }
    }

    // checking config for valid input
    let validResult = isValid.call(this, players, field);
    if (validResult) {
      this._newGame = false;
      this._gameField = field;

      // if valid, check winners
      let winnerResult = checkWinner.call(this, this._gameField);

      // if has no winner, check for available moves by existing empty cells
      if (!winnerResult) {

        // if empty true, then calculate who must to do the next move
        let emptyResult = isEmptyRemain.call(this, this._gameField);

        if (emptyResult) {
          checkCurrentPlayerTurn.call(this);
          this._gameStatus += `${STATUS.INIT_CURRENT_PLAYER} ${this._currentPlayerTurn.name}`;
          return;
        } else {
          // if field has no empty cells and no winner, then return tie
          this._gameStatus = STATUS.TIE;
          return;
        }
      } else {
        return this._winnerPosition.trim();
      }
    } else {
      this._gameStatus = ERROR.INVALID;
      this._error = true;
      return;
    }
  }

  /**
   * @function newFieldCreate
   * @description creating field for new game
   */
  const newFieldCreate = function() {
    this._gameField.length = 0;
    for (let i = 0; i < this._fieldSize; i++) {
      this._gameField.push([]);
      for (let j = 0; j < this._fieldSize; j++) {
        this._gameField[i].push('');
      }
    }
  }

  /**
   * @function checkCurrentPlayerTurn
   */
  const checkCurrentPlayerTurn = function() {
    this._playersList.sort((a, b) => a.count - b.count);
    this._currentPlayerTurn = this._playersList[this._turnCounter];
  }

  /**
   * @function isValid
   * @description checks for valid of game field. return true or false
   * @param {array} players - players list
   * @param {array} field - field config
   * @returns {boolean}
   */
  const isValid = function(players, field) {
    let max = 0;
    let min = Infinity;
    let symbols = [];

    players.forEach((player) => {
      symbols.push(player['symbol']);
    });

    /*
     * 1) counting game symbols in field if one of these more by 1 than others => return false
     * 2) if field have its own empty symbol replace default for users symbol, after flag false
     */
     // TODO: FOREACH OR MAP
    for (let i = 0; i < this._fieldSize; i++) {
      for (let j = 0; j < this._fieldSize; j++) {
        if (symbols.includes(field[i][j])) {
          this._playersList.forEach((player) => {
            if (player.symbol === field[i][j]) {
              player.count += 1;
            }
          });
        } else if (field[i][j] === this._emptySymbol) {
          this._emptyChange = false;
        } else {
          if (!this._emptyChange) {
            return false;
          }
          this._emptySymbol = field[i][j];
          this._emptyChange = false;
        }
      }
    }

    checkCurrentPlayerTurn.call(this);
    for (let key of this._playersList) {
      if (key.count > max) {
        max = key.count;
      }
      if (key.count < min) {
        min = key.count;
      }
    }
    // TODO: simplify
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
  const isEmptyRemain = function(field) {
    for (let i = 0; i < this._fieldSize; i++) {
      for (let j = 0; j < this._fieldSize; j++) {
        if (field[i][j] === this._emptySymbol) {
          return true;
        }
      }
    }
    return false;
  }

  /**
   * @function checkWinner
   * @param {array} gameField
   * @returns {boolean}
   */
  const checkWinner = function(gameField) {

    // if valid, check winners
    this._winnerPosition = (checkRow.call(this, gameField) + '\n' + checkColumn.call(this, gameField) + '\n' + checkDiogonals.call(this, gameField)).trim();

    return !this._tie;
  }

  /**
   * @function checkRow
   * @returns {string}
   */
  const checkRow = function(field) {
    for (let i = 0; i < this._fieldSize; i++) {
      let comparableRow = field[i][0];
      for (let j = 0; j < this._fieldSize; j++) {
        if (comparableRow === this._emptySymbol || comparableRow !== field[i][j + 1]) {
          break;
        } else if (j + 2 === this._fieldSize) {
          this._tie = false;
          this._gameStatus = `${STATUS.WINNER_ROW} ${field[i][j]} – ${i + 1} .`;
          return;
        }
      }
    }
    return '';
  }

  /**
   * @function checkColumn
   * @returns {string}
   */
  const checkColumn = function(field) {
    for (let i = 0; i < this._fieldSize; i++) {
      let comparableColumn = field[0][i];
      for (let j = 0; j < this._fieldSize; j++) {
        if (comparableColumn === this._emptySymbol || comparableColumn !== field[j + 1][i]) {
          break;
        } else if (j + 2 === this._fieldSize) {
          this._tie = false;
          this._gameStatus = `${STATUS.WINNER_COLUMN} ${field[j][i]} – ${i + 1} .`;
          return;
        }
      }
    }
    return '';
  }

  /**
   * @function checkDiogonals
   * @returns {string}
   */
  const checkDiogonals = function(field) {
    // left
    let comparableLeftDiagonal = field[0][0];
    for (let i = 0; i < this._fieldSize; i++) {
      if (comparableLeftDiagonal === this._emptySymbol || comparableLeftDiagonal !== field[i+1][i+1]) {
        break;
      } else if (i + 2 === this._fieldSize) {
        this._tie = false;
        this._gameStatus = `${STATUS.WINNER_DIAGONAL_L} ${field[i][i]}.`;
        return;
      }
    }

    let j = this._fieldSize;

    // right
    let comparableRightDiagonal = field[0][j - 1];
    for (let i = 0; i < this._fieldSize; i++) {
      if (comparableRightDiagonal === this._emptySymbol || comparableRightDiagonal !== field[i + 1][j - 2]) {
        break;
      } else if (i + 2 === this._fieldSize) {
        this._tie = false;
        this._gameStatus = `${STATUS.WINNER_DIAGONAL_R} ${field[i][j-1]}.`;
        return;
      } else {
        j--;
      }
    }
    return '';
  }

  /**
   * @function checkMove
   * @description checks if user may to move to clicked cell, then calculate if game is over, if its not, next player turn
   * @param {number} coordX
   * @param {number} coordY
   * @returns {boolean}
   */
  const checkMove = function(x, y) {
    if (moveTo.call(this, x, y)) {
      checkWinner.call(this, this._gameField);
      this._turnCounter++;

      if (this._turnCounter > this._playersList.length - 1) {
        this._turnCounter = 0;
      }
      this._currentPlayerTurn = this._playersList[this._turnCounter];
      if (!isEmptyRemain.call(this, this._gameField) && this._winnerPosition === '') {
        this._gameStatus = STATUS.TIE;
        this._winnerPosition = 'nobody';
      }

      return true;
    }
    return false;
  }

  /**
   * @function moveTo
   * @description making move to clicked cell
   * @param {number} coordX
   * @param {number} coordY
   * @returns {boolean}
   */
  const moveTo = function(x, y) {
    if (this._gameField[x][y] === this._emptySymbol) {
      this._gameField[x][y] = this._currentPlayerTurn.symbol;
      this._winner = this._currentPlayerTurn.name;
      return true;
    }
    return false;
  }

  return {
    init,
    checkMove
  }
})();

export default TicTacToe;
