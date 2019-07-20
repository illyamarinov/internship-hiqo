import Storage from './storage.js';

const checkAuth = function() {
  const hour = 60 * 60 * 1000;
  const user = Storage.getStorage('User');
  const currentDate = +new Date();

  if (user) {
    if (currentDate - user.timestamp < hour) {
      return true;
    }
  }

  return false;
}

export {
  checkAuth
};
