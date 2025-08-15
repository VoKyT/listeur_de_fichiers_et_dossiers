/**
 * Preload script pour Electron - Expose les APIs backend de manière sécurisée
 * Pont entre le process main (Node.js) et le renderer (React)
 */

const { contextBridge, ipcRenderer } = require('electron');

// Expose les APIs backend via contextBridge (sécurisé)
contextBridge.exposeInMainWorld('electronAPI', {
  // Dialog APIs
  selectDirectory: () => ipcRenderer.invoke('dialog:selectDirectory'),
  saveFileDialog: (defaultName) => ipcRenderer.invoke('dialog:saveFile', defaultName),
  saveFile: (content, defaultName) => ipcRenderer.invoke('filesystem:saveFile', content, defaultName),

  // Filesystem APIs
  exploreDirectory: (directoryPath) => ipcRenderer.invoke('filesystem:explore', directoryPath),
  generateReport: (directoryPath, options) => ipcRenderer.invoke('filesystem:generateReport', directoryPath, options),

  // Configuration APIs
  getConfig: () => ipcRenderer.invoke('config:get'),
  updateConfig: (newConfig) => ipcRenderer.invoke('config:update', newConfig),

  // Utility APIs
  isElectron: () => true,
  platform: process.platform,
  versions: {
    node: process.versions.node,
    chrome: process.versions.chrome,
    electron: process.versions.electron
  }
});

console.log('✅ Preload script chargé - APIs Electron disponibles');
