/**
 * Fenêtre Electron simple et vide
 */

const { app, BrowserWindow } = require('electron');

let mainWindow;

// Création de la fenêtre
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    title: 'Fenêtre Simple',
    frame: true, // Garde la barre de titre
    autoHideMenuBar: true, // Cache la barre de menu
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      devTools: false // Désactive complètement les DevTools
    }
  });

  // Page HTML vide
  mainWindow.loadURL('data:text/html;charset=utf-8,<h1>Fenetre Electron vide</h1>');
  
  // Supprime complètement la barre de menu
  mainWindow.setMenuBarVisibility(false);
  
  // Désactive TOUS les raccourcis par défaut
  mainWindow.webContents.on('before-input-event', (event, input) => {
    // Bloque Alt seul
    if (input.key === 'Alt' && input.type === 'keyDown') {
      event.preventDefault();
    }
    // Bloque F11 (plein écran)
    if (input.key === 'F11') {
      event.preventDefault();
    }
    // Bloque Ctrl+Shift+I (DevTools)
    if (input.control && input.shift && input.key === 'I') {
      event.preventDefault();
    }
  });

  // Quand la fenêtre est fermée
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// Quand Electron est prêt
app.whenReady().then(createWindow);

// Quitter quand toutes les fenêtres sont fermées
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
//test
// Recréer une fenêtre sur macOS
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
