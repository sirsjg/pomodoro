const { app, BrowserWindow, Menu, ipcMain, Notification } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
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
    icon: path.join(__dirname, 'icon.png'), // Optional: add an icon
    titleBarStyle: 'hiddenInset', // macOS style title bar
    backgroundColor: '#0a0a0a'
  });

  mainWindow.loadFile('index.html');
  
  // Start in fullscreen if desired
  // mainWindow.setFullScreen(true);

  mainWindow.on('closed', function () {
    mainWindow = null;
  });
}

// Create app menu
function createMenu() {
  const template = [
    {
      label: 'Pomodoro Timer',
      submenu: [
        {
          label: 'About Pomodoro Timer',
          role: 'about'
        },
        { type: 'separator' },
        {
          label: 'Quit',
          accelerator: 'Command+Q',
          click: () => app.quit()
        }
      ]
    },
    {
      label: 'View',
      submenu: [
        {
          label: 'Toggle Fullscreen',
          accelerator: 'Ctrl+Command+F',
          click: () => {
            mainWindow.setFullScreen(!mainWindow.isFullScreen());
          }
        },
        { role: 'reload' },
        { role: 'toggledevtools' }
      ]
    }
  ];
  
  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

app.whenReady().then(() => {
  createWindow();
  createMenu();
  
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

ipcMain.handle('show-notification', (event, title, body) => {
  new Notification({ title, body, icon: path.join(__dirname, 'icon.png') }).show();
});