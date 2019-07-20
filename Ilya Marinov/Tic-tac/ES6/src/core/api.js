import { API } from './constants.js';

export const post = function(url, body, callback) {
  return new Promise(function(resolve, reject) {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', `${API.URL}${url}`);

    xhr.onload = function() {
      if (this.status >= 200 && this.status < 300) {
        resolve(this.responseText);
      } else {
        reject({
          status: this.status,
          statusText: this.statusText,
          responseText: this.responseText
        });
      }
    };

    xhr.onerror = function () {
      reject({
        status: this.status,
        statusText: this.statusText
      });
    };

    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

    xhr.send(body);
  });

}
