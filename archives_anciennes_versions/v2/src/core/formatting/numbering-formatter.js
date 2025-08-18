/**
 * Formateur de numérotation adaptative
 * Responsabilité unique : formatage des numéros avec padding
 */

class NumberingFormatter {
  /**
   * Calcule le nombre de chiffres nécessaires pour la numérotation
   */
  static calculateDigits(maxNumber) {
    return maxNumber > 0 ? maxNumber.toString().length : 1;
  }

  /**
   * Formate un numéro avec padding de zéros
   */
  static formatNumber(number, totalDigits) {
    return number.toString().padStart(totalDigits, '0');
  }

  /**
   * Formate un numéro local avec padding adaptatif
   */
  static formatLocalNumber(index, maxCount) {
    const digits = this.calculateDigits(maxCount);
    return this.formatNumber(index + 1, digits);
  }

  /**
   * Obtient le préfixe d'arborescence approprié
   */
  static getTreePrefix(isLastItem) {
    return isLastItem ? '└──' : '├──';
  }

  /**
   * Calcule l'indentation pour les enfants
   */
  static getChildIndentation(parentIndent, isLastParent) {
    return isLastParent ? parentIndent + '    ' : parentIndent + '│   ';
  }

  /**
   * Formate une ligne d'élément avec numérotation
   */
  static formatElementLine(indent, prefix, number, name, suffix = '') {
    return `${indent}${prefix} ${number}. ${name}${suffix}`;
  }
}

module.exports = NumberingFormatter;
