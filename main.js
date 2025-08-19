const { app, BrowserWindow, Menu, ipcMain, Notification } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
  const iconPath = process.platform === 'darwin' 
    ? path.join(__dirname, 'src/assets/icon.icns')
    : path.join(__dirname, 'src/assets/icon.png');

  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 600,
    minHeight: 400,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
    icon: iconPath,
    titleBarStyle: 'hiddenInset',
    backgroundColor: '#0a0a0a'
  });

  mainWindow.loadFile('index.html');

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

function createMenu() {
  const template = [
    {
      label: 'Pomodoro Timer',
      submenu: [
        { label: 'About Pomodoro Timer', role: 'about' },
        { type: 'separator' },
        { label: 'Quit', accelerator: 'Command+Q', click: () => app.quit() }
      ]
    },
    {
      label: 'View',
      submenu: [
        {
          label: 'Toggle Fullscreen',
          accelerator: 'Ctrl+Command+F',
          click: () => mainWindow.setFullScreen(!mainWindow.isFullScreen())
        },
        { role: 'reload' },
        { role: 'toggledevtools' }
      ]
    }
  ];
  
  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}

app.whenReady().then(() => {
  createWindow();
  createMenu();
  
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

ipcMain.handle('show-notification', (event, title, body) => {
  const iconPath = path.join(__dirname, 'src/assets/icon.png');
  new Notification({ title, body, icon: iconPath }).show();
});