import Storage from '../../core/storage.js';

const SettingsService = (function() {

  const settingsPath = 'Settings';

  const setSettings = function(value) {
    Storage.setStorage(settingsPath, value);
  }

  const getSettings = function() {
    return Storage.getStorage(settingsPath);
  }

  return {
    setSettings,
    getSettings
  }
}());

export default SettingsService;
