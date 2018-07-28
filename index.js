const electron = require('electron');

const {app, BrowserWindow, Menu, ipcMain} = electron

let mainWindow;
let addWindows;

app.on('ready', () => {
  mainWindow = new BrowserWindow({});
  mainWindow.loadURL(`file://${__dirname}/main.html`);
  mainWindow.on('closed', () => app.quit());

  const mainMenu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(mainMenu);
});

function createAddWindow() {
  addWindow = new BrowserWindow({
    width: 350,
    height: 200,
    title: 'Add New Todo'
  });
  addWindow.loadURL(`file://${__dirname}/add.html`);

  // add a handler for closed for the window to do garbage collection on window close
  addWindow.on('closed', () => {
    addWindow = null;
  });
};

ipcMain.on('todo:add', (event, todo) => {
  mainWindow.webContents.send('todo:add', todo);
  addWindow.close();
});

function clearTodos() {
  mainWindow.webContents.send('todos:clear');
};

const menuTemplate = [
  // add empty object for Mac OSX so the first menu option doesn't get gobbled up
  // under the application menu In other words, if we didn't have this, the File
  // option below wouldn't show up.
  // {},
  {
    label: 'File',
    submenu: [
      {
        label: 'New Todo',
        accelerator: process.platform === 'darwin' ? 'Command+N' : 'Ctrl+N',
        click() { createAddWindow(); }
      },
      {
        label: 'Clear Todos',
        accelerator: process.platform === 'darwin' ? 'Command+L' : 'Ctrl+L',
        click() { clearTodos(); }
      },
      {
        label: 'Quit',
        accelerator: process.platform === 'darwin' ? 'Command+Q' : 'Ctrl+Q',
        click() {
          app.quit();
        }
      }
    ]
  }
];

if (process.platform === 'darwin') {
  menuTemplate.unshift({});
}

if (process.env.NODE_ENV !== 'production') {
  // possible NODE_ENV values
  // 'production'
  // 'development'
  // 'staging'
  // 'test'

  // add the missing developer tools to the menu
  menuTemplate.push({
    label: 'View',
    submenu: [
      { role: 'reload' }, // shortcut in Electron to add the reload menu option
      {
        label: 'Toggle Developer Tools',
        accelerator: process.platform === 'darwin' ? 'Command+Alt+I' : 'Ctrl+Shift+I',
        click(item, focusedWindow) {
          focusedWindow.toggleDevTools();
        }
      }
    ]
  })
}