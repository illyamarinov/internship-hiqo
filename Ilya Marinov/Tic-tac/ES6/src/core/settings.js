let instance;
const defaultConfig = {
  fieldSize: 3,
  playersNumb: 2,
  playersList: [{
    name: 'Player 1',
    symbol: 'x',
    color: '#000000'
  }, {
    name: 'Player 2',
    symbol: 'o',
    color: '#FFFFFF'
  }]
};

class Settings {
  constructor(customConfig = {}) {
    const config = {
      ...defaultConfig,
      ...customConfig
    };

    if (!instance) {
      instance = this;
    }

    this.playersNumb = config.playersNumb;
    this.playersList = [];
    this.fieldSize = +config.fieldSize;

    for (let i = 0; i < config.playersNumb; i++) {
      this.playersList.push(config.playersList[i]);
    }

    return instance;
  }
}

const gameSettings = new Settings();

export default gameSettings;
// export { gameSettings, Settings };
