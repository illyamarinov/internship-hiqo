import Game from '../../core/tictactoe.js';
import gameSettings from '../../core/settings.js';
import Storage from '../../core/storage.js';
import { createElement, addElement } from '../../utils/helpers.js';
import { pageChangeEvent } from '../../core/events.js';

import template from './template.hbs';
import { CONSTANTS, contexts } from './constants.js';
import './style.scss';

const newgame = (function() {
  const { CLASSES, ATTRIBUTES, ID } = CONSTANTS;
  let context = contexts.start;
  const app = document.querySelector(ID.APPCONTAINER);
  let gameSample = new Game();

  const render = function() {
    return template(context);
  }

  const afterRender = function() {
    const backButton = document.querySelector(CLASSES.BACKBUTTON);
    const defaultButton = document.querySelector(CLASSES.STARTDEFAULTBUTTON);
    const configButton = document.querySelector(CLASSES.STARTCONFIGBUTTON);
    const addPlayerButton = document.querySelector(CLASSES.ADDPLAYERBUTTON);

    backButton.addEventListener('click', menuBackHandler);

    if (addPlayerButton) {
      addPlayerButton.addEventListener('click', addPlayerButtonHandler);
    }

    if (defaultButton) {
      defaultButton.addEventListener('click', defaultButtonHandler);
    }

    if (configButton) {
      configButton.addEventListener('click', configButtonHandler);
    }

    const gameForm = document.querySelector(CLASSES.GAMEFORM);
    if (gameForm) {
      const startButton = document.querySelector(CLASSES.STARTGAMEBUTTON);
      startButton.addEventListener('click', startButtonHandler);
    }
  }

  const menuBackHandler = function(e) {
    const page = e.target.dataset.page;
    if (!page) {
      return;
    }
    pageChangeEvent(page);

    // set context to start with two buttons
    context = contexts.start;

    // clear our contexts players to default
    contexts.config.players.length = 2;
  }

  // play game with default settings
  const defaultButtonHandler = function() {
    app.classList.add(CLASSES.INGAME);
    let defaultSettigs = Storage.getStorage('Settings');

    const playersList = defaultSettigs
      ? defaultSettigs.form.playersList
      : gameSettings.playersList;
    const fieldSize = defaultSettigs
      ? defaultSettigs.form.fieldSize
      : gameSettings.fieldSize;
    gameSample.init(playersList, fieldSize);
    renderField(fieldSize);

    const backToMenu = document.querySelector(CLASSES.BACKTOMENU);
    backToMenu.addEventListener('click', backHandler);
  }

  // play game with configurable settings
  const configButtonHandler = function() {
    context = contexts.config;
    app.innerHTML = render();
    afterRender();
  }

  // handler for add player button
  const addPlayerButtonHandler = function() {
    const playersList = document.querySelectorAll(CLASSES.PLAYERINFO);
    let playerCounter = playersList.length + 1;

    // TODO: replace to Player model
    const tempContext = {
      name: `Player ${playerCounter}`,
      name_id: `player-info_name${playerCounter}`,
      symbol: '',
      symbol_id: `player-info_symbol${playerCounter}`,
      span: 'x'
    };

    context.players.push(tempContext);
    app.innerHTML = render();
    afterRender();
    setDeleteButton();

    if (playerCounter >= 4) {
      const addPlayerButton = document.querySelector(CLASSES.ADDPLAYERBUTTON);
      addPlayerButton.remove();
    }
  }

  // handler for a button that deletes players
  const playerDeleteButtonHandler = function() {
    context.players.length -= 1;
    app.innerHTML = render();
    afterRender();
    setDeleteButton();
  }

  // set delete buttons to additional players
  const setDeleteButton = function() {
    const playerDeleteButtons = document.querySelectorAll(CLASSES.DELETEPLAYERBUTTON);
    for (let i = 0; i < playerDeleteButtons.length; i++) {
      playerDeleteButtons[i].addEventListener('click', playerDeleteButtonHandler);
    }
  }

  const startButtonHandler = function() {
    const gameForm = document.querySelector(CLASSES.GAMEFORM);
    const sizeInput = +document.querySelector(ID.SIZEBUTTON).value;
    const namesInputs = document.querySelectorAll(ATTRIBUTES.PLAYER.NAME);
    const symbolsInputs = document.querySelectorAll(ATTRIBUTES.SYMBOL.NAME);
    const playersList = [];

    let error = false;

    for (let i = 0; i < symbolsInputs.length; i++) {
      if (symbolsInputs[i].value !== '' && namesInputs[i].value !== '') {
        playersList.push({
          name: namesInputs[i].value,
          symbol: symbolsInputs[i].value,
          color: contexts.config.players[i].color
        });
      } else {
        symbolsInputs[i].classList.add(CLASSES.INPUTERROR);
        namesInputs[i].classList.add(CLASSES.INPUTERROR);
        error = true;
      }
    }

    if (!error) {
      if (sizeInput <= 6 && sizeInput >= 3) {
        app.classList.add(CLASSES.INGAME);

        for (let i = 0; i < symbolsInputs.length; i++) {
          symbolsInputs[i].classList.remove(CLASSES.INPUTERROR);
          namesInputs[i].classList.remove(CLASSES.INPUTERROR);
        }

        gameSample.init(playersList, sizeInput);
        renderField(sizeInput);
      }
      const backToMenu = document.querySelector(CLASSES.BACKTOMENU);
      backToMenu.addEventListener('click', backHandler);
    }
  }

  const renderField = function(fieldSize) {
    const cellsAmount = Math.pow(fieldSize, 2);
    const fieldWrap = createElement('div', 'field-wrap');
    const backToMenu = createElement('button', 'back-to-menu');
    const gameStatus = createElement('h1', 'game-status');

    gameStatus.innerHTML = gameSample._gameStatus;
    backToMenu.innerHTML = 'Back to menu';

    fieldWrap.id = 'TicTacGame';
    fieldWrap.style.width = 103 * fieldSize + 'px';
    fieldWrap.style.height = 103 * fieldSize + 'px';

    addElement(app, [fieldWrap, gameStatus, backToMenu]);

    if (gameSample._error) {
      return;
    }

    fieldWrap.addEventListener('click', fieldHandler);

    for (let i = 0; i < fieldSize; i++) {
      for (let j = 0; j < fieldSize; j++) {
        const fieldCell = createElement('div', 'field-cell');
        fieldCell.setAttribute('data-coord-x', i);
        fieldCell.setAttribute('data-coord-y', j);

// TODO: ES6
        if (i === fieldSize - 1) {
          fieldCell.className = `${fieldCell.className} field-cell-last-row `;
        }
        if (j === fieldSize - 1) {
          fieldCell.className = `${fieldCell.className} field-cell-last-column `;
        }
        if (!gameSample._newGame) {
          if (gameSample._gameField[i][j] !== gameSample._emptySymbol) {
            fieldCell.classList.add('field-cell-activated');
          }
          fieldCell.innerHTML = gameSample._gameField[i][j];
        }
        fieldWrap.appendChild(fieldCell);
      }
    }
  }

  const fieldHandler = function(e) {
    let x = +e.target.dataset.coordX;
    let y = +e.target.dataset.coordY;
    const gameStatus = document.querySelector('.game-status');
    let currentSymbol = gameSample._currentPlayerTurn.symbol;

    if (e.target.className.indexOf('field-cell') !== -1 && e.target.className.indexOf('field-cell-activated') === -1) {
      e.target.style.color = gameSample._currentPlayerTurn.color;

      let renderMove = gameSample.checkMove(x, y);

      if (renderMove) {
        e.target.innerHTML = currentSymbol;
        currentSymbol = gameSample._currentPlayerTurn.symbol;
        e.target.classList.add('field-cell-activated');
        gameStatus.innerHTML = `Turn player -${gameSample._currentPlayerTurn.name}-`;
      }

      let winnerResult = gameSample._winnerPosition;
      if (winnerResult !== '') {
        if (!gameSample._tie) {
          const getScores = Storage.getStorage('Scores');
          const scores = getScores ? getScores : [];
          let saved = false;
          if (scores.length) {
            for (let key of scores) {
              // console.log(key);
              if (key.name === gameSample._winner) {
                console.log(key.name, gameSample._winner);
                key.score++;
                saved = true;
                break;
              }
            }
            if (!saved) {
              scores.push({
                name: gameSample._winner,
                score: +1
              });
            }
          } else {
            scores.push({
              name: gameSample._winner,
              score: +1
            });
          }

          Storage.setStorage('Scores', scores);

        }

        gameStatus.innerHTML = gameSample._gameStatus;
        const fieldWrap = document.querySelector('#TicTacGame');
        fieldWrap.removeEventListener('click', fieldHandler);
      } else {
        gameStatus.style.color = gameSample._currentPlayerTurn.color;
      }
    }
  }

  const backHandler = function() {
    app.classList.remove(CLASSES.INGAME);
    const backToMenu = document.querySelector(CLASSES.BACKTOMENU);
    const gameStatus = document.querySelector('.game-status')
    const fieldWrap = document.querySelector('.field-wrap');
    fieldWrap.remove();
    backToMenu.remove();
    gameStatus.remove();
    gameSample = new Game();
  }

  return {
    render,
    afterRender
  }
})();

export default newgame;
