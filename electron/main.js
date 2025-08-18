const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs').promises;

// Garde une référence globale de l'objet window
let mainWindow;
let isDev = false;

// Vérifier si on est en mode développement
if (process.env.NODE_ENV === 'development' || process.defaultApp) {
    isDev = true;
}

function createWindow() {
    // Créer la fenêtre du navigateur
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        minWidth: 800,
        minHeight: 600,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            enableRemoteModule: false,
            preload: path.join(__dirname, 'preload.js')
        },
        titleBarStyle: 'default',
        show: false
    });

    // Charger l'application
    if (isDev) {
        mainWindow.loadURL('http://localhost:5173');
        mainWindow.webContents.openDevTools();
    } else {
        mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
    }

    // Afficher la fenêtre une fois prête
    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
    });

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

// Gestionnaires IPC pour la communication avec le renderer
ipcMain.handle('select-directory', async () => {
    const result = await dialog.showOpenDialog(mainWindow, {
        properties: ['openDirectory'],
        title: 'Sélectionner un dossier à analyser'
    });
    
    if (result.canceled) {
        return null;
    }
    
    return result.filePaths[0];
});

ipcMain.handle('scan-directory', async (event, directoryPath, options = {}) => {
    try {
        const results = await scanDirectoryRecursive(directoryPath, options);
        return { success: true, data: results };
    } catch (error) {
        return { success: false, error: error.message };
    }
});

ipcMain.handle('save-file', async (event, filePath, content) => {
    try {
        await fs.writeFile(filePath, content, 'utf8');
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
});

// Fonction de scan récursif (logique métier réutilisable)
async function scanDirectoryRecursive(dirPath, options = {}) {
    const { 
        excludeNodeModules = true, 
        excludeHidden = true,
        maxDepth = Infinity,
        currentDepth = 0 
    } = options;

    if (currentDepth >= maxDepth) {
        return { directories: [], files: [] };
    }

    const results = { directories: [], files: [] };
    
    try {
        const items = await fs.readdir(dirPath, { withFileTypes: true });
        
        for (const item of items) {
            const itemPath = path.join(dirPath, item.name);
            
            // Appliquer les exclusions
            if (excludeHidden && item.name.startsWith('.')) continue;
            if (excludeNodeModules && item.name === 'node_modules') continue;
            
            if (item.isDirectory()) {
                const dirInfo = {
                    name: item.name,
                    path: itemPath,
                    type: 'directory'
                };
                
                results.directories.push(dirInfo);
                
                // Scan récursif
                const subResults = await scanDirectoryRecursive(itemPath, {
                    ...options,
                    currentDepth: currentDepth + 1
                });
                
                dirInfo.children = {
                    directories: subResults.directories,
                    files: subResults.files
                };
                dirInfo.count = subResults.directories.length + subResults.files.length;
                
            } else if (item.isFile()) {
                const stats = await fs.stat(itemPath);
                results.files.push({
                    name: item.name,
                    path: itemPath,
                    type: 'file',
                    size: stats.size,
                    modified: stats.mtime
                });
            }
        }
        
    } catch (error) {
        console.error(`Erreur lors du scan de ${dirPath}:`, error);
    }
    
    return results;
}

// Événements de l'application
app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

// Sécurité : empêcher la création de nouvelles fenêtres
app.on('web-contents-created', (event, contents) => {
    contents.on('new-window', (event, navigationUrl) => {
        event.preventDefault();
    });
});
