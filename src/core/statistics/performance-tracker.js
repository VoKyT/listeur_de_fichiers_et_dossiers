/**
 * Traqueur de performances et chronométrage
 * Responsabilité unique : mesure et formatage des temps d'exécution
 */

class PerformanceTracker {
  constructor() {
    this.startTime = null;
    this.milestones = {};
  }

  /**
   * Démarre le chronométrage
   */
  start() {
    this.startTime = Date.now();
    return this.startTime;
  }

  /**
   * Enregistre un jalon temporel
   */
  milestone(name) {
    if (!this.startTime) {
      throw new Error('Performance tracking not started');
    }
    this.milestones[name] = Date.now();
    return this.milestones[name];
  }

  /**
   * Calcule la durée depuis le début
   */
  getDurationFromStart(endTime = Date.now()) {
    if (!this.startTime) {
      throw new Error('Performance tracking not started');
    }
    return endTime - this.startTime;
  }

  /**
   * Calcule la durée entre deux jalons
   */
  getDurationBetween(startMilestone, endMilestone) {
    const start = this.milestones[startMilestone] || this.startTime;
    const end = this.milestones[endMilestone] || Date.now();
    return end - start;
  }

  /**
   * Formate une durée en millisecondes en format lisible
   */
  static formatDuration(milliseconds) {
    if (milliseconds < 1000) {
      return `${milliseconds}ms`;
    } else if (milliseconds < 60000) {
      const seconds = (milliseconds / 1000).toFixed(2);
      return `${seconds}s`;
    } else {
      const minutes = Math.floor(milliseconds / 60000);
      const seconds = ((milliseconds % 60000) / 1000).toFixed(1);
      return `${minutes}min ${seconds}s`;
    }
  }

  /**
   * Obtient un rapport de performance complet
   */
  getReport() {
    const now = Date.now();
    const totalDuration = this.getDurationFromStart(now);
    
    const report = {
      totalDuration: totalDuration,
      formattedTotal: PerformanceTracker.formatDuration(totalDuration),
      milestones: {}
    };

    // Ajoute les durées des jalons
    Object.keys(this.milestones).forEach(milestone => {
      const duration = this.milestones[milestone] - this.startTime;
      report.milestones[milestone] = {
        duration: duration,
        formatted: PerformanceTracker.formatDuration(duration)
      };
    });

    return report;
  }
}

module.exports = PerformanceTracker;
