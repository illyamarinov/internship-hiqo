const TICTAC = {
  STATUS: {
    INIT_COMPLETE: 'Init complete. Creating new game field.',
    INIT_CURRENT_PLAYER: 'Init complete. Game continues, turn player ',
    TIE: 'Tie. Nobody is win.',
    WINNER_ROW: 'Winner on the row: ',
    WINNER_DIAGONAL_L: 'Winner on the left diagonal: ',
    WINNER_DIAGONAL_R: 'Winner on the right diagonal: ',
    WINNER_COLUMN: 'Winner on the column: '
  },
  ERROR: {
    INIT: 'Error. Init is not complete.',
    SIZE: 'Error. Incorrect field size. Check your input.',
    SIZE_MIN: 'Error. Incorrect field size. Minimum size is 3.',
    PLAYERS_MIN: 'Error. Minimum number of players is 2.',
    SYMBOLS: 'Error. Game symbols must be unique.',
    NAMES: 'Error. Name must be unique.',
    INVALID: 'Error. Field is not valid. Check your input.'
  },
  STORAGE: {
    GAMEKEY: 'gameSample'
  }
};

const API = {
  URL: 'http://wks-135:3000/api/'
}

export { TICTAC, API };
