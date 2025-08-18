/**
 * Interface pour les notifications système
 * Responsabilité unique : gestion des notifications inter-systèmes
 */

const { exec } = require('child_process');
const path = require('path');

class NotificationService {
  constructor() {
    this.isWindows = process.platform === 'win32';
    this.isMacOS = process.platform === 'darwin';
    this.isLinux = process.platform === 'linux';
    this.lastNotification = null;
  }

  /**
   * Détecte les capacités de notification du système
   */
  detectCapabilities() {
    return {
      popup: this.isWindows,
      toast: this.isWindows || this.isMacOS,
      desktop: this.isLinux || this.isMacOS,
      console: true,
      system: this.isWindows || this.isMacOS || this.isLinux
    };
  }

  /**
   * Affiche une popup Windows via PowerShell
   */
  async showWindowsPopup(message, title = 'Information') {
    if (!this.isWindows) {
      throw new Error('Popup Windows non supportée sur cette plateforme');
    }

    const escapedMessage = message.replace(/'/g, "''").replace(/"/g, '""');
    const escapedTitle = title.replace(/'/g, "''").replace(/"/g, '""');
    
    const command = `powershell -Command "Add-Type -AssemblyName PresentationFramework; [System.Windows.MessageBox]::Show('${escapedMessage}', '${escapedTitle}')"`;
    
    return new Promise((resolve, reject) => {
      exec(command, (error, stdout, stderr) => {
        if (error) {
          reject(new Error(`Erreur popup: ${error.message}`));
        } else {
          this.lastNotification = {
            type: 'popup',
            message,
            title,
            timestamp: new Date(),
            platform: 'windows'
          };
          resolve({ success: true, output: stdout.trim() });
        }
      });
    });
  }

  /**
   * Affiche une notification macOS
   */
  async showMacNotification(message, title = 'Information') {
    if (!this.isMacOS) {
      throw new Error('Notification macOS non supportée sur cette plateforme');
    }

    const command = `osascript -e 'display notification "${message}" with title "${title}"'`;
    
    return new Promise((resolve, reject) => {
      exec(command, (error, stdout, stderr) => {
        if (error) {
          reject(new Error(`Erreur notification macOS: ${error.message}`));
        } else {
          this.lastNotification = {
            type: 'notification',
            message,
            title,
            timestamp: new Date(),
            platform: 'macos'
          };
          resolve({ success: true });
        }
      });
    });
  }

  /**
   * Affiche une notification Linux (via notify-send)
   */
  async showLinuxNotification(message, title = 'Information') {
    if (!this.isLinux) {
      throw new Error('Notification Linux non supportée sur cette plateforme');
    }

    const command = `notify-send "${title}" "${message}"`;
    
    return new Promise((resolve, reject) => {
      exec(command, (error, stdout, stderr) => {
        if (error) {
          reject(new Error(`Erreur notification Linux: ${error.message}`));
        } else {
          this.lastNotification = {
            type: 'notification',
            message,
            title,
            timestamp: new Date(),
            platform: 'linux'
          };
          resolve({ success: true });
        }
      });
    });
  }

  /**
   * Affiche une notification console formatée
   */
  showConsoleNotification(message, title = 'Information', level = 'info') {
    const timestamp = new Date().toLocaleTimeString('fr-FR');
    const separator = '='.repeat(60);
    
    let prefix = '';
    switch (level.toLowerCase()) {
      case 'error':
        prefix = '❌ ERREUR';
        break;
      case 'warning':
        prefix = '⚠️  ATTENTION';
        break;
      case 'success':
        prefix = '✅ SUCCÈS';
        break;
      case 'info':
      default:
        prefix = 'ℹ️  INFO';
        break;
    }
    
    console.log(`\n${separator}`);
    console.log(`${prefix} - ${title} [${timestamp}]`);
    console.log(separator);
    console.log(message);
    console.log(separator);
    
    this.lastNotification = {
      type: 'console',
      message,
      title,
      level,
      timestamp: new Date(),
      platform: process.platform
    };
    
    return { success: true };
  }

  /**
   * Notification adaptative selon la plateforme
   */
  async notify(message, title = 'Information', options = {}) {
    const {
      level = 'info',
      forceConsole = false,
      silent = false
    } = options;

    if (silent) {
      return { success: true, skipped: true };
    }

    try {
      // Forcer la console si demandé
      if (forceConsole) {
        return this.showConsoleNotification(message, title, level);
      }

      // Notification système selon la plateforme
      if (this.isWindows) {
        return await this.showWindowsPopup(message, title);
      } else if (this.isMacOS) {
        return await this.showMacNotification(message, title);
      } else if (this.isLinux) {
        return await this.showLinuxNotification(message, title);
      } else {
        // Fallback vers console
        return this.showConsoleNotification(message, title, level);
      }
      
    } catch (error) {
      // Fallback vers console en cas d'erreur
      console.warn('Notification système échouée, utilisation console:', error.message);
      return this.showConsoleNotification(message, title, level);
    }
  }

  /**
   * Notification de succès
   */
  async notifySuccess(message, title = 'Opération réussie') {
    return this.notify(message, title, { level: 'success' });
  }

  /**
   * Notification d'erreur
   */
  async notifyError(message, title = 'Erreur') {
    return this.notify(message, title, { level: 'error' });
  }

  /**
   * Notification d'avertissement
   */
  async notifyWarning(message, title = 'Attention') {
    return this.notify(message, title, { level: 'warning' });
  }

  /**
   * Notification d'information
   */
  async notifyInfo(message, title = 'Information') {
    return this.notify(message, title, { level: 'info' });
  }

  /**
   * Obtient les informations sur la dernière notification
   */
  getLastNotification() {
    return this.lastNotification;
  }

  /**
   * Test des capacités de notification
   */
  async testNotifications() {
    const capabilities = this.detectCapabilities();
    const results = {};
    
    try {
      results.console = this.showConsoleNotification(
        'Test de notification console', 
        'Test Système'
      );
    } catch (error) {
      results.console = { success: false, error: error.message };
    }
    
    if (capabilities.system) {
      try {
        results.system = await this.notify(
          'Test de notification système', 
          'Test Système'
        );
      } catch (error) {
        results.system = { success: false, error: error.message };
      }
    }
    
    return {
      capabilities,
      results,
      platform: process.platform
    };
  }
}

module.exports = NotificationService;
