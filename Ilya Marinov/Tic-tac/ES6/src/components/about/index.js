import template from './template.hbs';
import CONSTANTS from './constants.js';
import './style.scss';

const about = (function() {

  const {CLASSES} = CONSTANTS;

  let context = {
    title: 'About'
  };

  const render = function() {
    return template(context);
  }

  const afterRender = function() {
    const backButton = document.querySelector(CLASSES.BACKBUTTON);

    backButton.addEventListener('click', function(e) {
      const page = e.target.dataset.page;
      if (!page) {
        return;
      }
      // TODO: replace on routing
      const event = new CustomEvent('pageChanged', { detail: page });
      const app = document.querySelector('#app');
      app.dispatchEvent(event);
    });
  }

  return {
    render,
    afterRender
  }
})();

export default about;
