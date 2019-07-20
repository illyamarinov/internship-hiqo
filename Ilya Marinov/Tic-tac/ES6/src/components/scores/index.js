import Storage from '../../core/storage.js';

import template from './template.hbs';
import CONSTANTS from './constants.js';
import './style.scss';

const scores = (function() {

  const { CLASSES } = CONSTANTS;

  let context = {
    title: 'Scores'
  };

  const render = function() {
    const getScores = Storage.getStorage('Scores');
    context.scores = getScores ? getScores : [];
    tableSort(context.scores);
    return template(context);
  }

  const afterRender = function() {
    const backButton = document.querySelector(CLASSES.BACK_BUTTON);
    const clearButton = document.querySelector(CLASSES.CLEAR_BUTTON)

    backButton.addEventListener('click', function(e) {
      const page = e.target.dataset.page;
      if (!page) {
        return;
      }
      const event = new CustomEvent('pageChanged', { detail: page });
      const app = document.querySelector('#app');
      app.dispatchEvent(event);
    });

    clearButton.addEventListener('click', function(e) {
      const scores = Storage.getStorage('Scores');
      scores.length = 0;
      Storage.setStorage('Scores', scores);

      const app = document.querySelector('#app');
      app.innerHTML = render();
      afterRender();
    })
  }

  const tableSort = function(array) {
    array.sort((a, b) => {
      return b.score - a.score;
    });
  }

  return {
    render,
    afterRender
  }
})();

export default scores;
