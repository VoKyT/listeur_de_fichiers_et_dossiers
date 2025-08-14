/**
 * Fenêtre Electron avec React + Vite - Version corrigée
 */

// Configuration de l'encodage pour les accents
if (process.platform === 'win32') {
  process.env.FORCE_COLOR = '1';
  process.env.CHCP = '65001';
}

const { app, BrowserWindow } = require('electron');
const path = require('path');
const { spawn } = require('child_process');

let mainWindow;
let viteProcess;
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
        for (const line of lines) {
          const portMatch = line.match(/:30(\d\d).*LISTENING/);
          if (portMatch) {
            const port = `30${portMatch[1]}`;
            // Préférer le port 3002 s'il existe (plus récent)
            if (port === '3002' || !viteUrl.includes('3002')) {
              viteUrl = `http://localhost:${port}`;
              console.log(`>> Vite detecte sur le port ${port}`);
            }
          }
        }
        if (viteUrl !== 'http://localhost:3001') {
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
      
      // Détecter l'URL de Vite
      const urlMatch = output.match(/Local:\s+http:\/\/localhost:(\d+)\//);
      if (urlMatch) {
        viteUrl = `http://localhost:${urlMatch[1]}`;
        console.log(`>> Vite pret sur ${viteUrl}`);
        setTimeout(resolve, 1000);
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
    width: 1000,
    height: 700,
    title: 'Listeur de Fichiers et Dossiers - React',
    frame: true,
    autoHideMenuBar: true,
    show: false, // Ne pas afficher immédiatement
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      devTools: true
    }
  });

  // Charge l'application React
  console.log(`>> Chargement de ${viteUrl}`);
  mainWindow.loadURL(viteUrl).catch(err => {
    console.error('Erreur lors du chargement:', err);
  });
  
  // Supprime la barre de menu
  mainWindow.setMenuBarVisibility(false);

  // Quand la fenêtre est prête
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    console.log('>> Fenetre Electron prete !');
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
