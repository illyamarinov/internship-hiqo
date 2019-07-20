import { Player } from './models.js';

// TODO: do not concatenate words
const CONSTANTS = {
  CLASSES: {
    SETTINGSFORM: '.settings-form',
    BACKBUTTON: '.settings-header__back',
    SAVEBUTTON: '.settings-form__field-panel__save-button',
    INPUTERROR: 'input_error'
  },
  ID: {
    SIZEBUTTON: '#size-button',
    PLAYERSBUTTON: '#players-button'
  },
  ATTRIBUTES: {
    PLAYER: {
      NAME: '[name=player-name]'
    },
    SYMBOL: {
      NAME: '[name=player-symbol]'
    },
    COLOR: {
      NAME: '[name=player-color]'
    }
  }
}

// TODO: find a suitable place
const contexts = {
  title: 'Settings',
  form: {
    playersList: [
      new Player(1, 'Player 1', 'x', '#000000'),
      new Player(2, 'Player 2', 'o', '#ffffff')
    ],
    fieldSize: 3,
    playersNumb: 2
  },
  errors: {
    symbolRequired: false,
    symbolUniqueRequired: false,
    nameRequired: false,
    nameUniqueRequired: false
  }
}

export { CONSTANTS, contexts };
