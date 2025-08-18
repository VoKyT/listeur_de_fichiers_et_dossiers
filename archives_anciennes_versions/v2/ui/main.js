/**
 * Fenêtre Electron avec React + Vite + Backend Service
 * Version intégrée avec service backend Node.js
 */

// Configuration de l'encodage pour les accents
if (process.platform === 'win32') {
  process.env.FORCE_COLOR = '1';
  process.env.CHCP = '65001';
}

const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');
const { spawn } = require('child_process');

// Import du service backend Electron
const ElectronBackendService = require('../src/electron/backend-service');

let mainWindow;
let viteProcess;
let backendService;
let viteUrl = 'http://localhost:3001'; // URL par défaut

// Désactiver les avertissements de sécurité pour le développement
process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = 'true';

// Fonction pour détecter le port Vite
function detectVitePort() {
  return new Promise((resolve) => {
    const { exec } = require('child_process');
    exec('netstat -an | findstr "LISTENING" | findstr ":30"', (error, stdout) => {
      if (!error && stdout) {
        // Chercher les ports en écoute (LISTENING)
        const lines = stdout.split('\n');
        const ports = [];
        for (const line of lines) {
          const portMatch = line.match(/:30(\d\d).*LISTENING/);
          if (portMatch) {
            ports.push(`30${portMatch[1]}`);
          }
        }
        
        // Préférer 3002, puis 3001, puis le premier disponible
        const preferredPort = ports.includes('3002') ? '3002' : 
                             ports.includes('3001') ? '3001' : 
                             ports[0];
        
        if (preferredPort) {
          viteUrl = `http://localhost:${preferredPort}`;
          console.log(`>> Vite detecte sur le port ${preferredPort}`);
          resolve(true);
          return;
        }
      }
      resolve(false);
    });
  });
}

// Fonction pour lancer Vite
async function startVite() {
  // D'abord vérifier si Vite est déjà en cours
  const viteRunning = await detectVitePort();
  if (viteRunning) {
    console.log('>> Vite deja en cours');
    return;
  }

  console.log('>> Demarrage de Vite...');
  
  return new Promise((resolve) => {
    viteProcess = spawn('npm', ['run', 'dev'], {
      cwd: path.join(__dirname, '..'),
      shell: true,
      stdio: 'pipe'
    });

    viteProcess.stdout.on('data', (data) => {
      const output = data.toString();
      console.log(output.trim());
      
      // Détecter l'URL de Vite (amélioration pour gérer les caractères spéciaux)
      const urlMatch = output.match(/Local:\s+http:\/\/localhost:(\d+)\//);
      if (urlMatch) {
        viteUrl = `http://localhost:${urlMatch[1]}`;
        console.log(`>> Vite pret sur ${viteUrl}`);
        setTimeout(resolve, 1000);
        return;
      }
      
      // Détecter également les lignes unicode/spéciales de Vite
      if (output.includes('localhost:') && output.includes('30')) {
        const portMatch = output.match(/localhost:(\d{4})/);
        if (portMatch) {
          viteUrl = `http://localhost:${portMatch[1]}`;
          console.log(`>> Vite detecte sur ${viteUrl} (unicode)`);
          setTimeout(resolve, 1000);
        }
      }
    });

    viteProcess.stderr.on('data', (data) => {
      console.error('Vite:', data.toString());
    });

    // Timeout de sécurité
    setTimeout(resolve, 8000);
  });
}

// Création de la fenêtre
function createWindow() {
  console.log('>> Creation de la fenetre Electron...');
  
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    title: 'Listeur de Fichiers et Dossiers - Electron + React',
    frame: true,
    autoHideMenuBar: true,
    show: false, // Ne pas afficher immédiatement
    webPreferences: {
      nodeIntegration: false, // Sécurité améliorée
      contextIsolation: true, // Isolation du contexte
      enableRemoteModule: false, // Sécurité
      preload: path.join(__dirname, '..', 'src', 'electron', 'preload.js'), // Script preload
      devTools: true
    }
  });

  // Charge l'application React
  console.log(`>> Chargement de ${viteUrl}`);
  mainWindow.loadURL(viteUrl).catch(err => {
    console.error('Erreur lors du chargement:', err);
  });
  
  // Menu de développement
  const template = [
    {
      label: 'Développement',
      submenu: [
        {
          label: 'Ouvrir DevTools',
          accelerator: 'F12',
          click: () => {
            mainWindow.webContents.openDevTools();
          }
        },
        {
          label: 'Actualiser',
          accelerator: 'F5',
          click: () => {
            mainWindow.webContents.reload();
          }
        },
        {
          label: 'Fermer',
          accelerator: 'Alt+F4',
          click: () => {
            mainWindow.close();
          }
        }
      ]
    }
  ];
  
  const menu = Menu.buildFromTemplate(template);
  mainWindow.setMenu(menu);

  // Gestionnaires d'événements clavier pour les DevTools
  mainWindow.webContents.on('before-input-event', (event, input) => {
    // F12 pour ouvrir/fermer les DevTools
    if (input.key === 'F12' && input.type === 'keyDown') {
      if (mainWindow.webContents.isDevToolsOpened()) {
        mainWindow.webContents.closeDevTools();
      } else {
        mainWindow.webContents.openDevTools();
      }
    }
    // Ctrl+Shift+I pour ouvrir les DevTools
    if (input.key === 'I' && input.control && input.shift && input.type === 'keyDown') {
      mainWindow.webContents.openDevTools();
    }
  });

  // Quand la fenêtre est prête
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    console.log('>> Fenetre Electron prete !');
    console.log('>> Utilisez F12 ou Ctrl+Shift+I pour ouvrir les DevTools');
  });

  // Quand la fenêtre est fermée
  mainWindow.on('closed', () => {
    mainWindow = null;
    if (viteProcess) {
      viteProcess.kill();
    }
  });

  // Gestion des erreurs de chargement
  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
    console.error(`Erreur de chargement: ${errorDescription}`);
  });
}

// Quand Electron est prêt
app.whenReady().then(async () => {
  try {
    console.log('>> Demarrage de l\'application...');
    
    // Initialiser le service backend
    backendService = new ElectronBackendService();
    console.log('>> Service backend initialisé');
    
    await startVite();
    createWindow();
    
  } catch (error) {
    console.error('Erreur lors du démarrage:', error);
    app.quit();
  }
});

// Quitter quand toutes les fenêtres sont fermées
app.on('window-all-closed', () => {
  if (viteProcess) {
    viteProcess.kill();
  }
  if (backendService) {
    backendService.cleanup();
  }
  app.quit();
});

// Recréer une fenêtre sur macOS
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// Gestion des erreurs
process.on('uncaughtException', (error) => {
  console.error('Erreur non capturée:', error);
});

process.on('unhandledRejection', (reason) => {
  console.error('Promesse rejetée:', reason);
});
