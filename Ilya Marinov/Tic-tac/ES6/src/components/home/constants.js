const CONSTANTS = {
  CLASSES: {
    HOME_MENU: '.home__wrapper'
  },
  ID: {
    APP_CONTAINER: '#app'
  }
}

const contexts = {
  title: 'Welcome to Tic-Tac-Toe!',
  user: '',
  menu: [{
      item: 'New Game',
      class: 'home__button_newgame',
      data: 'newgame'
    }, {
      item: 'Scores',
      class: 'home__button_scores',
      data: 'scores'
    }, {
      item: 'Settings',
      class: 'home__button_settings',
      data: 'settings'
    }, {
      item: 'About',
      class: 'home__button_about',
      data: 'about'
  }]
}

export { CONSTANTS, contexts };
