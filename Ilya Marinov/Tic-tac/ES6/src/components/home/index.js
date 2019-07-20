import { pageChangeEvent } from '../../core/events.js';
import Storage from '../../core/storage.js';

import template from './template.hbs';
import { CONSTANTS, contexts } from './constants.js';
import './style.scss';

const home = (function() {
  const { CLASSES, ID } = CONSTANTS;
  let context = contexts;

  const render = function() {
    const userName = Storage.getStorage('User').name;
    context.user = userName ? userName : 'Admin';
    return template(context);
  }

  const afterRender = function() {
    const menuContainer = document.querySelector(CLASSES.HOME_MENU);
    menuContainer.addEventListener('click', function(e) {
      const page = e.target.dataset.page;
      if (!page) {
        return;
      }

      const path = { url: window.location.pathname };
      history.pushState(path, null, `/${page}`);
      pageChangeEvent(page);
    });
  }

  return {
    render,
    afterRender
  }
})();

export default home;
