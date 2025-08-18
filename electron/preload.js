const { contextBridge, ipcRenderer } = require('electron');

// Exposer des APIs sécurisées au renderer process
contextBridge.exposeInMainWorld('electronAPI', {
    // Sélection de dossier
    selectDirectory: () => ipcRenderer.invoke('select-directory'),
    
    // Scan de répertoire
    scanDirectory: (path, options) => ipcRenderer.invoke('scan-directory', path, options),
    
    // Sauvegarde de fichier
    saveFile: (filePath, content) => ipcRenderer.invoke('save-file', filePath, content),
    
    // Informations de la plateforme
    platform: process.platform,
    
    // Version de l'application
    versions: {
        node: process.versions.node,
        chrome: process.versions.chrome,
        electron: process.versions.electron
    }
});

// API pour les notifications (optionnel)
contextBridge.exposeInMainWorld('notificationAPI', {
    showNotification: (title, body) => {
        new Notification(title, { body });
    }
});
