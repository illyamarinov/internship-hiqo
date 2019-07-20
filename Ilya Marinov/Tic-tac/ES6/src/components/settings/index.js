import gameSettings from '../../core/settings.js';
import { pageChangeEvent } from '../../core/events.js';

import { CONSTANTS, contexts } from './constants.js';
import { Player } from './models.js';
import SettingsService from './service.js';
import template from './template.hbs';
import './style.scss';

const settings = (function() {
  const { CLASSES, ATTRIBUTES, ID } = CONSTANTS;
  let context;

  const render = function() {
    let getSettings = SettingsService.getSettings() || {};

    context = {
      ...contexts,
      ...getSettings
    };

    return template(context);
  }

  const updateView = function() {
    app.innerHTML = template(context);
    afterRender();
  }

  const afterRender = function() {
    const backButton = document.querySelector(CLASSES.BACKBUTTON);
    const saveButton = document.querySelector(CLASSES.SAVEBUTTON);
    const playerNumberButton = document.querySelector(ID.PLAYERSBUTTON);

    playerNumberButton.addEventListener('change', playersButtonHandler);
    backButton.addEventListener('click', menuBackHandler);
    saveButton.addEventListener('click', saveButtonHandler);
  }

  const playersButtonHandler = function() {
    const playerNumberButton = document.querySelector(ID.PLAYERSBUTTON);

    context.form.playersNumb = playerNumberButton.value;

    const playersCount = context.form.playersList.length;
    const playersNewCount = playerNumberButton.value;
    const diff = playersNewCount - playersCount;

    if (diff > 0) {
      
      // add new players
      for (let i = 0; i < diff; i++) {
        const id = context.form.playersList.length + 1;
        context.form.playersList.push(new Player(id));
      }
    } else {

      // remove unnecessary players
      context.form.playersList.splice(playersNewCount, -diff);
    }

    saveSettings(context);
    updateView();
  }

  const menuBackHandler = function(e) {
    const page = e.target.dataset.page;
    if (!page) {
      return;
    }
    pageChangeEvent(page);
  }

  const saveButtonHandler = function() {
    const gameForm = document.querySelector(CLASSES.SETTINGSFORM);
    const sizeInput = +document.querySelector(ID.SIZEBUTTON).value;
    const namesInputs = document.querySelectorAll(ATTRIBUTES.PLAYER.NAME);
    const symbolsInputs = document.querySelectorAll(ATTRIBUTES.SYMBOL.NAME);
    const colorInputs = document.querySelectorAll(ATTRIBUTES.COLOR.NAME);

    context.form.playersList.length = 0;

    let error = false;
    const names = [];
    const symbols = [];

    for (let i = 0; i < symbolsInputs.length; i++) {
      symbolsInputs[i].classList.remove(CLASSES.INPUTERROR);
      namesInputs[i].classList.remove(CLASSES.INPUTERROR);
    }

    for (let i = 0; i < symbolsInputs.length; i++) {

      // symbol validation
      const symbol = symbolsInputs[i].value;
      if (!symbol) {
        symbolsInputs[i].classList.add(CLASSES.INPUTERROR);
        context.errors.symbolRequired = true;
        error = true;
      } else if (symbols.indexOf(symbol) > -1) {
        symbolsInputs[i].classList.add(CLASSES.INPUTERROR);
        context.errors.symbolUniqueRequired = true;
        error = true;
      } else {
        symbols.push(symbol);
      }

      // name validation
      const name = namesInputs[i].value;
      if (!name) {
        namesInputs[i].classList.add(CLASSES.INPUTERROR);
        context.errors.nameRequired = true;
        error = true;
      } else if (names.indexOf(name) > -1) {
        namesInputs[i].classList.add(CLASSES.INPUTERROR);
        context.errors.nameUniqueRequired = true;
        error = true;
      } else {
        names.push(name);
      }

      // TODO: update class if error
      const player = new Player(i + 1, namesInputs[i].value, symbolsInputs[i].value, colorInputs[i].value);
      context.form.playersList.push(player);
    }

    context.form.playersNumb = namesInputs.length;

    // TODO: add errors for the fieldsize and player number inouts
    if (!error) {
      if (sizeInput <= 6 && sizeInput >= 3) {
        context.form.fieldSize = sizeInput;

        saveSettings(context);
      }
    }
    
    updateView();
  }

  const saveSettings = function(value) {
    SettingsService.setSettings(value);
  }

  return {
    render,
    afterRender
  }
})();

export default settings;
