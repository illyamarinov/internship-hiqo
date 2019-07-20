import { pageChangeEvent } from '../../core/events.js';

import template from './template.hbs';
import { CONSTANTS, contexts } from './constants.js';
import { signIn, signUp } from './service.js';
import './style.scss';

const auth = (function() {

  const { CLASSES } = CONSTANTS;
  const { ID } = CONSTANTS;

  let context = contexts;

  const render = function() {
    return template(context);
  }

  const afterRender = function() {
    const authContainer = document.querySelector(CLASSES.AUTHWRAPP);
    const signUpButton = document.querySelector(CLASSES.SIGNUPBUTTON);
    const signInButton = document.querySelector(CLASSES.SIGNINBUTTON);

    signInButton.addEventListener('click', signInHandler);
    signUpButton.addEventListener('click', signUpHandler);
  }

  const signInHandler = function() {
    const formData = document.querySelector(CLASSES.SIGNINFORM);
    const email = encodeURIComponent(formData.email.value);
    const password = encodeURIComponent(formData.password.value);
    signIn(email, password)
      .then(() => {
        pageChangeEvent('');
      })
      .catch((error) => {
        context.error.message = JSON.parse(error.responseText).message;
        app.innerHTML = render();
        afterRender();
      });
  }

  const signUpHandler = function() {
    const formData = document.querySelector(CLASSES.SIGNUPFORM);
    const email = encodeURIComponent(formData.email.value);
    const password = encodeURIComponent(formData.password.value);
    const name = encodeURIComponent(formData.name.value);
    signUp(email, password, name)
      .then(() => {
        pageChangeEvent('');
      })
      .catch((error) => {
        context.error.message = JSON.parse(error.responseText).message;
        app.innerHTML = render();
        afterRender();
      });
  }

  return {
    render,
    afterRender
  }
})();

export default auth;
