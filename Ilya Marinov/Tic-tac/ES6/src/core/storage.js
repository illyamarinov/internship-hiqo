const Storage = (function() {

  const setStorage = function(key, settings) {
    localStorage.setItem(key, JSON.stringify(settings));
  }

  const deleteStorage = function() {
    localStorage.clear();
  }

  const getStorage = function(key) {
    return JSON.parse(localStorage.getItem(key));
  }

  return {
    setStorage,
    getStorage,
    deleteStorage
  }
}());

export default Storage;
