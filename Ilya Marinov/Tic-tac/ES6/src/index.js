import './sass/app.scss';
import appModule from './components/app.js';

const onLoaded = () => {
  appModule.init();
}

document.addEventListener('DOMContentLoaded', onLoaded);
