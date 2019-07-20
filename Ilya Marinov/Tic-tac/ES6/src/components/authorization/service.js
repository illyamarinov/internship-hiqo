// service request to api
import { post } from '../../core/api.js';
import Storage from '../../core/storage.js';

const saveToken = (request) => {
  const name = JSON.parse(request).data.user.name;
  const token = JSON.parse(request).data.token;
  const user = {
    token,
    name,
    timestamp: +new Date()
  };
  Storage.setStorage('User', user);
};

const signIn = function(email, pass) {
  const body = `email=${email}&password=${pass}`;

  return post('auth/signin', body).then(saveToken);
};

const signUp = function(email, pass, name) {
  const body = `email=${email}&password=${pass}&name=${name}`;

  return post('auth/signup', body).then(saveToken);
};

export { signIn, signUp };
