/**
 * Formatage de texte et chaînes de caractères
 * Responsabilité unique : manipulation et formatage de strings
 */

class TextFormatter {
  /**
   * Constantes pour le formatage
   */
  static get CONSTANTS() {
    return {
      TREE_SYMBOLS: {
        BRANCH: '├── ',
        LAST_BRANCH: '└── ',
        VERTICAL: '│   ',
        SPACE: '    '
      },
      SEPARATORS: {
        SECTION: '='.repeat(50),
        SUBSECTION: '-'.repeat(30),
        LINE: '_'.repeat(20)
      }
    };
  }

  /**
   * Échappe les caractères spéciaux pour l'affichage
   */
  static escapeSpecialChars(text) {
    return text
      .replace(/\r/g, '\\r')
      .replace(/\n/g, '\\n')
      .replace(/\t/g, '\\t');
  }

  /**
   * Tronque un texte avec points de suspension
   */
  static truncate(text, maxLength, suffix = '...') {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength - suffix.length) + suffix;
  }

  /**
   * Ajoute un padding à gauche
   */
  static padLeft(text, width, char = ' ') {
    return text.toString().padStart(width, char);
  }

  /**
   * Ajoute un padding à droite
   */
  static padRight(text, width, char = ' ') {
    return text.toString().padEnd(width, char);
  }

  /**
   * Centre un texte dans une largeur donnée
   */
  static center(text, width, char = ' ') {
    const str = text.toString();
    if (str.length >= width) return str;
    
    const padding = width - str.length;
    const leftPad = Math.floor(padding / 2);
    const rightPad = padding - leftPad;
    
    return char.repeat(leftPad) + str + char.repeat(rightPad);
  }

  /**
   * Formate un en-tête de section
   */
  static formatSectionHeader(title, level = 1) {
    const separators = this.CONSTANTS.SEPARATORS;
    const separator = level === 1 ? separators.SECTION : 
                     level === 2 ? separators.SUBSECTION : 
                     separators.LINE;
    
    return `\n${separator}\n${this.center(title, separator.length)}\n${separator}\n`;
  }

  /**
   * Formate une liste avec des puces
   */
  static formatBulletList(items, bullet = '• ') {
    return items.map(item => `${bullet}${item}`).join('\n');
  }

  /**
   * Formate une liste numérotée
   */
  static formatNumberedList(items, startNum = 1) {
    const maxNum = startNum + items.length - 1;
    const width = maxNum.toString().length;
    
    return items.map((item, index) => {
      const num = startNum + index;
      return `${this.padLeft(num, width)}. ${item}`;
    }).join('\n');
  }

  /**
   * Formate un tableau simple en colonnes
   */
  static formatTable(rows, headers = null, separator = ' | ') {
    if (!rows.length) return '';
    
    const allRows = headers ? [headers, ...rows] : rows;
    const colCount = Math.max(...allRows.map(row => row.length));
    
    // Calcule la largeur de chaque colonne
    const colWidths = Array(colCount).fill(0);
    allRows.forEach(row => {
      row.forEach((cell, index) => {
        const cellStr = (cell || '').toString();
        colWidths[index] = Math.max(colWidths[index], cellStr.length);
      });
    });
    
    // Formate chaque ligne
    const formatRow = (row, isHeader = false) => {
      const formattedCells = row.map((cell, index) => {
        const cellStr = (cell || '').toString();
        return this.padRight(cellStr, colWidths[index]);
      });
      
      let result = formattedCells.join(separator);
      
      if (isHeader) {
        const headerSeparator = '\n' + colWidths.map(width => 
          '-'.repeat(width)
        ).join(separator.replace(/[^-]/g, '-'));
        result += headerSeparator;
      }
      
      return result;
    };
    
    let result = '';
    if (headers) {
      result += formatRow(headers, true) + '\n';
      result += rows.map(row => formatRow(row)).join('\n');
    } else {
      result = rows.map(row => formatRow(row)).join('\n');
    }
    
    return result;
  }

  /**
   * Formate des statistiques clé-valeur
   */
  static formatKeyValuePairs(pairs, keyWidth = null, separator = ': ') {
    if (!pairs || typeof pairs !== 'object') return '';
    
    const entries = Object.entries(pairs);
    if (!entries.length) return '';
    
    const maxKeyWidth = keyWidth || Math.max(...entries.map(([key]) => key.length));
    
    return entries.map(([key, value]) => {
      const paddedKey = this.padRight(key, maxKeyWidth);
      return `${paddedKey}${separator}${value}`;
    }).join('\n');
  }

  /**
   * Formate une durée en texte lisible
   */
  static formatDuration(ms) {
    if (ms < 1000) {
      return `${ms}ms`;
    } else if (ms < 60000) {
      return `${(ms / 1000).toFixed(2)}s`;
    } else {
      const minutes = Math.floor(ms / 60000);
      const seconds = ((ms % 60000) / 1000).toFixed(2);
      return `${minutes}m ${seconds}s`;
    }
  }

  /**
   * Formate une taille de fichier
   */
  static formatFileSize(bytes) {
    if (bytes === 0) return '0 B';
    
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    const k = 1024;
    const dm = 2;
    
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    const size = parseFloat((bytes / Math.pow(k, i)).toFixed(dm));
    
    return `${size} ${units[i]}`;
  }
}

module.exports = TextFormatter;
