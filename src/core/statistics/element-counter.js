/**
 * Compteur d'éléments avec statistiques avancées
 * Responsabilité unique : calculs statistiques sur les collections
 */

class ElementCounter {
  /**
   * Compte les éléments par type
   */
  static countByType(items, predicate) {
    return items.filter(predicate).length;
  }

  /**
   * Compte les éléments racine (sans séparateur de chemin)
   */
  static countRootElements(items) {
    return this.countByType(items, item => 
      !item.includes('/') && !item.includes('\\')
    );
  }

  /**
   * Compte les éléments par niveau de profondeur
   */
  static countByDepth(items) {
    const depthCounts = {};
    
    items.forEach(item => {
      const normalized = item.replace(/\\/g, '/');
      const depth = normalized.split('/').length - 1;
      depthCounts[depth] = (depthCounts[depth] || 0) + 1;
    });
    
    return depthCounts;
  }

  /**
   * Trouve la profondeur maximale
   */
  static getMaxDepth(items) {
    let maxDepth = 0;
    
    items.forEach(item => {
      const normalized = item.replace(/\\/g, '/');
      const depth = normalized.split('/').length - 1;
      maxDepth = Math.max(maxDepth, depth);
    });
    
    return maxDepth;
  }

  /**
   * Obtient des statistiques complètes sur une collection
   */
  static getDetailedStats(items, label = 'éléments') {
    const total = items.length;
    const rootCount = this.countRootElements(items);
    const depthCounts = this.countByDepth(items);
    const maxDepth = this.getMaxDepth(items);
    
    return {
      total,
      rootCount,
      nestedCount: total - rootCount,
      depthCounts,
      maxDepth,
      label,
      summary: `${total} ${label} (${rootCount} racine, ${total - rootCount} imbriqués)`
    };
  }

  /**
   * Compare les statistiques de deux collections
   */
  static compareStats(items1, label1, items2, label2) {
    const stats1 = this.getDetailedStats(items1, label1);
    const stats2 = this.getDetailedStats(items2, label2);
    
    return {
      [label1]: stats1,
      [label2]: stats2,
      total: stats1.total + stats2.total,
      summary: `${stats1.total} ${label1}, ${stats2.total} ${label2} (total: ${stats1.total + stats2.total})`
    };
  }
}

module.exports = ElementCounter;
