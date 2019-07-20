import { Player } from '../settings/models.js';

const CONSTANTS = {
  CLASSES: {
    GAMEFORM: '.newgame-form',
    ADDPLAYERBUTTON: '.newgame-form__player-panel__add-button',
    BACKBUTTON: '.newgame-header__back',
    STARTGAMEBUTTON: '.newgame-form__field-panel__start-button',
    STARTDEFAULTBUTTON: '.newgame-button__default',
    STARTCONFIGBUTTON: '.newgame-button__config',
    DELETEPLAYERBUTTON: '.newgame-form__player-panel__delete-button',
    PLAYERWRAPPER: '.newgame-form__player-panel',
    PLAYERINFO: '.newgame-form__player-panel__player-info',
    INGAME: 'in-game',
    INPUTERROR: 'input_error',
    BACKTOMENU: '.back-to-menu'
  },
  ID: {
    APPCONTAINER: '#app',
    SIZEBUTTON: '#size-button'
  },
  ATTRIBUTES: {
    PLAYER: {
      NAME: '[name=player-name]'
    },
    SYMBOL: {
      NAME: '[name=player-symbol]'
    }
  }
}

const contexts = {
  start: {
    title: 'New Game',
    mode: [
      {
        option: 'Start default',
        class: 'default'
      },
      {
        option: 'Start config',
        class: 'config'
      }
    ]
  },
  default: {},
  // TODO: Player model
  config: {
    title: 'New Game',
    players: [
      new Player(1, 'Player 1', 'x', '#000000'),
      new Player(2, 'Player 2', 'o', '#ffffff')
    ]
  }
}

export { CONSTANTS, contexts };
