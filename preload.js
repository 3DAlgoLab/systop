const { Notification, contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  notify: function (options) {
    ipcRenderer.send('notify', options);
  },
});
