/**
 * Gestionnaire de progression et suivi d'état
 * Responsabilité unique : tracking des opérations en cours
 */

class ProgressTracker {
  constructor() {
    this.currentOperation = null;
    this.operationStack = [];
    this.callbacks = new Map();
  }

  /**
   * Démarre une nouvelle opération
   */
  startOperation(name, totalSteps = 0) {
    if (this.currentOperation) {
      this.operationStack.push(this.currentOperation);
    }
    
    this.currentOperation = {
      name,
      totalSteps,
      currentStep: 0,
      startTime: Date.now(),
      status: 'in_progress'
    };
    
    this.notifyCallbacks('start', this.currentOperation);
    return this.currentOperation;
  }

  /**
   * Met à jour le progrès de l'opération courante
   */
  updateProgress(step, message = '') {
    if (!this.currentOperation) return;
    
    this.currentOperation.currentStep = step;
    this.currentOperation.message = message;
    
    if (this.currentOperation.totalSteps > 0) {
      this.currentOperation.percentage = Math.round(
        (step / this.currentOperation.totalSteps) * 100
      );
    }
    
    this.notifyCallbacks('progress', this.currentOperation);
  }

  /**
   * Incrémente le progrès d'une étape
   */
  incrementProgress(message = '') {
    if (!this.currentOperation) return;
    
    this.updateProgress(this.currentOperation.currentStep + 1, message);
  }

  /**
   * Termine l'opération courante
   */
  completeOperation(result = null) {
    if (!this.currentOperation) return;
    
    this.currentOperation.status = 'completed';
    this.currentOperation.endTime = Date.now();
    this.currentOperation.duration = this.currentOperation.endTime - this.currentOperation.startTime;
    this.currentOperation.result = result;
    
    this.notifyCallbacks('complete', this.currentOperation);
    
    const completed = this.currentOperation;
    this.currentOperation = this.operationStack.pop() || null;
    
    return completed;
  }

  /**
   * Échoue l'opération courante
   */
  failOperation(error) {
    if (!this.currentOperation) return;
    
    this.currentOperation.status = 'failed';
    this.currentOperation.endTime = Date.now();
    this.currentOperation.duration = this.currentOperation.endTime - this.currentOperation.startTime;
    this.currentOperation.error = error;
    
    this.notifyCallbacks('error', this.currentOperation);
    
    const failed = this.currentOperation;
    this.currentOperation = this.operationStack.pop() || null;
    
    return failed;
  }

  /**
   * Obtient l'état actuel
   */
  getCurrentState() {
    return {
      current: this.currentOperation,
      stack: [...this.operationStack],
      isActive: this.currentOperation !== null
    };
  }

  /**
   * Enregistre un callback pour les événements
   */
  onProgress(callback) {
    const id = Symbol('progress-callback');
    this.callbacks.set(id, callback);
    return () => this.callbacks.delete(id);
  }

  /**
   * Notifie tous les callbacks
   */
  notifyCallbacks(event, data) {
    this.callbacks.forEach(callback => {
      try {
        callback(event, data);
      } catch (error) {
        console.error('Erreur dans callback de progression:', error);
      }
    });
  }

  /**
   * Formate l'état pour affichage
   */
  formatCurrentState() {
    if (!this.currentOperation) {
      return 'Aucune opération en cours';
    }
    
    const { name, currentStep, totalSteps, percentage, message } = this.currentOperation;
    let status = `${name}`;
    
    if (totalSteps > 0) {
      status += ` (${currentStep}/${totalSteps}`;
      if (percentage !== undefined) {
        status += ` - ${percentage}%`;
      }
      status += ')';
    } else if (currentStep > 0) {
      status += ` (étape ${currentStep})`;
    }
    
    if (message) {
      status += ` - ${message}`;
    }
    
    return status;
  }
}

module.exports = ProgressTracker;
