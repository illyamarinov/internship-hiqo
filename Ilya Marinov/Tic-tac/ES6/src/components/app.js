import home from './home';
import newgame from './newgame';
import scores from './scores';
import settings from './settings';
import about from './about';
import auth from './authorization';

import { checkAuth } from '../core/auth.js';

const app = (function() {

  const app = document.querySelector('#app');
  const disctionary = {
    home,
    newgame,
    settings,
    scores,
    about,
    auth
  };

  const init = function() {

    // init initRouting
    initRouting();

    window.onpopstate = function() {
      urlChanged(window.location.pathname);
    };

    urlChanged(window.location.pathname);
  }

  const initRouting = function() {

    // Add event listeners on page change
    app.addEventListener('pageChanged', function(event) {
      const page = event.detail;
      urlChanged(page);
    });
  }

  const changePage = function(page) {
    const newpage = page === '' ? 'home' : page;
    const pageModule = disctionary[newpage];
    if (!pageModule) {
      return;
    }

    // Remove current page content
    // Render new page
    // Add new page content into DOM
    app.innerHTML = pageModule.render();
    pageModule.afterRender();
    return true;
  }

  const urlChanged = function(page) {
    let isLoggedIn = checkAuth();

    if (!isLoggedIn) {
      changePage('auth');
      page = 'auth';
    } else {

      page = page.toLowerCase().replace('/', '');
      const pageExists = changePage(page);

      if (!pageExists) {
        return;
      }
    }

    const path = { url: window.location.pathname };
    history.pushState(path, null, `/${page}`);
  }

  return {
    init
  }
})();

export default app;
