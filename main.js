const { app, BrowserWindow, Menu, ipcMain, Notification } = require('electron');
const path = require('path');
// Set env
// process.env.NODE_ENV = 'development'

const isDev = process.env.NODE_ENV !== 'production' ? true : false;
const isMac = process.platform === 'darwin' ? true : false;

let mainWindow;

function createMainWindow() {
  console.log('Develop Mode: ' + isDev);
  console.log('Current OS is Mac?: ' + isMac);
  console.log(path.join(__dirname, 'preload.js'));

  mainWindow = new BrowserWindow({
    title: 'APP NAME',
    width: 350,
    height: 500,
    icon: './assets/icons/icon.png',
    resizable: isDev ? true : false,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
      worldSafeExecuteJavaScript: true,
      contextIsolation: false,
      // preload: path.join(__dirname, 'preload.js'),
    },
  });

  if (isDev) {
    mainWindow.webContents.openDevTools({ mode: 'detach' });
  }

  mainWindow.loadFile('./app/index.html');
}

app.on('ready', () => {
  createMainWindow();

  const mainMenu = Menu.buildFromTemplate(menu);
  Menu.setApplicationMenu(mainMenu);
});

const menu = [
  ...(isMac ? [{ role: 'appMenu' }] : []),
  {
    role: 'fileMenu',
  },
  ...(isDev
    ? [
        {
          label: 'Developer',
          submenu: [
            { role: 'reload' },
            { role: 'forcereload' },
            { type: 'separator' },
            { role: 'toggledevtools' },
          ],
        },
      ]
    : []),
];

app.on('window-all-closed', () => {
  if (!isMac) {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createMainWindow();
  }
});

app.allowRendererProcessReuse = true;

// IPC Handlers
ipcMain.on('notify', (event, options) => {
  const n = new Notification(options);
  n.show();
});
